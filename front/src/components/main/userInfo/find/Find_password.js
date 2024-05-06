import React, { useState } from 'react';
import '../../../../styles/main/userInfo/find/find_password.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Find_password() {
  const history = useHistory();

  // 유저 정보 상태 설정
  const [user, setUser] = useState({
    userEmail: '',
    userTel: '',
  });

  const [emailFiled, setEmailFiled] = useState(false); // 이메일 입력값 여부
  const [telFilled1, setTelFilled1] = useState(false); // 전화번호 입력값 여부
  const [telFilled2, setTelFilled2] = useState(false); // 전화번호 입력값 여부
  const [telFilled3, setTelFilled3] = useState(false); // 전화번호 입력값 여부

  const [emailError, setEmailError] = useState(false); // 이메일 형식 메세지
  const [findError, setFindError] = useState(false); // 로그인 형식 메세지

  // 인풋 값 변화 핸들링
  const handleChange = (e) => {
    const { id, value } = e.target;

    // 이메일 입력 시 findError 초기화
    if (e.target.id === 'userEmail') {
      setFindError(false);
    }

    // 전화번호 입력 시 findError 초기화
    if (e.target.id === 'userTel1' || e.target.id === 'userTel2' || e.target.id === 'userTel3') {
      setFindError(false);
    }

    // 이메일 형식 검사 (@ 포함)
    if (id === 'userEmail') {
      const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(!isValidEmail);
    }

    // 전화번호 입력값이 있는지 확인하여 상태 업데이트
    if (id === 'userTel1' || id === 'userTel2' || id === 'userTel3') {
      // 입력값이 숫자인 경우에만 전화번호 입력값을 업데이트
      if (value.trim().length <= 4) {
        // 전화번호 입력값이 변경될 때마다 전체 전화번호를 업데이트
        getFullPhoneNumber();
        setTelFilled1(document.getElementById('userTel1').value.trim() !== '');
        setTelFilled2(document.getElementById('userTel2').value.trim() !== '');
        setTelFilled3(document.getElementById('userTel3').value.trim() !== '');
      }
    } else if (id === 'userEmail') {
      // 이메일 저장
      setUser({ ...user, userEmail: value.trim() });
      setEmailFiled(value.trim() !== '');
    }
  };

  // 나누어진 전화번호를 합친 값을 가져오는 함수
  const getFullPhoneNumber = () => {
    // 각각의 전화번호 입력값을 가져옴
    const tel1 = document.getElementById('userTel1').value.trim();
    const tel2 = document.getElementById('userTel2').value.trim();
    const tel3 = document.getElementById('userTel3').value.trim();

    // 입력값이 채워져 있는지 확인
    if (tel1 && tel2 && tel3) {
      // 전화번호를 합쳐서 userTel 상태를 업데이트
      const fullTel = tel1 + tel2 + tel3;
      setUser((prevState) => ({
        ...prevState,
        userTel: fullTel,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/user/auth/find_password', user);
      console.log(response.data);
      history.push('/find_emailSend');
    } catch (error) {
      setFindError('이메일 or 휴대전화 정보 오류');
      console.error('Error:', error);
    }
  };

  return (
    <div className="find_div">
      <div className="find_main">
        <div className="find_title">
          <h2>비밀번호 찾기</h2>
        </div>
        <hr className="find_hr"></hr>
        <form onSubmit={handleSubmit}>
          <div className="find_sub">
            <div>가입 시 등록한 휴대폰 번호와 이메일을 입력하면</div>
            <div>이메일로 임시 비밀번호를 보내드립니다.</div>
          </div>
          <div>
            <h3>휴대폰 번호</h3>
            <div className="userTel">
              <input type="number" id="userTel1" placeholder="010" onChange={handleChange} />
              <span>-</span>
              <input type="number" id="userTel2" onChange={handleChange} />
              <span>-</span>
              <input type="number" id="userTel3" onChange={handleChange} />
            </div>
          </div>
          <div>
            <h3>이메일 주소</h3>
            <input type="text" id="userEmail" placeholder=" 예) ArtiQ@naver.com" onChange={handleChange}></input>
            {emailError && <span className="msg">이메일 주소를 정확히 입력해주세요.</span>}
            {findError && <span className="msg">일치하는 사용자 정보를 찾을 수 없습니다.</span>}
          </div>
          <button className={`find_btn ${telFilled1 && telFilled2 && telFilled3 && emailFiled ? 'active' : ''}`} type="submit">
            이메일 발송하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default Find_password;
