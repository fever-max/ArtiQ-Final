import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import '../../../styles/main/userInfo/Join.css';

function Join() {
  const history = useHistory();
  const location = useLocation();

  // 유저 정보 상태 설정
  const [user, setUser] = useState({
    userEmail: '',
    userPw: '',
    userNickname: '',
    userTel: '',
  });

  // 에러 및 입력 상태 설정
  const [emailError, setEmailError] = useState(false); // 이메일 형식 메세지
  const [passwordError, setPasswordError] = useState(false); // 비밀번호 형식 메세지
  const [passwordError2, setPasswordError2] = useState(false); // 비밀번호 일치 여부 메세지
  const [nickNameError, setNickNameError] = useState(false); // 닉네임 형식 메세지

  const [emailFilled, setEmailFilled] = useState(false); // 이메일 입력값 여부
  const [pwFilled, setPwFilled] = useState(false); // 비밀번호 입력값 여부
  const [pwFilled2, setPwFilled2] = useState(false); // 비밀번호 확인 입력값 여부
  const [nickNameFilled, setNickNameFilled] = useState(false); // 닉네임 입력값 여부
  const [telFilled1, setTelFilled1] = useState(false); // 전화번호 입력값 여부
  const [telFilled2, setTelFilled2] = useState(false); // 전화번호 입력값 여부
  const [telFilled3, setTelFilled3] = useState(false); // 전화번호 입력값 여부

  // 중복 여부 상태 설정
  const [duplicateEmail, setDuplicateEmail] = useState(false); // 이메일 중복 메세지
  const [duplicateTel, setDuplicateTel] = useState(false); // 전화번호 중복 메세지

  //소셜 코드
  const [code, setCode] = useState('');

  // 나누어진 전화번호를 합친 값을 가져오는 함수
  const getFullPhoneNumber = () => {
    // 각각의 전화번호 입력값을 가져옴
    const tel1 = document.getElementById('userTel1').value.trim();
    const tel2 = document.getElementById('userTel2').value.trim();
    const tel3 = document.getElementById('userTel3').value.trim();

    // 모든 입력값이 채워져 있는지 확인
    if (tel1 && tel2 && tel3) {
      // 전화번호를 합쳐서 userTel 상태를 업데이트
      const fullTel = tel1 + tel2 + tel3;
      setUser({ ...user, userTel: fullTel });
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    if (email) {
      setUser({ ...user, userEmail: email });
    }

    if (code) {
      setCode(code);
    }
  }, [location.search]);

  useEffect(() => {
    // useEffect를 사용하여 userEmail이 변경될 때마다 중복 확인
    const checkDuplicateEmail = async () => {
      try {
        const response = await axios.post('http://localhost:4000/api/user/auth/checkEmail', {
          userEmail: user.userEmail,
        });
        setDuplicateEmail(response.data);
      } catch (error) {
        console.error('이메일 중복 에러:', error);
      }
    };

    // userTel도 확인
    const checkDuplicateTel = async () => {
      try {
        const response = await axios.post('http://localhost:4000/api/user/auth/checkTel', {
          userTel: user.userTel,
        });
        setDuplicateTel(response.data); // 중복된 전화번호 여부 설정
      } catch (error) {
        console.error('전화번호 중복 에러:', error);
      }
    };

    // 이메일이나 전화번호가 입력되면 중복 체크
    if (user.userEmail.trim() !== '') {
      checkDuplicateEmail();
    }

    if (user.userTel.trim() !== '') {
      checkDuplicateTel();
    }
  }, [user.userEmail, user.userTel]);

  // 인풋 값 변화 핸들링
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });

    // 이메일 형식 검사 (@ 포함)
    if (id === 'userEmail') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(!isValidEmail);
    }

    // 비밀번호 형식 검사 (특수문자 포함 8~16자만 가능)
    if (id === 'userPw') {
      const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&_])[A-Za-z\d$@$!%*#?&_]{8,16}$/.test(value);
      setPasswordError(!isValidPassword);
    }

    // 비밀번호 일치 여부 확인
    if (id === 'userPw2') {
      setPasswordError2(value !== user.userPw);
    }

    // 닉네임 형식 검사 (10자 이내 특수 문자 없이 한글, 영문자 또는 숫자만 허용)
    if (id === 'userNickname') {
      const isValidNickname = /^[a-zA-Z0-9가-힣]{1,10}$/.test(value);
      setNickNameError(!isValidNickname);
    }

    // 입력값이 있는지 확인하여 상태 업데이트
    if (id === 'userEmail') {
      setEmailFilled(value.trim() !== '');
    } else if (id === 'userPw') {
      setPwFilled(value.trim() !== '');
    } else if (id === 'userPw2') {
      setPwFilled2(value.trim() !== '');
    } else if (id === 'userNickname') {
      setNickNameFilled(value.trim() !== '');
    } else if (id === 'userTel1' || id === 'userTel2' || id === 'userTel3') {
      // 전화번호 입력값이 변경될 때마다 전체 전화번호를 업데이트
      getFullPhoneNumber();
      setTelFilled1(value.trim() !== '');
      setTelFilled2(value.trim() !== '');
      setTelFilled3(value.trim() !== '');
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 이메일, 전화번호 중복 및 입력값이 없는 경우 리턴
    if (duplicateEmail || duplicateTel || !emailFilled || !pwFilled || !pwFilled2 || !nickNameFilled || !telFilled1 || !telFilled2 || !telFilled3) {
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/user/auth/join', user);
      history.push('/joinComplete'); // 회원가입 완료 페이지로 이동
    } catch (error) {
      console.error('Error:', error);
    }
  };

  //소셜가입의 경우
  const oauth2Submit = async (e) => {
    e.preventDefault();
    // 전화번호 중복 및 입력값이 없는 경우 리턴
    if (duplicateTel || !pwFilled || !pwFilled2 || !nickNameFilled || !telFilled1 || !telFilled2 || !telFilled3) {
      return;
    }

    try {
      await axios.post('http://localhost:4000/api/oauth2/join', user, { params: { code } });
      history.push('/joinComplete'); // 회원가입 완료 페이지로 이동
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="joinDiv">
      <div className="joinDiv_main">
        <div className="join_title">
          <h2>회원가입</h2>
        </div>
        <form onSubmit={code ? oauth2Submit : handleSubmit}>
          <div>
            <h3>이메일 주소</h3>
            <input type="text" id="userEmail" placeholder=" 예) ArtiQ@naver.com" value={user.userEmail} onChange={handleChange} disabled={code} />
            {emailError && <span className="msg">이메일 주소를 정확히 입력해주세요.</span>}
            {duplicateEmail && <span className="msg">이미 가입된 이메일입니다.</span>}
          </div>
          <div>
            <h3>비밀번호</h3>
            <input type="password" id="userPw" placeholder=" 영문, 숫자, 특수문자 조합 8~16자" value={user.userPw} onChange={handleChange} />
            {passwordError && <span className="msg">영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)</span>}
          </div>
          <div>
            <h3>비밀번호 확인</h3>
            <input type="password" id="userPw2" placeholder=" 비밀번호 확인" onChange={handleChange} />
            {passwordError2 && <span className="msg">비밀번호가 동일하지 않습니다. </span>}
          </div>
          <div>
            <h3>닉네임</h3>
            <input type="text" id="userNickname" placeholder=" 한글, 영문, 숫자 10자 이내" value={user.userNickname} onChange={handleChange} />
            {nickNameError && <span className="msg">한글, 영문, 숫자를 10자 이내로 입력해주세요.</span>}
          </div>
          <div>
            <h3>휴대폰 번호</h3>
            <div className="userTel">
              <input type="number" id="userTel1" onChange={handleChange} />
              <span>-</span>
              <input type="number" id="userTel2" onChange={handleChange} />
              <span>-</span>
              <input type="number" id="userTel3" onChange={handleChange} />
            </div>
            {duplicateTel && <span className="msg">이미 가입된 전화번호입니다.</span>}
          </div>
          <input type="hidden" id="code" value={code}></input>
          <button className={`join_btn ${pwFilled && nickNameFilled && telFilled1 && telFilled2 && telFilled3 && !(duplicateEmail || duplicateTel) ? 'active' : ''}`} type="submit">
            가입
          </button>
        </form>
      </div>
    </div>
  );
}

export default Join;
