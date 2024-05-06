import React, { useState } from 'react';
import '../../../styles/main/userInfo/Login.css';
import { SiNaver } from 'react-icons/si';
import { FcGoogle } from 'react-icons/fc';

import axios from 'axios';

function Login() {
  const [user, setUser] = useState({
    userEmail: '',
    userPw: '',
  });

  const [emailFilled, setEmailFilled] = useState(false); // 이메일 입력값 있는지 여부
  const [pwFilled, setPwFilled] = useState(false); // 비밀번호 입력값 있는지 여부

  const [emailError, setEmailError] = useState(false); // 이메일 형식 메세지
  const [loginError, setLoginError] = useState(false); // 로그인 형식 메세지

  const handleChange = (e) => {
    //인풋 값 받아오는 함수
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });

    // 이메일 형식 검사 (@ 포함)
    if (id === 'userEmail') {
      if (value !== 'admin') {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        setEmailError(!isValidEmail);
      }
    }

    // 입력값이 있는지 확인하여 상태 업데이트
    if (id === 'userEmail') {
      setEmailFilled(value.trim() !== '');
    } else if (id === 'userPw') {
      setPwFilled(value.trim() !== '');
    }
  };

  //-------- 일반 로그인 / 토큰, 닉네임 쿠키 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('userEmail: ' + user.userEmail);
      console.log('userPw: ' + user.userPw);
      const response = await axios.post('http://localhost:4000/api/user/auth/login', user, {
        withCredentials: true, // 쿠키 접근 가능하게
      });
      if (response.status !== 200) {
        throw new Error('이메일 or 비밀번호 오류');
      }
      window.location.href = '/'; // 로그인 완료 후 메인으로 이동
    } catch (error) {
      setLoginError('로그인 에러');
      console.error('Error:', error.message);
    }
  };

  //--------소셜 로그인
  const NaverLoginBtn = async (e) => {
    e.preventDefault();
    const clientId = process.env.REACT_APP_NAVER_CLIENT_ID; // 네이버 클라이언트 ID
    const redirectURI = encodeURIComponent(process.env.REACT_APP_NAVER_REDIRECT_URI);
    const state = 'STATE_STRING'; // 보안을 위한 상태 문자열

    // 네이버 로그인 URL 생성
    const naverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectURI}&state=${state}`;

    try {
      // 사용자를 네이버 인증 서버로 리다이렉트
      window.location.href = naverLoginUrl;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //구글 버튼
  const handleGoogleLogin = () => {
    // 클릭 시 Google OAuth 2.0 인증 URL로 이동

    const clientId = process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID;
    const redirectURI = encodeURIComponent(process.env.REACT_APP_GOOGLE_REDIRECT_URI);

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&scope=email%20profile`;
    //이후 콜백으로 넘어가서 처리됨
  };

  return (
    <div className="loginDiv">
      <div className="loginDiv_main">
        <div className="login_title">
          <h2>로그인</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <h3>이메일</h3>
            <input type="text" id="userEmail" name="userEmail" placeholder="이메일을 입력하세요." onChange={handleChange} />
            {emailError && <span className="msg">이메일 주소를 정확히 입력해주세요.</span>}
          </div>
          <div>
            <h3>비밀번호</h3>
            <input type="password" id="userPw" name="userPw" placeholder="비밀번호를 입력하세요." onChange={handleChange} />
            {loginError && <span className="msg">이메일 또는 비밀번호를 확인해주세요.</span>}
          </div>
          <button className={`login_btn ${emailFilled && pwFilled ? 'active' : ''}`} type="submit">
            로그인
          </button>
        </form>
        <div className="login_join">
          <div>
            <a href="/join">
              <h3>회원가입</h3>
            </a>
          </div>
          |
          <div>
            <a href="/find_email">
              <h3>이메일 찾기</h3>
            </a>
          </div>
          |
          <div>
            <a href="/find_password">
              <h3>비밀번호 찾기</h3>
            </a>
          </div>
        </div>
        <div onClick={NaverLoginBtn}>
          <div className="login_sns">
            <i>
              <SiNaver color="green" />
            </i>
            <h3>네이버로 로그인</h3>
          </div>
        </div>
        <div>
          <div className="login_sns" onClick={handleGoogleLogin}>
            <i>
              <FcGoogle size="24" color="blue" />
            </i>
            <h3>구글로 로그인</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
