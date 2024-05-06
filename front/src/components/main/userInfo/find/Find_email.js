import React, { useState } from 'react';
import '../../../../styles/main/userInfo/find/find_email.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Find_email() {
  const history = useHistory();
  const [userTel, setUserTel] = useState('');

  const [telFilled1, setTelFilled1] = useState(false); // 전화번호 입력값 여부
  const [telFilled2, setTelFilled2] = useState(false); // 전화번호 입력값 여부
  const [telFilled3, setTelFilled3] = useState(false); // 전화번호 입력값 여부

  const [errorOccurred, setErrorOccurred] = useState(false); //에러 표시창

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
      setUserTel(fullTel);
    }
  };

  // 인풋 값 변화 핸들링
  const handleChange = (e) => {
    const { id, value } = e.target;

    // 입력값이 있는지 확인하여 상태 업데이트
    if (id === 'userTel1' || id === 'userTel2' || id === 'userTel3') {
      // 입력값이 숫자인 경우에만 전화번호 입력값을 업데이트
      if (value.trim().length <= 4) {
        // 전화번호 입력값이 변경될 때마다 전체 전화번호를 업데이트
        getFullPhoneNumber();
        setTelFilled1(value.trim() !== '');
        setTelFilled2(value.trim() !== '');
        setTelFilled3(value.trim() !== '');
      }
    }
  };

  // 이메일 찾기 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 칸이 비워있으면 리턴
    if (!telFilled1 || !telFilled2 || !telFilled3) {
      return;
    }
    try {
      const response = await axios.post('http://localhost:4000/api/user/auth/find_email', { userTel });
      console.log('userEmail:' + response.data);
      history.push('/find_info', { userEmail: response.data }); // 찾은 정보 페이지로 이동
    } catch (error) {
      console.error('Error:', error);
      setErrorOccurred(true);
      // 에러가 발생한 경우 인풋 값들 초기화
      document.getElementById('userTel1').value = '';
      document.getElementById('userTel2').value = '';
      document.getElementById('userTel3').value = '';
      // userTel1 인풋 필드에 포커스 설정
      document.getElementById('userTel1').focus();
    }
  };

  return (
    <div className="find_div">
      <div className="find_main">
        <div className="find_title">
          <h2>이메일 아이디 찾기</h2>
        </div>
        <hr className="find_hr"></hr>
        <form onSubmit={handleSubmit}>
          <div className="find_sub">
            <div>가입 시 등록한 휴대폰 번호를 입력하면</div>
            <div>이메일 주소의 일부를 알려드립니다.</div>
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
          </div>
          {errorOccurred && <div className="find_error"> 일치하는 휴대폰 번호가 없습니다.</div>}
          <button className={`find_btn ${telFilled1 && telFilled2 && telFilled3 ? 'active' : ''}`} type="submit">
            이메일 아이디 찾기
          </button>
        </form>
      </div>
    </div>
  );
}

export default Find_email;
