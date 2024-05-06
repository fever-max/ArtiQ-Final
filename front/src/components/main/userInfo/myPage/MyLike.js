import React, { useEffect, useState } from 'react';
import '../../../../styles/main/userInfo/myPage/MyLike.css';
import axios from 'axios';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import ReactPaginate from 'react-paginate';

function MyLike() {
  const [auctionData, setAuctionData] = useState({ artData: [], artData2: [] });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/myPage/likeData', { withCredentials: true });
        setAuctionData(response.data);
        console.log('Loaded auction data:', response.data); // 로그 추가
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchAuctionData();
  }, []);

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
    return date.toLocaleString();
  }
  return (
    <div className="MyLike_div">
      <div className="MyLike_div">
        <h3 className="MyLike_title">관심 물품 내역</h3>
        <hr className="MyLike_hr" />
        <div className="MyLike_sub">
          {' '}
          <div>
            <div className="image-board">
              {currentPageData.map((art, index) => (
                <Link to={`/basicAuctionDetail/${art.artId}`} key={index}>
                  <div className="image-item">
                    <img src={art.main_image} alt={art.prdct_nm_korean} />
                    <div className={`auction-status ${getAuctionStatus(auctionData.artData2.find((art2) => art2.artId2 === art.artId)?.basicStartTime, auctionData.artData2.find((art2) => art2.artId2 === art.artId)?.basicEndTime).statusClass}`}>{getAuctionStatus(auctionData.artData2.find((art2) => art2.artId2 === art.artId)?.basicStartTime, auctionData.artData2.find((art2) => art2.artId2 === art.artId)?.basicEndTime).statusText}</div>
                    <div className="image-info">
                      <h3>{art.prdct_nm_korean}</h3>
                      <div className="image-details">
                        <p>분류: {art.prdct_cl_nm}</p>
                        <p>크기: {art.prdct_stndrd}</p>
                        <p>기법: {art.matrl_technic}</p>
                        <p>작가: {art.writr_nm}</p>
                        {auctionData.artData2
                          .filter((art2) => art2.artId2 === art.artId)
                          .map((filteredArt2, index2) => (
                            <div key={index2}>
                              <p>최소입찰금액: {filteredArt2.min_Mo}</p>
                              <p>예상입찰금액: {filteredArt2.bid_Amt}</p>
                              <p>시작일: {formatDateToKST(filteredArt2.basicStartTime)}</p>
                              <p>종료일: {formatDateToKST(filteredArt2.basicEndTime)}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <ReactPaginate previousLabel={'이전'} nextLabel={'다음'} breakLabel={'...'} pageCount={Math.ceil(auctionData.artData.length / itemsPerPage)} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handlePageClick} containerClassName={'pagination'} activeClassName={'active'} forcePage={currentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyLike;
