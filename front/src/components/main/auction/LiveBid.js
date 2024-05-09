import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import '../../../styles/main/liveAuction/LiveAuction.css';
import { AiFillPushpin } from 'react-icons/ai';
import { AiFillRocket } from 'react-icons/ai';
import Swal from 'sweetalert2';
import axios from 'axios';
import LivePay from './LivePay';

const LiveBid = ({ liveArtData, endDate, onBidSuccess, setLiveArtData, isOpen, setIsOpen }) => {
  const [inputValue, setInputValue] = useState('');
  const [priceHistory, setPriceHistory] = useState([{ time: new Date(), price: liveArtData.liveAuctionInfo.ac_now_price }]);
  const [currentPrice, setCurrentPrice] = useState(liveArtData.liveAuctionInfo.ac_now_price); // 가격상태
  const [userEmail, setUserEmail] = useState('');
  const [infoData, setInfoData] = useState();
  const [userRank, setUserRank] = useState({
    rankLevel: '',
    rankPoint: '',
  });
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 18);
  const currentTimeString = currentTime.toISOString();

  const client = useRef(null);

  // 이전 입찰금 상태를 숫자로 저장합니다.
  const [previousPoint, setPreviousPoint] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:4000/chat/nickname', { withCredentials: true });
        setUserEmail(response.data.userEmail);
        fetchUserRank(response.data.userEmail); // 이메일을 받은 후 랭크 데이터 요청
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
      }
    };
    getUserInfo();
  }, []);

  const fetchUserRank = async (userEmail) => {
    try {
      const response = await axios.post('http://localhost:4000/liveAuction/rank', { userEmail });
      setUserRank({ rankLevel: response.data.rankLevel, rankPoint: response.data.rankPoint });
    } catch (error) {
      console.error('랭크 데이터를 가져오지 못했습니다.', error);
    }
  };
  // 포인트 실시간 업데이트
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isOpen) {
        fetchUserRank(userEmail);
      }
    }, 3000); //모달 안열렸을때 5초마다
    return () => clearInterval(intervalId);
  }, [isOpen, userEmail]);

  const handleChange = (event) => {
    const inputValue = event.target.value;
    const availablePoint = parseInt(userRank.rankPoint); // 사용 가능한 포인트
    const bidValue = parseInt(inputValue); // 사용자가 입력한 입찰 금액

    // 사용자가 입력한 입찰 금액이 사용 가능한 포인트를 초과하는 경우
    if (bidValue > availablePoint) {
      // 사용 가능한 포인트 이상으로는 입력할 수 없음을 알림
      Swal.fire({
        title: '입찰 실패',
        text: '사용 가능한 포인트를 초과하여 입력할 수 없습니다',
        confirmButtonText: '확인',
        confirmButtonColor: '#000',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
      return;
    } else if (bidValue > liveArtData.liveAuctionInfo.ac_instant_price) {
      // 즉시입찰가를 초과하여 입력할 수 없음을 알림
      Swal.fire({
        title: '입찰 실패',
        text: '즉시입찰가를 초과하여 입력할 수 없습니다',
        confirmButtonText: '확인',
        confirmButtonColor: '#000',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
      return;
    }
    // 사용 가능한 포인트 이내의 입찰 금액이면 inputValue 상태 업데이트
    setInputValue(inputValue);
  };

  const handleBidButtonClick = async () => {
    const bidValue = parseInt(inputValue);
    if (isNaN(bidValue) || bidValue < liveArtData.liveAuctionInfo.ac_now_price) {
      Swal.fire({
        title: '입찰 실패',
        text: '입찰 금액이 부족합니다',
        confirmButtonText: '확인',
        confirmButtonColor: '#000',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      });
      return;
    } else {
      await Swal.fire({
        title: '입찰 확인',
        text: '입찰하시겠습니까?',
        showCancelButton: true,
        confirmButtonText: '입찰',
        cancelButtonText: '취소',
        confirmButtonColor: '#000',
        showClass: {
          popup: 'animate__animated animate__fadeInDown',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp',
        },
      }).then(async (res) => {
        if (res.isConfirmed) {
          if (previousPoint !== null && previousPoint !== inputValue) {
            // 이전에 입찰한 금액 복구
            await axios.post('http://localhost:4000/liveAuction/point/restore', {
              userEmail: userEmail,
              pointCharge: previousPoint,
            });
          }
          const bidData = {
            ac_now_price: inputValue,
          };
          await postBidInfo();
          client.current.send(JSON.stringify(bidData));
          onBidSuccess(inputValue);
          setPriceHistory((prevPriceHistory) => [...prevPriceHistory, { time: new Date(), price: inputValue }]);
          setInputValue('');
          //입찰 금액 전송
          await axios.post('http://localhost:4000/liveAuction/point/bid', {
            userEmail: userEmail,
            pointCharge: bidValue,
          });
          setPreviousPoint(bidValue);
          fetchUserRank(userEmail); //바로 포인트 변경
          return;
        } else {
          return;
        }
      });
    }
  };

  //입찰정보 db전송
  const postBidInfo = async () => {
    try {
      // 사용자가 입력한 입찰가를 가져옴.
      const bidValue = parseInt(inputValue);

      // 즉시입찰가와 비교하여 적절한 값을 할당.
      const bidPrice = bidValue >= liveArtData.liveAuctionInfo.ac_instant_price ? bidValue : liveArtData.liveAuctionInfo.ac_now_price;

      // 즉시입찰가보다 낮은 경우에는 현재 입찰가를 전송.
      if (bidValue < liveArtData.liveAuctionInfo.ac_instant_price) {
        const response = await axios.post('http://localhost:4000/liveAuction/bid', {
          bidUserEmail: userEmail,
          acProductNo: liveArtData.liveAuctionInfo.ac_product_no,
          bidPrice: bidValue,
          bidTime: currentTimeString,
        });
        setInfoData(response.data);
      } else {
        Swal.fire({
          title: '낙찰 확인',
          text: '낙찰 되었습니다',
          confirmButtonText: '확인',
          confirmButtonColor: '#000',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/myPage';
          }
        });
        // 즉시입찰가보다 높은 경우에는 즉시입찰가를 전송.
        const response = await axios.post('http://localhost:4000/liveAuction/bid', {
          bidUserEmail: userEmail,
          acProductNo: liveArtData.liveAuctionInfo.ac_product_no,
          bidEndPrice: bidPrice,
          bidEndTime: currentTimeString,
        });
        setInfoData(response.data);
      }
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const successBid = () => {
    Swal.fire({
      title: '즉시 입찰 확인',
      text: '즉시 입찰 되었습니다',
      confirmButtonText: '확인',
      confirmButtonColor: '#000',
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post('http://localhost:4000/liveAuction/point/bid', {
          userEmail: userEmail,
          pointCharge: liveArtData.liveAuctionInfo.ac_instant_price,
        });
        const bidData = {
          ac_now_price: liveArtData.liveAuctionInfo.ac_instant_price,
        };
        client.current.send(JSON.stringify(bidData));
        console.log('낙찰금액 : ' + liveArtData.liveAuctionInfo.ac_instant_price);
        console.log('낙찰시간 : ' + currentTimeString);
        axios.post('http://localhost:4000/liveAuction/bid', {
          bidUserEmail: userEmail,
          acProductNo: liveArtData.liveAuctionInfo.ac_product_no,
          bidEndPrice: liveArtData.liveAuctionInfo.ac_instant_price,
          bidEndTime: currentTimeString,
        });
        window.location.href = '/myPage';
      }
    });
  };

  useEffect(() => {
    client.current = new W3CWebSocket('ws://localhost:4000/ws/chat');
    client.current.onopen = () => {
      console.log('WebSocket 연결 성공');
    };
    return () => {
      client.current.close();
    };
  }, []);

  const nFormat = (number) => {
    if (number === undefined || number === null) return '';
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const startDate = new Date(endDate.getTime() - 33 * 60 * 60 * 1000);
  const formattedStartDate = startDate.toLocaleString();
  const formattedEndDate = endDate.toLocaleString();

  // liveArtData.liveAuctionInfo.ac_now_price가 변경될 때만 useEffect 실행
  useEffect(() => {
    setCurrentPrice(liveArtData.liveAuctionInfo.ac_now_price);
  }, [liveArtData.liveAuctionInfo.ac_now_price]);

  return (
    <>
      <div className="liveAuction_info1">
        <div className="liveAuction_time">
          기간: {formattedStartDate} ~ {formattedEndDate}
        </div>
        <div className="liveAuction_img">
          <img src={liveArtData.liveAuctionData.main_image} alt="auction item" />
        </div>
        <div className="liveAuction_title">
          <div className="liveAuction_mainTitle"> {liveArtData.liveAuctionData.prdct_nm_korean}</div>
          <div className="liveAuction_moneys">
            <div className="liveAuction_Money1">현재가 {nFormat(currentPrice)}P</div>
            <div className="vertical-line"></div>
            <div className="liveAuction_Money2">시작가 {nFormat(liveArtData.liveAuctionInfo.ac_start_price)}P</div>
            <div className="vertical-line"></div>
            <div className="liveAuction_Money3">즉시 입찰가 {nFormat(liveArtData.liveAuctionInfo.ac_instant_price)}P</div>
          </div>
        </div>

        <div className="liveAuction_mainSub">{liveArtData.liveAuctionInfo.ac_product_content}</div>

        <div className="liveAuction_bidPoint">보유 포인트 {nFormat(userRank.rankPoint)}P</div>
      </div>
      <div className="liveAuction_info2">
        <div className="liveAuction_moneys2">
          <div className="liveAuction_nowMoney">
            <div className="liveAuction_Money2">
              <div className="liveAuction_bidPrice">입찰금액</div>
              <div>
                <input type="number" value={inputValue} onChange={handleChange} className="inputBackground" />
              </div>
            </div>
          </div>
        </div>
        <div className="liveAuction_btns">
          <div className="liveAuction_btn1">
            <Button onClick={handleBidButtonClick}>
              <AiFillPushpin />
              입찰
            </Button>
          </div>
          <div className="liveAuction_btn2">
            <Button onClick={successBid}>
              <AiFillRocket />
              즉시입찰
            </Button>
          </div>
          <LivePay setLiveArtData={setLiveArtData} liveArtData={liveArtData} isOpen={isOpen} setIsOpen={setIsOpen} fetchRank={fetchUserRank} />
        </div>
      </div>
    </>
  );
};

export default LiveBid;
