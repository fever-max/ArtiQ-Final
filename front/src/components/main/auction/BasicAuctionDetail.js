import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useHistory } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import moment from 'moment';
import { animateScroll as scroll } from 'react-scroll';
import '../../../styles/main/auction/BasicAuctionDetail.css';
import '../../../styles/main/auction/BasicAuctionDetailModal.css';

function BasicAuctionDetail() {
  const [auctionData, setAuctionData] = useState({ artData: [], artData2: [] });
  const { id } = useParams();
  const [artDetail, setArtDetail] = useState({ artData: null, artData2: [] });
  const [otherArts, setOtherArts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;
  const [userEmail, setUserEmail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [userHasBid, setUserHasBid] = useState(false); // 입찰여부 확인
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [rankPoint, setRankPoint] = useState(0); // 사용자 포인트 상태 추가
  const history = useHistory();

  //관심상품 추가
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function fetchRankPoint() {
      if (userEmail) {
        try {
          const response = await axios.get(`http://localhost:4000/rankPoint/${userEmail}`);
          if (response.status === 200) {
            setRankPoint(response.data.rankPoint);
          } else {
            alert('랭크 포인트를 불러오는 데 실패했습니다.');
          }
        } catch (error) {
          console.error('랭크 포인트 조회 중 오류 발생:', error);
          alert('서버 오류로 인해 랭크 포인트를 조회할 수 없습니다.');
        }
      }
    }

    fetchRankPoint();
  }, [userEmail]); // userEmail이 변경되면 랭크 포인트를 재조회

  // 입찰할때 사용 부분
  const handleBidSubmit = async () => {
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() + 9);
    const bidTime2 = moment().add(9, 'hours').format('YYYY-MM-DDTHH:mm:ss');
    const bidEndTime = new Date(artDetail.artData2[0]?.basicEndTime);
    const bidStartTime = new Date(artDetail.artData2[0]?.basicStartTime);
    const minBidAmount = artDetail.artData2[0]?.min_Mo;

    // 로그인 상태 확인

    // 경매 시간과 최소 입찰 금액 조건 확인

    if (!userEmail) {
      alert('로그인좀ㅋ');
      return;
    }
    if (currentDateTime < bidStartTime) {
      alert('경매가 아직 시작되지 않았습니다.');
      return;
    } else if (currentDateTime > bidEndTime) {
      alert('경매가 종료되었습니다.');
      return;
    } else if (parseFloat(bidAmount) < minBidAmount) {
      alert(`최소 입찰 금액은 ${minBidAmount} 입니다.`);
      return;
    }
    if (parseInt(rankPoint) < parseInt(bidAmount)) {
      alert(`포인트가 부족함 ㅋ 현재 포인트: ${rankPoint}`);
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/bid', {
        acProductNo: id,
        bidPrice: bidAmount,
        bidUserEmail: userEmail,
        bidTime: bidTime2,
      });

      if (response.status === 200) {
        console.log('Bid submitted successfully');
        alert('입찰완료ㅋ');
        window.location.reload(); // 페이지 새로고침
      } else {
        // 서버가 성공 이외의 상태 코드를 반환했을 때의 처리
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Failed to submit bid:', error);
      // 네트워크 에러 또는 서버 에러 응답 처리
      alert('입찰 실패: 서버 에러 또는 네트워크 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    console.log('Updated Rank Point:', rankPoint);
  }, [rankPoint]);

  const handleUpdateBid = async () => {
    try {
      const updateResponse = await axios.put('http://localhost:4000/updateBid', {
        bidUserEmail: userEmail,
        acProductNo: id,
        bidPrice: bidAmount,
      });
      if (updateResponse.status === 200) {
        console.log('Bid updated successfully');
        alert('입찰 수정 완료ㅋ');
        // 업데이트된 포인트 정보를 상태에 반영하거나 필요한 추가 액션 수행
        setIsModalOpen(false); // 수정이 완료되면 모달을 닫음
        window.location.reload(); // 페이지 새로고침
      } else {
        console.error('Unexpected response status:', updateResponse.status);
        alert(`입찰 수정 실패: ${updateResponse.statusText}`);
      }
    } catch (error) {
      console.error('Failed to update bid:', error);
      alert('입찰 수정 실패: 서버 에러 또는 네트워크 문제가 발생했습니다.');
    }
  };

  const handleDeleteBid = async () => {
    try {
      // 요청을 보낼 때 BidEntity 객체 형식에 맞춰 데이터를 전송합니다.
      const deleteResponse = await axios.delete('http://localhost:4000/deletebid', {
        data: {
          acProductNo: id, // 예를 들어 상품 ID
          bidUserEmail: userEmail, // 사용자 이메일
        },
      });

      if (deleteResponse.status === 200) {
        console.log('Bid deleted successfully');
        alert('입찰이 성공적으로 삭제되었습니다. 포인트가 반환되었습니다.');
        // 성공 처리 로직: 상태 업데이트, 모달 닫기 등
        setIsModalOpen(false); // 모달 닫기
      } else {
        console.error('Unexpected response status:', deleteResponse.status);
        alert('입찰 삭제 실패: ' + deleteResponse.statusText);
      }
    } catch (error) {
      console.error('Failed to delete bid:', error);
      alert('입찰 삭제 실패: 서버 에러 또는 네트워크 문제가 발생했습니다.');
    }
  };

  // 사용자 입찰 정보 확인
  const checkUserBid = async () => {
    if (userEmail && id) {
      // userEmail과 id가 설정된 경우에만 요청 수행
      try {
        const response = await axios.post(`http://localhost:4000/bids/${id}`, {
          bidUserEmail: userEmail,
          acProductNo: id,
        });
        // 서버에서 명확하게 입찰 여부를 확인할 수 있는 값을 반환하도록 조정 필요
        setUserHasBid(response.data ? true : false); // 서버 응답에 따라 상태 업데이트
      } catch (error) {
        console.error('Error fetching bid info:', error);
        setUserHasBid(false); // 에러 발생 시 입찰 상태를 false로 설정
      }
    }
  };

  //기범추가 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
  const fetchFavorData = async () => {
    if (userEmail && id) {
      // userEmail과 id가 설정된 경우에만 요청 수행
      try {
        const response1 = await axios.post('http://localhost:4000/BasicAuction/favorExist', {
          fvUserEmail: userEmail,
          acProductNo: id,
        });
        console.log(response1.data);
        setIsFavorite(response1.data ? true : false);
      } catch (error) {
        console.error('Error fetching bid info:', error);
        setIsFavorite(false); // 에러 발생 시 입찰 상태를 false로 설정
      }
    }
  };
  //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

  // userEmail과 id가 설정되었을 때만 checkUserBid를 호출
  useEffect(() => {
    if (userEmail && id) {
      checkUserBid();
      fetchFavorData();
    }
  }, [userEmail, id]); // 의존성 배열에 userEmail과 id 추가

  useEffect(() => {
    async function fetchData() {
      try {
        const detailResponse = await axios.get(`http://localhost:4000/basicAuctionDetail/${id}`);
        if (detailResponse.data) {
          setArtDetail({
            artData: detailResponse.data.artData,
            artData2: detailResponse.data.artData2,
            bidCount: detailResponse.data.bidCount,
          });
        }
        const auctionResponse = await axios.get('http://localhost:4000/basicAuction');
        setAuctionData(auctionResponse.data);

        const otherResponse = await axios.get('http://localhost:4000/basicAuction');
        const filteredData = otherResponse.data.artData.filter((art) => art.artId !== parseInt(id));
        setOtherArts(filteredData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }

    fetchData();
  }, [id, history]);

  // artData2 로드 확인
  useEffect(() => {
    console.log('Loaded artData2:', artDetail.artData2);
  }, [artDetail.artData2]);

  //토큰 이메일 갖고오기
  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const response = await axios.get('http://localhost:4000/getEmail', {
          withCredentials: true,
        });

        console.log(response.data);
        setUserEmail(response.data.userEmail); // 응답 데이터에서 userEmail을 추출하여 상태로 설정
      } catch (error) {
        console.error('이메일을 가져오는 데 실패했습니다.', error);
        setUserEmail(null);
      }
    };
    getUserEmail();
  }, []);

  // 경매 상태 관련
  function getAuctionStatus2(startTime, endTime) {
    const now = new Date(); // 현재 시각
    now.setHours(now.getHours() + 9);
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (now < startDate) {
      return { statusText: '경매 대기중', statusClass: 'auction-waiting' };
    } else if (now >= startDate && now <= endDate) {
      return { statusText: '경매 진행중', statusClass: 'auction-active' };
    } else {
      return { statusText: '경매 종료', statusClass: 'auction-ended' };
    }
  }
  function formatDateToKST(dateString) {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 9); // UTC에서 9시간을 빼서 KST 시간대로 조정
    return date.toLocaleString();
  }

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  //페이징 처리 관련
  const offset = currentPage * itemsPerPage;
  const currentPageData = otherArts.slice(offset, offset + itemsPerPage);

  //디테일화면 데이터 못불러올때 나옴
  if (!artDetail.artData) {
    return <div>Loading data...</div>;
  }

  //관심여부 추가(기범)ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
  const favorite = async () => {
    try {
      const Status = isFavorite ? '2' : '1'; // 토글

      // 상태 업데이트
      setIsFavorite(!isFavorite);
      // axios.post 호출
      await axios.post('http://localhost:4000/BasicAuction/favorite', {
        fvUserEmail: userEmail,
        acProductNo: id,
        favoriteStatus: Status,
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };
  //ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
  const currentAuctionStatus = artDetail.artData2.length > 0 ? getAuctionStatus2(artDetail.artData2[0].basicStartTime, artDetail.artData2[0].basicEndTime) : { statusText: '', statusClass: '' };

  let buttonLabel = '입찰하기'; // 기본값
  if (currentAuctionStatus.statusText === '경매 종료') {
    buttonLabel = '경매종료 입찰불가';
  } else if (currentAuctionStatus.statusText === '경매 대기중') {
    buttonLabel = '경매대기중 입찰불가';
  }

  const scrollToTop = () => {
    scroll.scrollToTop({
      duration: 500, // 애니메이션 지속 시간
      smooth: 'easeInOutQuart', // 애니메이션 이징
    });
  };

  const handleClick = () => {
    scrollToTop();
  };
  return (
    <div>
      <div className="art-detail-container">
        <div className="art-image" style={{ position: 'relative' }}>
          <img src={artDetail.artData.main_image} alt={artDetail.artData.prdct_nm_korean} />
          {artDetail.artData2.map((art2, index) => {
            const auctionStatus = getAuctionStatus2(art2.basicStartTime, art2.basicEndTime);
            return (
              <div key={index} className={`auction-status ${auctionStatus.statusClass}`}>
                {auctionStatus.statusText}
              </div>
            );
          })}
        </div>
        <div className="art-info">
          {artDetail.artData2.map((art2, index) => (
            <div key={index}>
              <p className="art-info-title">예상 금액 (최소 입찰 금액: {art2.min_Mo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P) </p>
              <div className="art-info-title-money">{art2.bid_Amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P</div>
            </div>
          ))}

          <div className="art-info-Detail-name">{artDetail.artData.prdct_nm_korean}</div>

          <div className="art-info-Detail-sub1">
            {artDetail.artData.writr_nm} / {artDetail.artData.manage_no_year}
          </div>

          <div className="art-info-Detail-sub2">
            <div className="art-info-Detail-sub-sub">
              <div className="art-info-Detail-sub-sub-name">종류</div>
              <div>{artDetail.artData.prdct_cl_nm}</div>
            </div>

            <div className="vertical-line2"></div>

            <div className="art-info-Detail-sub-sub">
              <div className="art-info-Detail-sub-sub-name">기법</div>
              <div>{artDetail.artData.matrl_technic}</div>
            </div>

            <div className="vertical-line2"></div>

            <div className="art-info-Detail-sub-sub">
              <div className="art-info-Detail-sub-sub-name">크기</div>
              <div>{artDetail.artData.prdct_stndrd}</div>
            </div>
          </div>

          <div className="art-info-Detail-bitCount">현재 입찰자 수: {artDetail.bidCount}명</div>

          <div className="price-action">
            <div className="price">{artDetail.artData2.price}</div>

            {userHasBid ? (
              <button
                className="btn buy-btn"
                onClick={() => setIsModalOpen(true)}
                disabled={currentAuctionStatus.statusText === '경매 종료' || currentAuctionStatus.statusText === '경매 대기중'} // 경매 종료나 대기중 시 버튼 비활성화
              >
                입찰 수정/취소하기
              </button>
            ) : (
              <button
                className="btn buy-btn"
                onClick={() => setIsModalOpen(true)}
                disabled={currentAuctionStatus.statusText === '경매 종료' || currentAuctionStatus.statusText === '경매 대기중'} // 경매 종료나 대기중 시 버튼 비활성화
              >
                {buttonLabel}
              </button>
            )}

            <button className="btn consult-btn" onClick={favorite}>
              {isFavorite ? '관심취소' : '관심등록'}
            </button>
          </div>
        </div>
      </div>

      <div className="art-infoo">
        <h5 className="art-infoo-title">작품 설명</h5>
        {artDetail.artData2.map((art2, index) => (
          <div key={index} className="art-infoo-sub">
            {art2.description_Dd}
          </div>
        ))}
      </div>

      <div className="image-info">
        <h4>다른 작품 보기</h4>
      </div>
      <div className="image-board" onClick={handleClick}>
        {currentPageData.map((art, index) => {
          const art2 = auctionData.artData2.find((a2) => a2.artId2 === art.artId);
          const auctionStatus = art2 ? getAuctionStatus2(art2.basicStartTime, art2.basicEndTime) : { statusText: '관련 데이터 없음', statusClass: 'auction-error' };

          return (
            <Link to={`/basicAuctionDetail/${art.artId}`} key={index}>
              <div className="image-item">
                <img src={art.main_image} alt={art.prdct_nm_korean} />
                <div className={`auction-status ${auctionStatus.statusClass}`}>{auctionStatus.statusText}</div>
                <div className="image-info">
                  <div className="image-details">
                    <h3>{art.prdct_nm_korean}</h3>
                    <p>작가: {art.writr_nm}</p>
                    <p>최소입찰금액: {art2 ? art2.min_Mo : '정보 없음'}</p>
                    <p>예상입찰금액: {art2 ? art2.bid_Amt : '정보 없음'}</p>
                    <p>시작일: {formatDateToKST(art2.basicStartTime)}</p>
                    <p>종료일: {formatDateToKST(art2.basicEndTime)}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} contentLabel="Bid Modal" className="modal-content" overlayClassName="ReactModal__Overlay">
        <h2>{userHasBid ? '입찰 수정하기' : '입찰하기'}</h2>
        <input type="number" className="modal-input" placeholder={userHasBid ? '새로운 입찰금액을 입력하세요' : '입찰금액을 입력하세요'} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
        {userHasBid ? (
          <>
            <button onClick={handleUpdateBid} className="modal-button">
              수정하기
            </button>
            <button onClick={handleDeleteBid} className="modal-button">
              삭제하기
            </button>
          </>
        ) : (
          <button onClick={handleBidSubmit} className="modal-button">
            입찰하기
          </button>
        )}
        <button onClick={() => setIsModalOpen(false)} className="modal-button modal-close-button">
          닫기
        </button>
      </Modal>

      <ReactPaginate previousLabel={'이전'} nextLabel={'다음'} pageCount={Math.ceil(otherArts.length / itemsPerPage)} onPageChange={handlePageClick} containerClassName={'pagination'} activeClassName={'active'} />
    </div>
  );
}

export default BasicAuctionDetail;
