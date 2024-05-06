import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import MyPageNav from './MyPageNav';
import MyPageSub from './MyPageSub';
import MyPageAuction from './myPage/MyPageAuction';
import '../../../styles/main/userInfo/myPage.css';
import MyPageUserInfo from './myPage/MyPageUserInfo';
import MyCommission from './myPage/MyCommission';
import MyLike from './myPage/MyLike';
import MyMember from './myPage/MyMember';
import MyPoint from './myPage/MyPoint';
import axios from 'axios';
import MyExpert from './myPage/MyExpert';
import MyCommissionExpert from './myPage/MyCommissionExpert';
import MyCommunity from './myPage/MyCommunity';

function MyPage() {
  const [selectedNavItem, setSelectedNavItem] = useState('sub'); // 초기 값은 MyPageSub
  const history = useHistory(); // useHistory 훅 사용
  const [userRole, setUserRole] = useState(null);

  const handleNavItemClicked = (navItem) => {
    setSelectedNavItem(navItem);
  };

  const [userJwt, setUserJwt] = useState(''); // 배열 대신 빈 문자열로 초기화

  // useEffect에서 userJwt 상태 업데이트
  useEffect(() => {
    const getUserJwt = async () => {
      try {
        console.log('jwt 요청');
        const response = await axios.get('http://localhost:4000/user/jwt', {
          withCredentials: true,
        });
        console.log('접속한 유저 jwt: ' + response.data);
        setUserJwt(response.data); // setUserJwt로 상태 업데이트
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
        alert('로그인 후 이용해주세요.');
        history.push('/login');
      }
    };
    getUserJwt();
  }, []);

  return (
    <div className="myPage_div">
      <div className="myPage_div1">
        <MyPageNav onNavItemClicked={handleNavItemClicked} />
      </div>
      <div className="myPage_div2">
        {/* 선택된 네비게이션 항목에 따라 해당 컴포넌트 렌더링 */}
        {selectedNavItem === 'sub' ? <MyPageSub handleNavItemClicked={handleNavItemClicked} jwt={userJwt} /> : selectedNavItem === 'auction' ? <MyPageAuction jwt={userJwt} /> : selectedNavItem === 'commission' ? <MyCommission jwt={userJwt} /> : selectedNavItem === 'like' ? <MyLike jwt={userJwt} /> : selectedNavItem === 'myPage' ? <MyPageUserInfo jwt={userJwt} /> : selectedNavItem === 'myMember' ? <MyMember jwt={userJwt} /> : selectedNavItem === 'expert' ? <MyExpert jwt={userJwt} /> : selectedNavItem === 'commissionExpert' ? <MyCommissionExpert jwt={userJwt} /> : selectedNavItem === 'community' ? <MyCommunity /> : <MyPoint jwt={userJwt} />}
      </div>
    </div>
  );
}

export default MyPage;
