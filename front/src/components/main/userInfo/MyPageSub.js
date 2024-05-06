import React, { useEffect, useState } from 'react';
import '../../../styles/main/userInfo/MyPageSub.css';
import axios from 'axios';

function MyPageSub({ handleNavItemClicked, jwt }) {
  const [userNickname, setUserNickname] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [bidInfo, setBidInfo] = useState([]);
  const [commissionInfo, setCommissionInfo] = useState([]);

  const [userRank, setUserRank] = useState({
    rankLevel: '',
    rankPoint: '',
  });

  useEffect(() => {
    const getUserMyPage = async () => {
      try {
        const response = await axios.get(
          'http://localhost:4000/user/myPage/userInfo',
          {
            withCredentials: true,
          },
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );
        console.log(response.data);
        const { userNickname, userEmail } = response.data;
        setUserNickname(userNickname);
        setUserEmail(userEmail);
        fetchUserProfileImage(userEmail); //정보 받아오면, 이미지도 받아옴
        fetchUserRank(userEmail); //정보 받아오면 멤버쉽 정보도 받아옴
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
      }
    };
    // 유저 마이페이지 정보
    getUserMyPage();
    fetchBidData();
    fetchCommission();
  }, []);

  //사진 불러오기
  //프로필사진 읽어오는 메서드
  const fetchUserProfileImage = async (userEmail) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/user/myPage/userProfileImage?userEmail=${userEmail}`,
        {
          responseType: 'arraybuffer', // 바이너리 데이터로 응답 받기
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );

      // 받은 바이너리 데이터 처리
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      console.log('imageUrl: ' + imageUrl);
      setUserProfile(imageUrl);
    } catch (error) {
      console.error('유저의 프로필 이미지가 없습니다.', error);
      // 오류가 발생하면 기본 이미지 사용
      setUserProfile('https://kream.co.kr/_nuxt/img/blank_profile.4347742.png');
    }
  };

  //멤버쉽 정보 불러오기
  const fetchUserRank = async (userEmail) => {
    try {
      const response = await axios.post(
        'http://localhost:4000/user/myPage/rank',
        {
          userEmail: userEmail,
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      // 받은 데이터 처리
      //console.log(response.data);
      setUserRank({ ...userRank, rankLevel: response.data.rankLevel, rankPoint: response.data.rankPoint });
    } catch (error) {
      console.error('유저의 멤버쉽 정보가 없습니다.', error);
    }
  };

  //구매내역 받아옴
  const fetchBidData = async () => {
    try {
      const bidReq = await axios.get('http://localhost:4000/user/myPage/bidInfo', { withCredentials: true });
      setBidInfo(bidReq.data);
      console.log('bidReq.data' + bidReq.data);
    } catch (error) {
      console.error('낙찰(구매)정보 불러오기 실패', error);
    }
  };

  function convertToCustomFormat(timestamp) {
    // 주어진 timestamp를 Date 객체로 변환
    const date = new Date(timestamp);

    // 년, 월, 일, 시, 분을 추출
    const year = date.getFullYear().toString().slice(-2); // 년도의 마지막 2자리
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 월
    const day = ('0' + date.getDate()).slice(-2); // 일
    const hours = ('0' + date.getHours()).slice(-2); // 시간
    const minutes = ('0' + date.getMinutes()).slice(-2); // 분

    // YYYY-MM-DD HH:MM 형식으로 반환
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const fetchCommission = async () => {
    try {
      const response = await axios.get('http://localhost:4000/user/myPage/myCommission1', { withCredentials: true });
      setCommissionInfo(response.data);
      //console.log('myCommissionData: ' + setCommissionInfo);
    } catch (error) {
      console.error('커미션 데이터 불러오기 에러:', error);
    }
  };

  return (
    <div className="MyPageSub_div">
      <div className="MyPageSub_userInfo">
        <div className="MyPageSub_userInfo1">
          <img src={userProfile ? userProfile : 'https://kream.co.kr/_nuxt/img/blank_profile.4347742.png'} alt="프로필이미지" className="MyPageSub_userInfo_img" />
          <div>
            <div className="MyPageSub_userInfoId1">{userNickname}</div>
            <div className="MyPageSub_userInfoId2">{userEmail}</div>
          </div>
        </div>
        <div className="MyPageSub_userInfo2">
          <div className="MyPageSub_userInfoBtn" onClick={() => handleNavItemClicked('myPage')}>
            프로필 수정
          </div>
        </div>
      </div>
      <div className="MyPageSub_userDetail">
        <div onClick={() => handleNavItemClicked('myMember')}>
          <img src="https://i.ibb.co/C0Gn10V/image.png" alt="멤버쉽등급" />
          <div>Lv.{userRank.rankLevel}</div>
        </div>
        <div onClick={() => handleNavItemClicked('myPoint')}>
          <img src="https://i.ibb.co/bmKgCq8/image.png" alt="포인트" />
          <div>{userRank.rankPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P</div>
        </div>
        <div>
          <img src="https://i.ibb.co/ds9YYZD/image.png" alt="쿠폰" />
          <div>쿠폰</div>
        </div>
        <div>
          <img src="https://i.ibb.co/t3bV0NB/image.png" alt="친구초대" />
          <div>친구초대</div>
        </div>
        <div>
          <img src="https://i.ibb.co/sR5brpP/image.png" alt="공지사항" />
          <div>공지사항</div>
        </div>
      </div>
      <div className="MyPageSub_userPurchase">
        <div className="MyPageSub_title">
          <div>구매내역</div>
          <div className="MyPageSub_title_sub" onClick={() => handleNavItemClicked('auction')}>
            상세보기
          </div>
        </div>
        <div className="MyPageSub_auction_table">
          <div className="MyPageSub_auction_table_txt">
            <div className="MyPageSub_auction_table_txt1">명화이미지</div>
            <div className="MyPageSub_auction_table_txt2">명화정보</div>
            <div className="MyPageSub_auction_table_txt3">금액/일시</div>
            <div className="MyPageSub_auction_table_txt4">구매구분</div>
          </div>
          {bidInfo && bidInfo.bidData && bidInfo.artData && (bidInfo.bidData.length === 0 || bidInfo.artData.length === 0 || bidInfo.bidData.every((data) => data.bidEndTime === null)) ? (
            <div className="MyPageSub_noDataMessage">구매내역이 없습니다.</div>
          ) : (
            <>
              {bidInfo &&
                bidInfo.bidData &&
                bidInfo.artData &&
                bidInfo.bidData.slice(0, 2).map(
                  (bid, index) =>
                    bid &&
                    bid.bidEndPrice !== null &&
                    bidInfo.artData[index] && (
                      <div className="MyPageSub_auction_table_sub" key={index} onClick={() => handleNavItemClicked('auction')}>
                        <div className="MyPageSub_auction_table_txt1">
                          <img src={bidInfo.artData[index].main_image} alt="Artwork"></img>
                        </div>
                        <div className="MyPageSub_auction_table_txt2">
                          <div className="MyPageSub_auction_table_txt2_sub">
                            <div>No.{bid.acProductNo}</div>
                            {bidInfo.artData[index].prdct_nm_korean}
                          </div>
                          <div className="MyPageSub_auction_table_txt2_sub2">
                            {bidInfo.artData[index].manage_no_year}년/{bidInfo.artData[index].prdct_cl_nm} /{bidInfo.artData[index].writr_nm}
                          </div>
                        </div>
                        <div className="MyPageSub_auction_table_txt3">
                          <div className="MyPageSub_auction_table_txt2_sub">{bid.bidEndPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P</div>
                          <div className="MyPageSub_auction_table_txt2_sub2">{convertToCustomFormat(bidInfo.bidData[index].bidEndTime)}</div>
                        </div>
                        <div className="MyPageSub_auction_table_txt4">라이브 경매</div>
                      </div>
                    )
                )}
            </>
          )}
        </div>
      </div>
      <div className="MyPageSub_userCommission">
        <div className="MyPageSub_title">
          <div>감정신청</div>
          <div className="MyPageSub_title_sub" onClick={() => handleNavItemClicked('commission')}>
            상세보기
          </div>
        </div>
        <div className="MyPageSub_commission_table">
          <div className="MyPageSub_commission_table_txt">
            <div className="MyPageSub_commission_table_txt1">신청이미지</div>
            <div className="MyPageSub_commission_table_txt2">신청정보</div>
            <div className="MyPageSub_commission_table_txt3">신청메세지</div>
            <div className="MyPageSub_commission_table_txt4">승인여부</div>
          </div>
          {commissionInfo.length === 0 ? (
            <div className="MyPageSub_noDataMessage">감정 신청 내역이 없습니다.</div>
          ) : (
            <>
              <div className="MyPageSub_commission_table_sub" onClick={() => handleNavItemClicked('commission')}>
                <div className="MyPageSub_commission_table_txt1">
                  <img src={commissionInfo.imageURL} alt="commission"></img>
                </div>
                <div className="MyPageSub_commission_table_txt2">
                  <div className="MyPageSub_commission_table_txt2_sub">{commissionInfo.reField}</div>
                  <div className="MyPageSub_commission_table_txt2_sub2">{commissionInfo.reGenre}</div>
                </div>
                <div className="MyPageSub_commission_table_txt3">
                  <div className="MyPageSub_commission_table_txt2_sub">{commissionInfo.reDetails}</div>
                  <div className="MyPageSub_commission_table_txt2_sub2">{commissionInfo.apDate}</div>
                </div>
                <div className="MyPageSub_commission_table_txt4">승인대기중</div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* <div className="MyPageSub_userLike">
        <div className="MyPageSub_title">
          <div>관심물품</div>
          <div className="MyPageSub_title_sub" onClick={() => handleNavItemClicked('like')}>
            상세보기
          </div>
        </div>
        <div>물품 리스트</div>
      </div> */}
    </div>
  );
}

export default MyPageSub;
