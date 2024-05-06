import React, { useState, useEffect } from 'react';
import '../../../../styles/main/admin/info/AdminExpertReq.css';
import axios from 'axios';
import Modal from 'react-modal';
import { IoMdCloseCircleOutline } from 'react-icons/io';

// jwt 전역변수
let jwt = '';

function AdminExpertReq() {
  const [expertData, setExpertData] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [apNoMessage, setApNoMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      //jwt 받아와서 어드민 인증
      const jwtResponse = await axios.get('http://localhost:4000/user/jwt', { withCredentials: true });
      jwt = jwtResponse.data;

      if (jwtResponse) {
        const userInfoResponse = await axios.get('http://localhost:4000/admin/expertData', {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        setExpertData(userInfoResponse.data);
        //console.log('expertData:' + expertData);
      }
    } catch (error) {
      console.error('유저 정보를 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const handleApproval = async (expertIndex) => {
    const expert = expertData[expertIndex];
    const confirmDelete = window.confirm(expert.userName + '님을 감정사로 승인하시겠습니까?');

    if (confirmDelete) {
      try {
        const expertRequestEntity = {
          apCareer: expert.apCareer,
          apDate: expert.apDate,
          apMessage: expert.apMessage,
          fileSize: expert.fileSize,
          imageURL: expert.imageURL,
          originalFileName: expert.originalFileName,
          reField: expert.reField,
          reGenre1: expert.reGenre1,
          reGenre2: expert.reGenre2,
          reGenre3: expert.reGenre3,
          reGenre4: expert.reGenre4,
          reGenre5: expert.reGenre5,
          saveFileName: expert.saveFileName,
          userEmail: expert.userEmail,
          userName: expert.userName,
        };
        const response = await axios.post('http://localhost:4000/admin/expertData/ok', expertRequestEntity, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        alert('승인 완료');
        console.log(response.data); // 승인 결과 출력
        fetchData(); //승인 후 다시 정보 갖고옴
      } catch (error) {
        console.error('승인 요청 중 오류가 발생했습니다.', error);
      }
    }
  };

  //거절 버튼 > 모달창 열림
  const handleRejectionBtn = async (userEmail, userName) => {
    setUserEmail(userEmail);
    setUserName(userName);
    setIsOpen(!isOpen);
  };

  //거절 이유 모달
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
    },
    content: {
      left: '0',
      margin: 'auto',
      width: '600px',
      height: '300px',
      padding: '0',
      overflow: 'hidden',
    },
  };

  const onClickClose = () => {
    setIsOpen(false); // 모달 닫기버튼
  };

  const handleRejection = async () => {
    const confirmRejection = window.confirm(userName + '님을 거절하시겠습니까?');

    console.log('넘기는 거절 사유: ' + apNoMessage);

    if (confirmRejection) {
      try {
        await axios.post('http://localhost:4000/admin/expertData/reject', { userEmail: userEmail, apNoMessage: apNoMessage }, { headers: { Authorization: `Bearer ${jwt}` } });
        alert('거절 완료');
        setIsOpen(!isOpen); //모달 닫음
        fetchData(); // 거절 후 다시 정보 갖고옴
      } catch (error) {
        console.error('거절 요청 중 오류가 발생했습니다.', error);
      }
    }
  };

  return (
    <div className="AdminExpertReq_div">
      <div className="AdminExpertReq_div">
        <h3 className="AdminExpertReq_title">감정사 신청 내역</h3>
        <hr className="AdminExpertReq_hr" />
        {expertData.length === 0 ? (
          <div className="AdminExpertReq_noDataMessage">감정사 신청이 없습니다.</div>
        ) : (
          expertData.map((expert, index) => (
            <div className="AdminExpertReq_sub" key={index}>
              <div className="AdminExpertReq_sub1">
                <img src={expert.imageURL} alt={expert.userName} className="AdminExpertReq_sub_img" />
              </div>
              <div className="AdminExpertReq_sub2">
                <div className="AdminExpertReq_sub_div">
                  <div className="AdminExpertReq_sub_title">이름: </div>
                  <div>{expert.userName}</div>
                </div>
                <div className="AdminExpertReq_sub_div">
                  <div className="AdminExpertReq_sub_title">이메일: </div>
                  <div>{expert.userEmail}</div>
                </div>
                <div className="AdminExpertReq_sub_div">
                  <div className="AdminExpertReq_sub_title">전문분야: </div>
                  <div>
                    {expert.reField} / {expert.reGenre1} {expert.reGenre2} {expert.reGenre3} {expert.reGenre4} {expert.reGenre5}
                  </div>
                </div>
                <div className="AdminExpertReq_sub_div">
                  <div className="AdminExpertReq_sub_title">경력: </div>
                  <div>{expert.apCareer}</div>
                </div>
                <div>
                  <div className="AdminExpertReq_sub_title">신청메세지 </div>
                  <div>{expert.apMessage}</div>
                </div>
                <div className="AdminExpertReq_sub_btn">
                  <div onClick={() => handleApproval(index)}>승인</div>
                  <div onClick={() => handleRejectionBtn(expert.userEmail, expert.userName)}>거절</div>
                </div>
                <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
                  <div className="AdminExpertReqModal">
                    <div className="AdminUserInfo_close_btn" onClick={onClickClose}>
                      <IoMdCloseCircleOutline size="25" />
                    </div>
                    <hr className="AdminExpertReq_hr" />
                    <div className="AdminExpertReqModal_title">감정사 거절 사유</div>

                    <div>
                      <textarea className="AdminExpertReqModal_txt" value={apNoMessage} onChange={(e) => setApNoMessage(e.target.value)} />
                    </div>
                    <div className="AdminExpertReqModal_btn">
                      <div className="AdminExpertReqModal_btn1" onClick={() => handleRejection()}>
                        거절
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminExpertReq;
