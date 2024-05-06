import React from 'react';
import { useHistory } from 'react-router-dom';
import '../../../../styles/main/userInfo/find/find_info.css';
import { useLocation } from 'react-router-dom';

function Find_info() {
  const history = useHistory();
  const location = useLocation();
  const userEmail = location.state.userEmail;

  //이메일 정규화
  const normalizedEmail = normalizeEmail(userEmail);

  function normalizeEmail(email) {
    // 이메일 주소에서 @를 기준으로 분리
    const [username, domain] = email.split('@');
    // 사용자 이름에서 처음과 마지막 글자를 제외한 나머지 글자를 *로 대체
    const hiddenChars = username.slice(1, -1).replace(/./g, '*');
    // 숨긴 사용자 이름과 도메인을 결합하여 정규화된 이메일 주소 생성
    const normalizedEmail = `${username.charAt(0)}${hiddenChars}${username.charAt(username.length - 1)}@${domain}`;
    return normalizedEmail;
  }

  const handleButtonClick = (path) => {
    //페이지 이동 버튼
    history.push(path);
  };

  return (
    <div>
      <div className="find_div">
        <div className="find_main">
          <div className="find_title">
            <h2>이메일 아이디 찾기 성공</h2>
          </div>
          <hr className="find_hr"></hr>

          <div className="find_email_sub">
            <div className="find_email_text">이메일 주소</div>
            <div className="find_email">{normalizedEmail}</div>
          </div>

          <div className="find_email_btn">
            <button className="find_email_btn1" onClick={() => handleButtonClick('/find_password')}>
              비밀번호 찾기
            </button>
            <button className="find_email_btn2" onClick={() => handleButtonClick('/login')}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Find_info;
