import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import AdminNav from './AdminNav';
import AdminAll from './info/AdminAll';
import AdminUserInfo from './info/AdminUserInfo';
import AdminExpertReq from './info/AdminExpertReq';
import AdminPayInfo from './info/AdminPayInfo';
import '../../../styles/main/admin/Admin.css';
import AdminCommunity from './info/AdminCommunity';

function Admin() {
  const [userRole, setUserRole] = useState(null);
  const [userJwt, setUserJwt] = useState('');
  const [selectedNavItem, setSelectedNavItem] = useState('all');

  //페이지 이동
  const handleNavItemClicked = (navItem) => {
    setSelectedNavItem(navItem);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roleResponse = await axios.get('http://localhost:4000/user/role', {
          withCredentials: true,
        });
        setUserRole(roleResponse.data);

        const jwtResponse = await axios.get('http://localhost:4000/user/jwt', {
          withCredentials: true,
        });
        setUserJwt(jwtResponse.data);
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
      }
    };
    fetchData();
  }, []);

  if (!userRole || !userJwt) {
    // 사용자 역할 또는 JWT가 없으면 로딩 중으로 표시
    return <div className="role_msg">관리자 권한으로 접속하세요.</div>;
  }

  if (userRole !== 'ROLE_ADMIN') {
    alert('관리자 권한으로 접속하세요.');
    return <Redirect to="/" />;
  }

  return (
    <div className="adminDiv">
      <div className="admin_div1">
        <AdminNav onNavItemClicked={handleNavItemClicked} />
      </div>
      <div className="admin_div2">
        {/* 선택된 네비게이션 항목에 따라 해당 컴포넌트 렌더링 */}
        {selectedNavItem === 'all' ? <AdminAll jwt={userJwt} /> : selectedNavItem === 'userInfo' ? <AdminUserInfo jwt={userJwt} /> : selectedNavItem === 'ExpertReq' ? <AdminExpertReq jwt={userJwt} /> : selectedNavItem === 'community' ? <AdminCommunity jwt={userJwt} /> : <AdminPayInfo jwt={userJwt} />}
      </div>
    </div>
  );
}

export default Admin;
