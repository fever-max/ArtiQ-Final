import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../styles/main/userInfo/myPage/MyExpert.css';

function MyExpert() {
  //감정사 신청 테이블
  const [expertRequest, setExpertRequest] = useState([]);
  const [expertRequestOk, setExpertRequestOk] = useState([]);
  const [expertRequestNo, setExpertRequestNo] = useState([]);

  useEffect(() => {
    fetchData1();
    fetchData2();
    fetchData3();
  }, []);

  const fetchData1 = async () => {
    try {
      const expertRequest = await axios.get('http://localhost:4000/user/myPage/expertRequest1', { withCredentials: true });
      setExpertRequest(expertRequest.data);
    } catch (error) {
      console.error('신청 테이블을 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const fetchData2 = async () => {
    try {
      const expertRequest = await axios.get('http://localhost:4000/user/myPage/expertRequest2', { withCredentials: true });
      setExpertRequestOk(expertRequest.data);
    } catch (error) {
      console.error('신청 승인 테이블을 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const fetchData3 = async () => {
    try {
      const expertRequest = await axios.get('http://localhost:4000/user/myPage/expertRequest3', { withCredentials: true });
      setExpertRequestNo(expertRequest.data);
    } catch (error) {
      console.error('신청 거절 테이블을 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  //취소 버튼들
  const onCancel1 = async (userEmail) => {
    const onCancelMsg = window.confirm('감정사 신청을 취소하시겠습니까?');

    if (onCancelMsg) {
      try {
        await axios.post('http://localhost:4000/user/myPage/expertRequestCancel1', { userEmail: userEmail });
        console.log('감정사 신청 삭제 완료');
        fetchData1();
        fetchData2();
        fetchData3();
      } catch (error) {
        console.error('신청 거절 오류', error);
      }
    }
  };

  const onCancel2 = async (userEmail) => {
    const onCancelMsg = window.confirm('감정사를 철회하시겠습니까?');

    if (onCancelMsg) {
      try {
        await axios.post('http://localhost:4000/user/myPage/expertRequestCancel2', { userEmail: userEmail });
        console.log('감정사 취소');
        fetchData1();
        fetchData2();
        fetchData3();
      } catch (error) {
        console.error('승인 삭제 거절 오류', error);
      }
    }
  };

  const onCancel3 = async (userEmail) => {
    const onCancelMsg = window.confirm('감정사 신청을 기록을 삭제하시겠습니까?');

    if (onCancelMsg) {
      try {
        await axios.post('http://localhost:4000/user/myPage/expertRequestCancel3', { userEmail: userEmail });
        console.log('감정사 기록 삭제');
        fetchData1();
        fetchData2();
        fetchData3();
      } catch (error) {
        console.error('거절 테이블 오류', error);
      }
    }
  };

  return (
    <div className="MyExpert_div">
      <div className="MyExpert_div">
        <h3 className="MyExpert_title">감정사 신청 내역</h3>
        <hr className="MyExpert_hr" />
        <div className="MyExpert_sub">
          <div className="MyExpert_table">
            <div className="MyExpert_table_column">
              <div className="MyExpert_table_column1">신청일</div>
              <div className="MyExpert_table_column2">전문분야</div>
              <div className="MyExpert_table_column3">세부분야</div>
              <div className="MyExpert_table_column4">신청 메세지</div>
              <div className="MyExpert_table_column5">승인 여부</div>
              <div className="MyExpert_table_column6">삭제/철회/취소</div>
            </div>
            {expertRequest.length === 0 && expertRequestOk.length === 0 && expertRequestNo.length === 0 ? (
              <div className="AdminExpertReq_noDataMessage">감정사 신청이 없습니다.</div>
            ) : (
              <div className="MyExpert_table_contents">
                {expertRequest.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyExpert_table_row">
                    <div className="MyExpert_table_column1_sub">{expertRequest.apDate}</div>
                    <div className="MyExpert_table_column2_sub">{expertRequest.reField}</div>
                    <div className="MyExpert_table_column3_sub">
                      {expertRequest.reGenre1} {expertRequest.reGenre2} {expertRequest.reGenre3} {expertRequest.reGenre4} {expertRequest.reGenre5}
                    </div>
                    <div className="MyExpert_table_column4_sub">{expertRequest.apMessage}</div>
                    <div className="MyExpert_table_column5_sub">심사 대기중</div>
                    <div className="MyExpert_table_column6_sub">
                      <div onClick={() => onCancel1(expertRequest.userEmail)} className="MyExpert_table_btn">취소</div>
                    </div>
                  </div>
                )}
                {expertRequestOk.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyExpert_table_row">
                    <div className="MyExpert_table_column1_sub">{expertRequestOk.apDate}</div>
                    <div className="MyExpert_table_column2_sub">{expertRequestOk.reField}</div>
                    <div className="MyExpert_table_column3_sub">
                      {expertRequestOk.reGenre1} {expertRequestOk.reGenre2} {expertRequestOk.reGenre3} {expertRequestOk.reGenre4} {expertRequestOk.reGenre5}
                    </div>
                    <div className="MyExpert_table_column4_sub">{expertRequestOk.apMessage}</div>
                    <div className="MyExpert_table_column5_sub">심사 완료</div>
                    <div className="MyExpert_table_column6_sub">
                      <div onClick={() => onCancel2(expertRequestOk.userEmail)} className="MyExpert_table_btn">
                        철회
                      </div>
                    </div>
                  </div>
                )}
                {expertRequestNo.length === 0 ? (
                  // 없으면 빈값
                  <div></div>
                ) : (
                  <div className="MyExpert_table_row">
                    <div className="MyExpert_table_column1_sub">{expertRequestNo.apDate}</div>
                    <div className="MyExpert_table_column2_sub">{expertRequestNo.reField}</div>
                    <div className="MyExpert_table_column3_sub">
                      {expertRequestNo.reGenre1} {expertRequestNo.reGenre2} {expertRequestNo.reGenre3} {expertRequestNo.reGenre4} {expertRequestNo.reGenre5}
                    </div>
                    <div className="MyExpert_table_column4_sub">{expertRequestNo.apMessage} <br/><br/> 거절사유 : {expertRequestNo.apNoMessage}</div>
                    <div className="MyExpert_table_column5_sub">심사 거절</div>
                    <div className="MyExpert_table_column6_sub">
                      <div onClick={() => onCancel3(expertRequestNo.userEmail)} className="MyExpert_table_btn">삭제</div>
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

export default MyExpert;
