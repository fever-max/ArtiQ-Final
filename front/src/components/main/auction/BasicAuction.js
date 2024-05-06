import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import '../../../styles/main/auction/BasicAuction.css';
import '../../../styles/main/auction/BasicAuctionModal.css';
Modal.setAppElement('#root');

function BasicAuction() {
  const [auctionData, setAuctionData] = useState({ artData: [], artData2: [] });
  const [userEmail, setUserEmail] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const itemsPerPage = 20;

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

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/basicAuction');
        setAuctionData(response.data);
        console.log('Loaded auction data:', response.data); // 로그 추가
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchAuctionData();
  }, []);

  // 알림 데이터 가져오기
  useEffect(() => {
    if (userEmail) {
      axios
        .post('http://localhost:4000/notifications/unread', {
          userEmail: userEmail, // 요청 바디에 이메일 주소를 포함
        })
        .then((response) => {
          if (response.data.length > 0) {
            setNotifications(response.data);
            setModalIsOpen(true);
          }
        })
        .catch((error) => console.error('Error fetching notifications:', error));
    }
  }, [userEmail]);

  useEffect(() => {
    console.log('Modal open state:', modalIsOpen);
  }, [modalIsOpen]);

  const closeModal = () => {
    notifications.forEach((notification) => {
      axios
        .post(`http://localhost:4000/notifications/mark-read/${notification.id}`)
        .then(() => {
          console.log('Notification marked as read');
        })
        .catch((error) => {
          console.error('Error marking notification as read:', error);
        });
    });
    setModalIsOpen(false);
    setNotifications([]); // 알림 목록 초기화
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const offsetArtData = currentPage * itemsPerPage;
  const currentPageData = auctionData.artData.slice(offsetArtData, offsetArtData + itemsPerPage);

  //이거는 좀 어려움
  function getAuctionStatus(startTime, endTime) {
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
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 두 자리 수로 변환
    const day = date.getDate().toString().padStart(2, '0'); // 두 자리 수로 변환
    const hours = date.getHours().toString().padStart(2, '0'); // 두 자리 수로 변환
    const minutes = date.getMinutes().toString().padStart(2, '0'); // 두 자리 수로 변환
    return `${year}-${month}-${day} / ${hours}:${minutes}`;
  }

  return (
    <div>
      <div className="image-info">
        <h4 className="image-info_title">일반경매</h4>
      </div>
      <div className="image-board">
        {currentPageData.map((art, index) => (
          <Link to={`/basicAuctionDetail/${art.artId}`} key={index}>
            <div className="image-item">
              <img src={art.main_image} alt={art.prdct_nm_korean} />
              <div className={`auction-status ${getAuctionStatus(auctionData.artData2.find((art2) => art2.artId2 === art.artId)?.basicStartTime, auctionData.artData2.find((art2) => art2.artId2 === art.artId)?.basicEndTime).statusClass}`}>{getAuctionStatus(auctionData.artData2.find((art2) => art2.artId2 === art.artId)?.basicStartTime, auctionData.artData2.find((art2) => art2.artId2 === art.artId)?.basicEndTime).statusText}</div>
              <div className="image-info">
                <h3 className="image-info_sub">
                  <p className="image-info_sub">{art.prdct_nm_korean}</p>
                </h3>
                <p className="image-info_sub1">
                  분류: {art.prdct_cl_nm}ㆍ작가: {art.writr_nm}
                </p>

                <div className="image-details">
                  {auctionData.artData2
                    .filter((art2) => art2.artId2 === art.artId)
                    .map((filteredArt2, index2) => (
                      <div key={index2}>
                        <div className="image-details2">
                          <p>
                            최소금액: {filteredArt2.min_Mo.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P / 예상금액: {filteredArt2.bid_Amt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P
                          </p>
                        </div>
                        <div className="image-details_btn1">시작일: {formatDateToKST(filteredArt2.basicStartTime)}</div>
                        <div className="image-details_btn2">종료일: {formatDateToKST(filteredArt2.basicEndTime)}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Notifications" className="modal-content" overlayClassName="ReactModal__Overlay">
        <div className="modal-header">!!긴급!!</div>
        <div className="modal-body">
          {notifications.map((notification, index) => (
            <div key={index}>{notification.message}</div>
          ))}
        </div>
        <button onClick={closeModal} className="button button-close">
          확인
        </button>
      </Modal>
      <ReactPaginate previousLabel={'이전'} nextLabel={'다음'} breakLabel={'...'} pageCount={Math.ceil(auctionData.artData.length / itemsPerPage)} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handlePageClick} containerClassName={'pagination'} activeClassName={'active'} forcePage={currentPage} />
    </div>
  );
}

export default BasicAuction;
