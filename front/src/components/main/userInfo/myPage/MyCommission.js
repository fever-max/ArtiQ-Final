import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../styles/main/userInfo/myPage/MyCommission.css';

function MyCommission() {
  // 감정사에게 보낸 의뢰
  const [myCommissionData, setMyCommissionData] = useState([]);
  const [myCommissionDataOK, setMyCommissionDataOK] = useState([]);
  const [myCommissionDataNO, setMyCommissionDataNO] = useState([]);

  const fetchData1 = async () => {
    try {
      const response = await axios.get('http://localhost:4000/user/myPage/myCommission1', { withCredentials: true });
      setMyCommissionData(response.data);
      console.log('myCommissionData: ' + myCommissionData);
    } catch (error) {
      console.error('데이터 불러오기 에러:', error);
    }
  };

  const fetchData2 = async () => {
    try {
      const expertRequest = await axios.get('http://localhost:4000/user/myPage/myCommission2', { withCredentials: true });
      setMyCommissionDataOK(expertRequest.data);
    } catch (error) {
      console.error('보낸 의뢰 승인 테이블을 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const fetchData3 = async () => {
    try {
      const expertRequest = await axios.get('http://localhost:4000/user/myPage/myCommission3', { withCredentials: true });
      setMyCommissionDataNO(expertRequest.data);
    } catch (error) {
      console.error('보낸 의뢰 거절 테이블을 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  //취소 버튼들
  const onCancel1 = async (userEmail) => {
    const onCancelMsg = window.confirm('보낸 의뢰 신청을 취소하시겠습니까?');

    if (onCancelMsg) {
      try {
        await axios.post('http://localhost:4000/user/myPage/myCommissionCancel1', { userEmail: userEmail });
        console.log('보낸 의뢰 신청 삭제 완료');
        fetchData1();
        fetchData2();
        fetchData3();
      } catch (error) {
        console.error('보낸 의뢰 신청 거절 오류', error);
      }
    }
  };

  const onCancel2 = async (userEmail) => {
    const onCancelMsg = window.confirm('보낸 의뢰를 철회하시겠습니까?');

    if (onCancelMsg) {
      try {
        await axios.post('http://localhost:4000/user/myPage/myCommissionCancel2', { userEmail: userEmail });
        console.log('보낸 의뢰 취소');
        fetchData1();
        fetchData2();
        fetchData3();
      } catch (error) {
        console.error('승인 삭제 거절 오류', error);
      }
    }
  };

  const onCancel3 = async (userEmail) => {
    const onCancelMsg = window.confirm('보낸 의뢰 신청을 기록을 삭제하시겠습니까?');

    if (onCancelMsg) {
      try {
        await axios.post('http://localhost:4000/user/myPage/myCommissionCancel3', { userEmail: userEmail });
        console.log('보낸 의뢰 기록 삭제');
        fetchData1();
        fetchData2();
        fetchData3();
      } catch (error) {
        console.error('거절 테이블 오류', error);
      }
    }
  };

  useEffect(() => {
    fetchData1();
    fetchData2();
    fetchData3();
  }, []);

  return (
    <div className="MyCommission_div">
      <div className="MyCommission_div">
        <h3 className="MyCommission_title">감정 신청 내역</h3>
        <hr className="MyCommission_hr" />
        <div className="MyCommission_sub">
          <div className="MyCommission_table">
            <div className="MyCommission_table_column">
              <div className="MyCommission_table_column0">사진</div>
              <div className="MyCommission_table_column1">신청일</div>
              <div className="MyCommission_table_column2">전문분야</div>
              <div className="MyCommission_table_column3">세부분야</div>
              <div className="MyCommission_table_column4">메세지</div>
              <div className="MyCommission_table_column5">승인 여부</div>
              <div className="MyCommission_table_column6">취소/삭제/변경</div>
            </div>
            {myCommissionData.length === 0 && myCommissionDataOK.length === 0 && myCommissionDataNO.length === 0 ? (
              <div className="AdminExpertReq_noDataMessage">보낸 감정 신청 내역이 없습니다.</div>
            ) : (
              <div className="MyCommissionExpert_table_contents">
                {myCommissionData.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyCommission_table_row">
                    <div className="MyCommission_table_column0">
                      <img src={myCommissionData.imageURL} alt={myCommissionData.imageURL} />
                    </div>
                    <div className="MyCommission_table_column1">{myCommissionData.apDate}</div>
                    <div className="MyCommission_table_column2">{myCommissionData.reField}</div>
                    <div className="MyCommission_table_column3">{myCommissionData.reGenre}</div>
                    <div className="MyCommission_table_column4">{myCommissionData.reDetails}</div>
                    <div className="MyCommission_table_column5">심사 대기중</div>
                    <div className="MyCommission_table_column6">
                      <div onClick={() => onCancel1(myCommissionData.reqUserEmail)}>취소</div>
                    </div>
                  </div>
                )}
                {myCommissionDataOK.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyCommission_table_row">
                    <div className="MyCommission_table_column0">
                      <img src={myCommissionDataOK.imageURL} alt={myCommissionDataOK} />
                    </div>
                    <div className="MyCommission_table_column1">{myCommissionDataOK.apDate}</div>
                    <div className="MyCommission_table_column2">{myCommissionDataOK.reField}</div>
                    <div className="MyCommission_table_column3">{myCommissionDataOK.reGenre}</div>
                    <div className="MyCommission_table_column4">
                      {myCommissionDataOK.reDetails} <br />
                      <br /> 평가 내용 : {myCommissionDataOK.apOkMessage}
                    </div>
                    <div className="MyCommission_table_column5">심사 완료</div>
                    <div className="MyCommission_table_column6">
                      <div onClick={() => onCancel2(myCommissionDataOK.reqUserEmail)}>철회</div>
                    </div>
                  </div>
                )}
                {myCommissionDataNO.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyCommission_table_row">
                    <div className="MyCommission_table_column0">
                      <img src={myCommissionDataNO.imageURL} alt={myCommissionDataNO} />
                    </div>
                    <div className="MyCommission_table_column1">{myCommissionDataNO.apDate}</div>
                    <div className="MyCommission_table_column2">{myCommissionDataNO.reField}</div>
                    <div className="MyCommission_table_column3">{myCommissionDataNO.reGenre}</div>
                    <div className="MyCommission_table_column4">
                      {myCommissionDataNO.reDetails} <br />
                      <br /> 거절 사유 : {myCommissionDataNO.apNoMessage}
                    </div>
                    <div className="MyCommission_table_column5">심사 거절 </div>
                    <div className="MyCommission_table_column6">
                      <div onClick={() => onCancel3(myCommissionDataNO.reqUserEmail)}>삭제</div>
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

export default MyCommission;
