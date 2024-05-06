import React, { useState, useEffect } from 'react';
import '../../../styles/main/userInfo/MyPageNav.css';
import axios from 'axios';

function MyPageNav({ onNavItemClicked }) {
  const [userRole, setUserRole] = useState('');

  //유저 권한 갖고옴
  useEffect(() => {
    const getUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:4000/user/role', {
          withCredentials: true,
        });
        console.log('로그인한 유저 권한: ' + response.data);
        setUserRole(response.data);
      } catch (error) {
        console.error('유저 권한이 없습니다.', error);
      }
    };
    // 유저 권한 요청
    getUserRole();
  }, []);

  return (
    <div className="MyPageNav_div">
      <h3 className="MyPageNav_title" onClick={() => onNavItemClicked('sub')}>
        마이페이지
      </h3>
      <div className="MyPageNav_div1">
        <div>
          <div className="MyPageNav_title_sub">ArtiQ</div>
          <div onClick={() => onNavItemClicked('auction')}>구매내역</div>
          <div onClick={() => onNavItemClicked('like')}>관심물품</div>
          {userRole === 'ROLE_USER' ? (
            <>
              <div onClick={() => onNavItemClicked('commission')}>감정 의뢰내역</div>
            </>
          ) : (
            <>
              <div onClick={() => onNavItemClicked('commissionExpert')}>감정 의뢰내역</div>
            </>
          )}
          <div onClick={() => onNavItemClicked('expert')}>감정사 신청내역</div>
          <div onClick={() => onNavItemClicked('community')}>커뮤니티 내역</div>
        </div>
      </div>
      <div className="MyPageNav_div1">
        <div>
          <div className="MyPageNav_title_sub">내 정보</div>
          <div onClick={() => onNavItemClicked('myPage')}>프로필 관리</div>
          <div onClick={() => onNavItemClicked('myMember')}>멤버쉽 정보</div>
          <div onClick={() => onNavItemClicked('myPoint')}>포인트 충전</div>
        </div>
      </div>
    </div>
  );
}

export default MyPageNav;
