import React, { useEffect, useState } from 'react';
import '../../../../styles/main/admin/info/AdminPayInfo.css';
import axios from 'axios';

function AdminPayInfo({ jwt }) {
  //유저 포인트 결제 정보
  const [pointDataList, setPointDataList] = useState([]);
  // 총 결제 금액
  const [totalPayment, setTotalPayment] = useState(0);
  // 오늘 결제 금액
  const [todayPayment, setTodayPayment] = useState(0);

  useEffect(() => {
    //페이지 키자마자 시작
    fetchUserPoint();
  }, []);

  //포인트 결제 테이블 불러오기
  const fetchUserPoint = async () => {
    try {
      console.log('jwt 확인:' + jwt);
      const response = await axios.get('http://localhost:4000/admin/userPointTable', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      // 받은 데이터 처리
      console.log(response.data);
      setPointDataList(response.data);
    } catch (error) {
      console.error('포인트 결제 테이블 정보가 없습니다.', error);
    }
  };

  useEffect(() => {
    // 총 결제 금액 계산
    const total = pointDataList.reduce((acc, item) => {
      // 포인트 결제가 있고, 유효한 값인 경우에만 더함
      if (item.pointPay && !isNaN(parseFloat(item.pointPay))) {
        return acc + parseFloat(item.pointPay);
      }
      return acc;
    }, 0);
    setTotalPayment(total);

    // 오늘 결제 금액 계산
    const today = pointDataList
      .filter((item) => {
        const date = new Date(item.pointDate);
        const todayDate = new Date();
        return date.getDate() === todayDate.getDate() && date.getMonth() === todayDate.getMonth() && date.getFullYear() === todayDate.getFullYear();
      })
      .reduce((acc, item) => {
        // 포인트 결제가 있고, 유효한 값인 경우에만 더함
        if (item.pointPay && !isNaN(parseFloat(item.pointPay))) {
          return acc + parseFloat(item.pointPay);
        }
        return acc;
      }, 0);
    setTodayPayment(today);
  }, [pointDataList]);

  // 날짜 형식을 변경하는 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    let hours = date.getHours();
    hours = hours < 10 ? '0' + hours : hours;
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${year}-${month}-${day} ${hours}:${minutes}`; // 원하는 날짜 형식으로 변환
  };

  //결제 취소 함수
  const onPayCancel = async (pointCertify) => {
    const confirm = window.confirm('결제번호:' + pointCertify + ' / 결제를 취소하시겠습니까?');
    const impKey = process.env.REACT_APP_IMP_KEY;
    const impSecret = process.env.REACT_APP_IMP_SECRET;
    if (confirm) {
      try {
        //access_token 받아옴
        const response = await axios({
          url: '/users/getToken',
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          data: {
            imp_key: impKey,
            imp_secret: impSecret,
          },
        });
        const { access_token } = response.data.response;
        console.log('받아온 access_token:', access_token);

        //취소요청
        getCancelData(access_token, pointCertify);
      } catch (error) {
        console.error('토큰 추출 에러 발생:', error);
      }
    }
  };

  //취소 요청
  const getCancelData = async (access_token, pointCertify) => {
    try {
      const response = await axios.post(
        '/payments/cancel',
        {
          imp_uid: pointCertify, // 주문번호 (필수)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: access_token, // 엑세스 토큰 (필수)
          },
        }
      );
      console.log('결제 취소 완료' + response.data);
      //DB 삭제 요청
      pointTableCancel(pointCertify);
    } catch (error) {
      console.error('결제 취소 에러 발생:', error);
    }
  };

  //DB 삭제
  const pointTableCancel = async (pointCertify) => {
    try {
      console.log('넘어가는 결제 번호:' + pointCertify);
      const response = await axios.post(
        'http://localhost:4000/admin/userPointTable/cancel',
        {
          pointCertify: pointCertify,
        },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );

      // 받은 데이터
      console.log(response.data);
      alert('결제 취소 완료');
      fetchUserPoint();
    } catch (error) {
      console.error('결제 테이블 삭제 실패', error);
    }
  };

  return (
    <div className="AdminPayInfo_div">
      <div className="AdminPayInfo_div">
        <h3 className="AdminPayInfo_title">결제 내역</h3>
        <div className="AdminPayInfo_pay">
          <div>
            총 결제금액:{totalPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원 / 오늘 결제 금액: {todayPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
          </div>
        </div>
        <div className="AdminPayInfo_sub">
          <hr className="AdminPayInfo_hr" />
          <div className="AdminPayInfo_table_name">
            <div className="AdminPayInfo_table_name1">결제번호</div>
            <div className="AdminPayInfo_table_name2">결제일시</div>
            <div className="AdminPayInfo_table_name3">결제유저</div>
            <div className="AdminPayInfo_table_name4">결제금액</div>
            <div className="AdminPayInfo_table_name5">결제내역</div>
            <div className="AdminPayInfo_table_name6">결제취소</div>
          </div>
          <hr className="AdminPayInfo_hr" />
          <div>
            {/* 결제 번호가 있는 칼럼만 맵핑 */}
            {pointDataList
              .filter((item) => item.pointCertify && item.pointCertify.startsWith('imp'))
              .map((item) => (
                <div key={item.pointNo} className="AdminPayInfo_table_sub">
                  <div className="AdminPayInfo_table_name1">{item.pointCertify}</div>
                  <div className="AdminPayInfo_table_name2">{formatDate(item.pointDate)}</div>
                  <div className="AdminPayInfo_table_name3">{item.userEmail}</div>
                  <div className="AdminPayInfo_table_name4">{item.pointPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                  <div className="AdminPayInfo_table_name5">{item.pointComment}</div>
                  <div className="AdminPayInfo_table_name6">
                    <div className="AdminPayInfo_table_btn" onClick={() => onPayCancel(item.pointCertify)}>
                      결제취소
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPayInfo;
