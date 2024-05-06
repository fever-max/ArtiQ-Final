import React from 'react';
import '../../../../styles/main/userInfo/find/find_emailSend.css';

function Find_emailSend() {
  return (
    <div className="findSend_div">
      <div className="findSend_main">
        <div className="findSend_title">
          <h2>이메일 전송 완료</h2>
        </div>
        <hr className="findSend_hr"></hr>
        <div className="findSend_sub">
          <div>
            <div>임시 비밀번호를 전송하였습니다.</div>
            <div>전송 받은 임시 이메일로 로그인 해주세요. </div>
          </div>
        </div>
        <a className="findSend_btn" href="/login">
          <div>로그인</div>
        </a>
      </div>
    </div>
  );
}

export default Find_emailSend;
