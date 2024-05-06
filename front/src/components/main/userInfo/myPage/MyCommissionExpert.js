import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../styles/main/userInfo/myPage/MyCommissionExpert.css';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import Modal from 'react-modal';

function MyCommissionExpert() {

  // 감정사가 받은 의뢰
  const [myCommissionExpertData, setMyCommissionExpertData] = useState([]);
  const [myCommissionExpertDataOK, setMyCommissionExpertDataOK] = useState([]);
  const [myCommissionExpertDataNO, setMyCommissionExpertDataNO] = useState([]);

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [apNoMessage, setApNoMessage] = useState('');
  const [apOkMessage, setApOkMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [isOpenApprovalModal, setIsOpenApprovalModal] = useState(false);
  const [isOpenRejectionModal, setIsOpenRejectionModal] = useState(false);  

  useEffect(() => {
    fetchData1();
    fetchData2();
    fetchData3();
  }, []);

  const fetchData1 = async () => {
    try {
      const response = await axios.get('http://localhost:4000/user/myPage/myCommissionExpert1', { withCredentials: true });
      setMyCommissionExpertData(response.data);
      console.log('myCommissionExpertData: ' + myCommissionExpertData);
    } catch (error) {
      console.error('의뢰 받은 테이블을 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const fetchData2 = async () => {
    try {
      const expertRequest = await axios.get('http://localhost:4000/user/myPage/myCommissionExpert2', { withCredentials: true });
      setMyCommissionExpertDataOK(expertRequest.data);
    } catch (error) {
      console.error('의뢰 받은 승인 테이블을 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const fetchData3 = async () => {
    try {
      const expertRequest = await axios.get('http://localhost:4000/user/myPage/myCommissionExpert3', { withCredentials: true });
      setMyCommissionExpertDataNO(expertRequest.data);
    } catch (error) {
      console.error('의뢰 받은 거절 테이블을 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  //거절 버튼 > 모달창 열림
  const handleRejectionBtn = async (userEmail, userName) => {
    setUserEmail(userEmail);
    setUserName(userName);
    setIsOpenApprovalModal(true);
  };

  //승인 버튼 > 모달창 열림
  const handleApprovalBtn = async (userEmail, userName) => {
    setUserEmail(userEmail);
    setUserName(userName);
    setIsOpenRejectionModal(true);
  };

  //모달
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
    setIsOpenApprovalModal(false);
    setIsOpenRejectionModal(false);
  };

  const handleApproval = async () => {
    const confirmApproval = window.confirm(userName + '님의 의뢰를 승인하시겠습니까?');

    console.log('넘기는 승인 사유: ' + apOkMessage);

    if (confirmApproval) {
      try {
        await axios.post('http://localhost:4000/user/commissionExpert/ok'
        , { userEmail: userEmail, apOkMessage: apOkMessage }
        );
        alert('승인 완료');
        setIsOpen(!isOpen);
        fetchData1(); //승인 후 다시 정보 갖고옴
      } catch (error) {
        console.error('승인 요청 중 오류가 발생했습니다.', error);
      }
    }
  };

  const handleRejection = async () => {
    const confirmRejection = window.confirm(userName + '님을 거절하시겠습니까?');

    console.log('넘기는 거절 사유: ' + apNoMessage);

    if (confirmRejection) {
      try {
        await axios.post('http://localhost:4000/user/commissionExpert/no', { userEmail: userEmail, apNoMessage: apNoMessage });
        alert('거절 완료');
        setIsOpen(!isOpen); //모달 닫음
        fetchData1(); // 거절 후 다시 정보 갖고옴
      } catch (error) {
        console.error('거절 요청 중 오류가 발생했습니다.', error);
      }
    }
  };

  return (
    <div className="MyCommissionExpert_div">
      <div className="MyCommissionExpert_div">
        <h3 className="MyCommissionExpert_title">감정 신청 내역</h3>
        <hr className="MyCommissionExpert_hr" />
        <div className="MyCommissionExpert_sub">
          <div className="MyCommissionExpert_table">
            <div className="MyCommissionExpert_table_column">
              <div className="MyCommissionExpert_table_column0">사진</div>
              <div className="MyCommissionExpert_table_column1">신청일</div>
              <div className="MyCommissionExpert_table_column2">전문분야</div>
              <div className="MyCommissionExpert_table_column3">세부분야</div>
              <div className="MyCommissionExpert_table_column4">신청 메세지</div>
              <div className="MyCommissionExpert_table_column5">승인 여부</div>
              <div className="MyCommissionExpert_table_column6">수락 / 거절</div>
            </div>
              {myCommissionExpertData.length === 0 && myCommissionExpertDataOK.length === 0 && myCommissionExpertDataNO.length === 0 ? (
              <div className="AdminExpertReq_noDataMessage">들어온 감정 신청 내역이 없습니다.</div>
            ) : (
              <div className="MyCommissionExpert_table_contents">
                {myCommissionExpertData.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyCommissionExpert_table_row">
                    <div className="MyCommissionExpert_table_column0">
                      <img src={myCommissionExpertData.imageURL} alt={myCommissionExpertData} />
                    </div>
                    <div className="MyCommissionExpert_table_column1">{myCommissionExpertData.apDate}</div>
                    <div className="MyCommissionExpert_table_column2">{myCommissionExpertData.reField}</div>
                    <div className="MyCommissionExpert_table_column3">
                      {myCommissionExpertData.reGenre}
                    </div>
                    <div className="MyCommissionExpert_table_column4">{myCommissionExpertData.reDetails}</div>
                    <div className="MyCommissionExpert_table_column5">심사 대기중</div>
                    <div className="">
                      <div className="aa">
                        <div onClick={() => handleApprovalBtn(myCommissionExpertData.userEmail, myCommissionExpertData.userName)} className="MyCommissionReq_sub_btn">승인</div>
                        <div onClick={() => handleRejectionBtn(myCommissionExpertData.userEmail, myCommissionExpertData.userName)} className="MyCommissionReq_sub_btn">거절</div>
                      </div>
                      {/* 승인 모달 */}
                      <Modal isOpen={isOpenRejectionModal} style={customStyles} ariaHideApp={false}>
                        <div className="AdminExpertReqModal">
                          <div className="AdminUserInfo_close_btn" onClick={onClickClose}>
                            <IoMdCloseCircleOutline size="25" />
                          </div>
                          <hr className="AdminExpertReq_hr" />
                          <div className="AdminExpertReqModal_title">의뢰 승인 사유</div>
                          <div>
                            <textarea className="AdminExpertReqModal_txt" value={apOkMessage} onChange={(e) => setApOkMessage(e.target.value)} />
                          </div>
                          <div className="AdminExpertReqModal_btn">
                            <div className="AdminExpertReqModal_btn1" onClick={() => handleApproval()}>
                              승인
                            </div>
                          </div>
                        </div>
                      </Modal>
                      <Modal isOpen={isOpenApprovalModal} style={customStyles} ariaHideApp={false}>
                        <div className="AdminExpertReqModal">
                          <div className="AdminUserInfo_close_btn" onClick={onClickClose}>
                            <IoMdCloseCircleOutline size="25" />
                          </div>
                          <hr className="AdminExpertReq_hr" />
                          <div className="AdminExpertReqModal_title">의뢰 거절 사유</div>
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
                  )}
                {myCommissionExpertDataOK.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyCommissionExpert_table_row">
                    <div className="MyCommissionExpert_table_column0">
                      <img src={myCommissionExpertDataOK.imageURL} alt={myCommissionExpertDataOK} />
                    </div>
                    <div className="MyCommissionExpert_table_column1">{myCommissionExpertDataOK.apDate}</div>
                    <div className="MyCommissionExpert_table_column2">{myCommissionExpertDataOK.reField}</div>
                    <div className="MyCommissionExpert_table_column3">
                      {myCommissionExpertDataOK.reGenre}
                    </div>
                    <div className="MyCommissionExpert_table_column4">{myCommissionExpertDataOK.reDetails} <br/><br/> 평가내용 : {myCommissionExpertDataOK.apOkMessage}</div>
                    <div className="MyCommissionExpert_table_column5">심사 완료</div>
                    <div className="MyCommissionExpert_table_column6">
                      {/* <div onClick={() => onCancel2(myCommissionExpertDataOK.userEmail)}>철회</div> */}
                    </div>
                  </div>
                )}
                {myCommissionExpertDataNO.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyCommissionExpert_table_row">
                    <div className="MyCommissionExpert_table_column0">
                      <img src={myCommissionExpertDataNO.imageURL} alt={myCommissionExpertDataNO} />
                    </div>
                    <div className="MyCommissionExpert_table_column1">{myCommissionExpertDataNO.apDate}</div>
                    <div className="MyCommissionExpert_table_column2">{myCommissionExpertDataNO.reField}</div>
                    <div className="MyCommissionExpert_table_column3">
                      {myCommissionExpertDataNO.reGenre}
                    </div>
                    <div className="MyCommissionExpert_table_column4">{myCommissionExpertDataNO.reDetails} <br/><br/> 거절사유 : {myCommissionExpertDataNO.apNoMessage}</div>
                    <div className="MyCommissionExpert_table_column5">심사 거절</div>
                    <div className="MyCommissionExpert_table_column6">
                      {/* <div onClick={() => onCancel3(myCommissionExpertDataNO.userEmail)}>삭제</div> */}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCommissionExpert;
