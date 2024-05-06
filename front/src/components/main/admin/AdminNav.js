import React from 'react';
import '../../../styles/main/admin/AdminNav.css';

function AdminNav({ onNavItemClicked }) {
  return (
    <div className="AdminNav_div">
      <h3 className="AdminNav_title" onClick={() => onNavItemClicked('all')}>
        관리자페이지
      </h3>
      <div className="AdminNav_div1">
        <div>
          <div onClick={() => onNavItemClicked('userInfo')}>회원 관리</div>
          <div onClick={() => onNavItemClicked('ExpertReq')}>감정사 승인</div>
          <div onClick={() => onNavItemClicked('payInfo')}>결제 내역</div>
          <div onClick={() => onNavItemClicked('community')}>커뮤니티 관리</div>
        </div>
      </div>
    </div>
  );
}

export default AdminNav;
