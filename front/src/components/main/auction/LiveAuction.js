import React, { useEffect, useRef, useState } from 'react';
import Chat from './Chat';
import '../../../styles/main/liveAuction/LiveAuction.css';
import axios from 'axios';
import LiveBid from './LiveBid';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from 'recharts';
import Swal from 'sweetalert2';

const LiveAuction = () => {
  const [liveArtData, setLiveArtData] = useState({ liveAuctionData: [], liveAuctionInfo: [] });
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [endDate, setEndDate] = useState(new Date('2024-05-09T18:30:00'));
  const [priceHistory, setPriceHistory] = useState(() => {
    const storedPriceHistory = localStorage.getItem('priceHistory');
    return storedPriceHistory ? JSON.parse(storedPriceHistory) : [{ time: new Date(), price: 0 }];
  });
  const [isOpen, setIsOpen] = useState(false);
  const chartRef = useRef(null);

  //입찰기록받아서 그래프 값으로씀
  const handleBidSuccess = (value) => {
    const newData = { time: new Date(), price: value };
    setPriceHistory((prevPriceHistory) => {
      const newPriceHistory = [...prevPriceHistory, newData];
      localStorage.setItem('priceHistory', JSON.stringify(newPriceHistory));
      return newPriceHistory;
    });
  };

  // 남은 시간 계산 함수
  function calculateRemainingTime() {
    const now = new Date();
    const remainingTime = endDate - now;

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  // 상품테이블, 경매테이블 불러옴 모달창 열렸을땐 x
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/liveAuction/getData');
        setLiveArtData(response.data);

        //현재가와 즉구가 같으면 경매종료띄우기
        if (response.data.liveAuctionInfo.ac_instant_price === response.data.liveAuctionInfo.ac_now_price) {
          endBid();
        }
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      }
    };
    fetchLiveData();
  }, [isOpen]);

  const endBid = () => {
    Swal.fire({
      title: '경매 종료',
      text: '실시간 경매가 종료되었습니다',
      confirmButtonText: '메인으로',
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
  };

  //타이머설정, 모달창 열렸을땐 동작x
  useEffect(
    () => {
      const timer = setTimeout(() => {
        if (!isOpen) {
          setTime(calculateRemainingTime());
        }
      }, 1000);

      return () => clearTimeout(timer);
    },
    [time],
    [isOpen]
  );

  return (
    <div className="liveAuction_div">
      <div className="liveAuction_main">
        <div className="liveAuction_infoBox">
          <div className="liveAuction_remainingTime">
            <div className="liveAuction_remainingTime_text">
              남은시간: {time.hours.toString().padStart(2, '0')}:{time.minutes.toString().padStart(2, '0')}:{time.seconds.toString().padStart(2, '0')}
            </div>
          </div>
          <LiveBid liveArtData={liveArtData} endDate={endDate} setLiveArtData={setLiveArtData} onBidSuccess={handleBidSuccess} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>

        <div className="liveAuction_chatBox">
          <div className="liveAuction_chat">
            <div className="liveAuction_graph_main">
              <div className="liveAuction_graph_title">입찰 금액 그래프</div>

              <ResponsiveContainer width="90%" height="67%" className="liveAuction_graph" ref={chartRef}>
                <ComposedChart
                  width={400}
                  height={400}
                  data={priceHistory}
                  margin={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <CartesianGrid stroke="#225" />
                  <XAxis scale="band" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="price" barSize={20} fill="#000" />
                  <Line type="monotone" dataKey="price" stroke="#ffdc3c" />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="liveAuction_graph_title_sub">*그래프는 실시간으로 변동됩니다.</div>
            </div>
            <Chat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAuction;
