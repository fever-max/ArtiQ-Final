import React from 'react';
import '../../styles/main/notFound.css';

function NotFound() {
  return (
    <div className="notFoundDiv">
      <div className="notFound_main">
        <div className="notFound_img">
          <img src="https://i.postimg.cc/7ZNkh1kh/20240404-151703.png" alt="20240404-151703" />
        </div>
        <div className="notFound_msg">
          <div>
            <div className="notFound_msg_title">찾을 수 없는 페이지입니다.</div>
            <div className="notFound_msg_sub">
              <div>주소가 올바르지 않거나 알 수 없는 오류로 인해 페이지를 찾을 수 없습니다.</div>
            </div>
          </div>
        </div>
        <div className="notFound_home">
          <a href="/">
            <div className="notFound_btn">홈으로 가기</div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
