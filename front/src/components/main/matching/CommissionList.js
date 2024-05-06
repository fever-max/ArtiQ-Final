import React, { useState, useEffect } from 'react';
import '../../../styles/main/matching/CommissionList.css';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function CommissionList() {
  const location = useLocation();

  const data = location.state.Data;
  console.log("Data:", data);

  const reField = data.reField;
  const reGenre = data.reGenre;
  const reqUserEmail = data.reqUserEmail; //유저이메일  

  const userName=data.userName;
  const reArtwork=data.reArtwork;
  const reArtist=data.reArtist;
  const reSize=data.reSize;
  const reProductYear=data.reProductYear;
  const reDetails=data.reDetails;
  const file=data.file;
  
  console.log(userName,reqUserEmail,reArtwork,reArtist,reSize,reProductYear,reDetails,file, "&&&&&&&&&&&&&");

  const [commissionData, setCommissionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(reqUserEmail, reField, reGenre + '1111111111111111');
      try {
        if (reField && reGenre) {
          const response1 = await axios.get(`http://localhost:4000/commissionList/FG?reField=${reField}&reGenre=${reGenre}`);
          setCommissionData(response1.data);
          console.log(response1.data + '2222222222222222');
        }
      } catch (error) {
        console.error('데이터 불러오기 에러:', error);
      }
    };

    fetchData();
  }, [reField, reGenre]);

  // CommissionList 컴포넌트 내의 버튼 클릭 핸들러
  const handleRequest = async (userEmail, reqUserEmail) => {
    try {

        await axios.post('http://localhost:4000/commission/uploads', {file:file,reGenre:reGenre,reField:reField,reqUserEmail:reqUserEmail,userName:userName,reArtwork:reArtwork,reArtist:reArtist,reSize:reSize,reProductYear:reProductYear,reDetails:reDetails,userEmail: userEmail}, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      // 서버에 요청을 보냄
      await axios.post('http://localhost:4000/commission/request', { userEmail: userEmail, reqUserEmail: reqUserEmail });

      // 요청이 성공적으로 완료되면 요청 완료 페이지로 이동
      window.location.href = '/commissionCompleted';
    } catch (error) {
      console.error('견적 요청 에러:', error);
    }
  };

  return (
    <div className="ERDiv">
      <div className="ERDiv_main">
        <div className="ER_title">
          <h2>
            {reField}·{reGenre} 전문 감정사
          </h2>
        </div>
        <br />
        <br />
        <div className="">
          {commissionData.map((commission, index) => (
            <div className="list" key={index}>
              <div className="image-and-content">
                <div className="commissionImg">
                  <img src={commission.imageURL} alt={commission.userName} />
                </div>
                <div className="ccontent">
                  <div className="image-and-content">
                    <p className="cname">{commission.userName}</p>
                    <p className="cfield">
                      {commission.reField} / {commission.reGenre1} {commission.reGenre2} {commission.reGenre3} {commission.reGenre4} {commission.reGenre5} / {commission.apCareer}
                    </p>
                  </div>
                  <p className="ccarrer">{commission.apMessage}</p>
                </div>
                <div className="">
                  <div></div>
                  <div className="btnSize button-content">
                    <button className="transparent-border button-content" onClick={() => handleRequest(commission.userEmail, reqUserEmail)}>
                      견적 요청
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <br />
      </div>
    </div>
  );
}

export default CommissionList;
