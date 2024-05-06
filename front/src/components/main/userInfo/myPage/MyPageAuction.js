import React, { useEffect, useState } from 'react';
import '../../../../styles/main/userInfo/myPage/MyPageAuction.css';
import axios from 'axios';

function MyPageAuction() {
  const [bidInfo, setBidInfo] = useState([]);

  useEffect(() => {
    fetchBidData();
  }, []);

  const fetchBidData = async () => {
    try {
      const bidReq = await axios.get('http://localhost:4000/user/myPage/bidInfo', { withCredentials: true });
      setBidInfo(bidReq.data);
      console.log(bidReq.data);
    } catch (error) {
      console.error('낙찰(구매)정보 불러오기 실패', error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() - 9 * 60 * 60 * 1000);

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return adjustedDate.toLocaleString('ko-KR', options);
  }

  return (
    <div className="MyPageAuction_div">
      <div className="MyPageAuction_div">
        <h3 className="MyPageAuction_title">구매 상세 내역</h3>
        <hr className="MyPageAuction_hr" />
        <div className="MyPageAuction_sub"></div>
        <div className="MyPageAuction_table_column">
          <div className="MyPageAuction_table_column1">물품 이미지</div>
          <div className="MyPageAuction_table_column2">물품번호</div>
          <div className="MyPageAuction_table_column3">물품명</div>
          <div className="MyPageAuction_table_column4">낙찰 금액</div>
          <div className="MyPageAuction_table_column5">낙찰 시간</div>
          <div className="MyPageAuction_table_column6">구분</div>
        </div>
        {bidInfo && bidInfo.bidData && bidInfo.artData && (bidInfo.bidData.length === 0 || bidInfo.artData.length === 0 || bidInfo.bidData.every((data) => data.bidEndTime === null)) ? (
          <div className="MyPageSub_noDataMessage">구매내역이 없습니다.</div>
        ) : (
          bidInfo &&
          bidInfo.bidData &&
          bidInfo.artData &&
          bidInfo.bidData.map(
            (bid, index) =>
              bid &&
              bid.bidEndPrice !== null &&
              bidInfo.artData[index] && (
                <div className="MyPageAuction_table_row" key={index}>
                  <div className="MyPageAuction_table_column1_sub">
                    <img src={bidInfo.artData[index].main_image} alt="Artwork"></img>
                  </div>
                  <div className="MyPageAuction_table_column2_sub">{bid.acProductNo}</div>
                  <div className="MyPageAuction_table_column3_sub">{bidInfo.artData[index].prdct_nm_korean}</div>
                  <div className="MyPageAuction_table_column4_sub">{bid.bidEndPrice}원</div>
                  <div className="MyPageAuction_table_column5_sub">{formatDate(bid.bidEndTime)}</div>
                  <div className="MyPageAuction_table_column6_sub">경매</div>
                </div>
              )
          )
        )}
      </div>
    </div>
  );
}

export default MyPageAuction;
