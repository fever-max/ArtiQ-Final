import React from 'react';
import '../../../styles/main/userInfo/Join_complete.css';

function Join_complete() {
  return (
    <div className="joinComplete_div">
      <div className="joinComplete_main">
        <div className="joinComplete_title">
          <h2>회원가입 완료</h2>
        </div>
        <hr className="joinComplete_hr"></hr>
        <div className="joinComplete_sub">
          <div>
            <div>ArtiQ에 오신 걸 환영합니다.</div>
            <div>로그인 후 서비스를 이용해주세요.</div>
          </div>
        </div>
        <a className="joinComplete_btn" href="/login">
          <div>로그인</div>
        </a>
      </div>
    </div>
  );
}

export default Join_complete;
