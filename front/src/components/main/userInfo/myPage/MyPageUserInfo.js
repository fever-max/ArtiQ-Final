import React, { useEffect, useState, useRef } from 'react';
import '../../../../styles/main/userInfo/myPage/MyPageUserInfo.css';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';

function MyPageUserInfo() {
  // 인풋 값 상태 설정
  const [inputUser, setInputUser] = useState({
    userName: '',
    userEmail: '',
    userPw: '',
    userNickname: '',
    userBirth: '',
    userZipCode: '',
    userAddr: '',
    userDetailAddr: '',
    userProfile: '',
    userTel: '',
  });

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:4000/user/myPage/userInfo', {
          withCredentials: true,
        });
        //console.log('받아온 유저 정보' + response.data);
        setInputUser(response.data);
        fetchUserProfileImage(response.data.userEmail);
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
      }
    };
    // 유저 마이페이지 정보
    getUserInfo();
  }, []);

  //인풋 형식 메세지
  const [passwordError, setPasswordError] = useState(false);
  const [nickNameError, setNickNameError] = useState(false);

  // 인풋 값 변화 핸들링
  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputUser({ ...inputUser, [id]: value });

    // 비밀번호 형식 검사 (특수문자 포함 8~16자만 가능)
    if (id === 'userPw') {
      const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&_])[A-Za-z\d$@$!%*#?&_]{8,16}$/.test(value);
      setPasswordError(!isValidPassword);
    }

    // 닉네임 형식 검사 (10자 이내 특수 문자 없이 한글, 영문자 또는 숫자만 허용)
    if (id === 'userNickname') {
      const isValidNickname = /^[a-zA-Z0-9가-힣]{1,10}$/.test(value);
      setNickNameError(!isValidNickname);
    }
  };

  //전화번호 중복값 체크
  const [duplicateTel, setDuplicateTel] = useState(false); //전화번호 중복 체크

  // 변경 버튼 클릭 시 서버로 해당 값을 전송하는 함수
  const handleUpdate = async (field) => {
    try {
      // 전화번호 필드가 변경되었을 때만 중복 여부를 확인하고 업데이트 진행
      if (field === 'userTel') {
        const response = await axios.get(`http://localhost:4000/api/user/auth/checkTel?UserTel=${inputUser.userTel}`);
        if (response.data) {
          //alert('전화번호가 이미 등록되어 있습니다.');
          setDuplicateTel(response.data);
          return; // 중복된 경우에는 업데이트를 진행하지 않고 함수 종료
        }
      }

      if (field === 'userPw' && passwordError) {
        alert('비밀번호 형식에 맞지 않습니다.');
        return;
      }

      if (field === 'userNickname' && nickNameError) {
        alert('닉네임 형식에 맞지 않습니다.');
        return;
      }

      // 중복이 아닌 경우에만 업데이트 진행
      let data = {
        userEmail: inputUser.userEmail,
        fields: { [field]: inputUser[field] }, // 키, 값을 짝지어서 맵으로 전달
      };
      //업데이트여서 put 사용
      await axios.put('http://localhost:4000/user/myPage/update', data);
      setDuplicateTel(false);
      alert(`${field} 정보가 업데이트 되었습니다.`);
    } catch (error) {
      console.error('업데이트에 실패했습니다.', error);
    }
  };

  //우편번호 api
  const [isOpen, setIsOpen] = useState(false); // isOpen 상태를 boolean으로 초기화

  const completeHandler = (data) => {
    setInputUser({
      ...inputUser,
      userZipCode: data.zonecode, // 우편번호 업데이트
      userAddr: data.roadAddress, // 주소 업데이트
    });
    console.log(data);
    setIsOpen(false);
  };

  // Modal 스타일
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
    },
    content: {
      left: '0',
      margin: 'auto',
      width: '500px',
      height: '600px',
      padding: '0',
      overflow: 'hidden',
    },
    overlayClick: () => setIsOpen(false), //외부 클릭하면 닫힘
  };

  // 검색 클릭
  const toggle = () => {
    setIsOpen(!isOpen); // isOpen 상태를 토글하여 모달 열고 닫기
  };

  //배송주소 수정
  const handleUpdateAddr = async () => {
    try {
      const data = {
        userEmail: inputUser.userEmail,
        userZipCode: inputUser.userZipCode,
        userAddr: inputUser.userAddr,
        userDetailAddr: inputUser.userDetailAddr,
      };
      // 업데이트하여 put 사용
      await axios.put('http://localhost:4000/user/myPage/updateAddr', data);
      alert('주소 정보가 업데이트 되었습니다.');
    } catch (error) {
      console.error('업데이트에 실패했습니다.', error);
    }
  };

  //사진업로드
  const inputRef = useRef(null);
  const handleFileClick = () => {
    inputRef.current.click(); // input 엘리먼트 클릭
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // 첫 번째 파일만 선택
    if (file) {
      uploadFile(file); // 파일을 서버에 업로드
    }
  };

  // 파일을 서버에 전송하는 함수
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('userEmail', inputUser.userEmail);
      formData.append('file', file); // 파일을 FormData에 추가
      console.log('유저 이미지 교체 중');
      const response = await axios.post('http://localhost:4000/user/myPage/updateImg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 필수
        },
      });

      console.log('유저 프로필 교체 성공', response.data);
      fetchUserProfileImage(inputUser.userEmail); //이미지 바꾸면 다시 리로딩 (필수)
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  //프로필사진 읽어오는 메서드
  const fetchUserProfileImage = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:4000/user/myPage/userProfileImage?userEmail=${userEmail}`, {
        responseType: 'arraybuffer', // 바이너리 데이터로 응답 받기
      });

      // 받은 바이너리 데이터 처리
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      setInputUser((prevState) => ({
        ...prevState, // 이전 상태를 복사
        userProfile: imageUrl, // 새로운 데이터 추가
      }));
    } catch (error) {
      console.error('유저의 프로필 이미지가 없습니다.', error);
      // 오류가 발생하면 대체 이미지를 사용하도록 상태를 설정
      setInputUser((prevState) => ({
        ...prevState,
        userProfile: 'https://kream.co.kr/_nuxt/img/blank_profile.4347742.png',
      }));
    }
  };

  //프로필 삭제 메서드
  const handleFileDelete = async () => {
    try {
      await axios.put('http://localhost:4000/user/myPage/userProfileImageDelete', {
        userEmail: inputUser.userEmail,
      });

      console.log('이미지 삭제 성공');
      fetchUserProfileImage(inputUser.userEmail);
      // 받은 바이너리 데이터 처리
    } catch (error) {
      console.error('이미지 삭제 오류', error);
    }
  };

  return (
    <div className="MyPageUserInfo_div">
      <div className="MyPageUserInfo_div">
        <h3 className="MyPageUserInfo_title">프로필 관리</h3>
        <hr className="MyPageUserInfo_hr" />
        <div className="MyPageUserInfo_sub">
          <div className="MyPageUserInfo_sub1">
            {/* <img src='https://kream.co.kr/_nuxt/img/blank_profile.4347742.png' alt='프로필이미지' className='MyPageUserInfo_img' /> */}
            <img src={inputUser.userProfile ? inputUser.userProfile : 'https://kream.co.kr/_nuxt/img/blank_profile.4347742.png'} alt="프로필이미지" className="MyPageUserInfo_img" />
            <div className="MyPageUserInfo_img_sub_box">
              <div className="MyPageUserInfo_img_nickname">{inputUser.userNickname}</div>
              <div className="MyPageUserInfo_img_sub">
                <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} style={{ display: 'none' }} ref={inputRef} />
                <div className="MyPageUserInfo_img_btn" onClick={handleFileClick}>
                  이미지 변경
                </div>
                <div className="MyPageUserInfo_img_btn" onClick={handleFileDelete}>
                  삭제
                </div>
              </div>
            </div>
          </div>

          <div className="MyPageUserInfo_sub2">
            <h3 className="MyPageUserInfo_title_sub">로그인 정보</h3>
            <div>
              <div className="MyPageUserInfo_input_box">
                <div className="MyPageUserInfo_input_title">이메일 주소</div>
                <div className="MyPageUserInfo_input_main">
                  <input id="userEmail" className="MyPageUserInfo_input" type="text" value={inputUser.userEmail || ''} onChange={handleChange} readOnly />
                </div>
              </div>
              <div>
                <div className="MyPageUserInfo_input_title">비밀번호</div>
                <div className="MyPageUserInfo_input_main">
                  <input id="userPw" className="MyPageUserInfo_input" type="password" value={inputUser.userPw || ''} onChange={handleChange} />
                  <div className="MyPageUserInfo_input_change" onClick={() => handleUpdate('userPw')}>
                    변경
                  </div>
                </div>
                {passwordError && <span className="msg">영문, 숫자, 특수문자를 조합해서 입력해주세요. (8-16자)</span>}
              </div>
            </div>
          </div>
          <div className="MyPageUserInfo_sub3">
            <h3 className="MyPageUserInfo_title_sub">개인 정보</h3>
            <div>
              <div className="MyPageUserInfo_input_box">
                <div className="MyPageUserInfo_input_title">이름</div>
                <div className="MyPageUserInfo_input_main">
                  <input id="userName" className="MyPageUserInfo_input" type="text" value={inputUser.userName || ''} onChange={handleChange} />
                  <div className="MyPageUserInfo_input_change" onClick={() => handleUpdate('userName')}>
                    변경
                  </div>
                </div>
              </div>
              <div className="MyPageUserInfo_input_box">
                <div className="MyPageUserInfo_input_title">닉네임</div>
                <div className="MyPageUserInfo_input_main">
                  <input id="userNickname" className="MyPageUserInfo_input" type="text" value={inputUser.userNickname || ''} onChange={handleChange} />
                  <div className="MyPageUserInfo_input_change" onClick={() => handleUpdate('userNickname')}>
                    변경
                  </div>
                </div>
                {nickNameError && <span className="msg">한글, 영문, 숫자를 10자 이내로 입력해주세요.</span>}
              </div>
              <div className="MyPageUserInfo_input_box">
                <div className="MyPageUserInfo_input_title">생년월일</div>
                <div className="MyPageUserInfo_input_main">
                  <input id="userBirth" className="MyPageUserInfo_input" type="date" value={inputUser.userBirth || ''} onChange={handleChange} />
                  <div className="MyPageUserInfo_input_change" onClick={() => handleUpdate('userBirth')}>
                    변경
                  </div>
                </div>
              </div>
              <div className="MyPageUserInfo_input_box">
                <div className="MyPageUserInfo_input_title">휴대폰번호</div>
                <div className="MyPageUserInfo_input_main">
                  <input id="userTel" className="MyPageUserInfo_input" type="number" value={inputUser.userTel || ''} onChange={handleChange} />
                  <div className="MyPageUserInfo_input_change" onClick={() => handleUpdate('userTel')}>
                    변경
                  </div>
                </div>
                {duplicateTel && <span className="msg">이미 가입된 전화번호입니다.</span>}
              </div>

              <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles} onRequestClose={() => setIsOpen(false)}>
                <DaumPostcode onComplete={completeHandler} height="100%" />
              </Modal>

              <div className="MyPageUserInfo_input_box">
                <div className="MyPageUserInfo_input_title">배송주소</div>
                <div className="MyPageUserInfo_input_main">
                  <input value={inputUser.userZipCode || ''} readOnly placeholder="우편번호" className="MyPageUserInfo_input_addr1" />
                  <input value={inputUser.userAddr || ''} readOnly placeholder="도로명 주소" className="MyPageUserInfo_input_addr2" />
                  <input type="text" value={inputUser.userDetailAddr || ''} placeholder="상세주소" className="MyPageUserInfo_input_addr3" onChange={(e) => setInputUser({ ...inputUser, userDetailAddr: e.target.value })} />
                  <div className="MyPageUserInfo_input_change" onClick={toggle}>
                    검색
                  </div>
                  <div className="MyPageUserInfo_input_change" onClick={handleUpdateAddr}>
                    변경
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPageUserInfo;
