import React, { useEffect, useState } from 'react';
import '../../../../styles/main/userInfo/myPage/MyPoint.css';
import axios from 'axios';
import Modal from 'react-modal';
import { IoMdCloseCircleOutline } from 'react-icons/io';

function MyPoint() {
  //유저 포인트 결제 정보
  const [pointDataList, setPointDataList] = useState([]);

  //유저 포인트 정보
  const [userRank, setUserRank] = useState({
    rankLevel: '',
    rankPoint: '',
  });

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    //페이지 키자마자 시작
    getUserMyPage();
  }, []);

  //유저 정보 함수
  const getUserMyPage = async () => {
    try {
      const response = await axios.get('http://localhost:4000/user/myPage/userInfo', {
        withCredentials: true,
      });
      //console.log(response.data);
      setUserName(response.data.userName);
      setUserEmail(response.data.userEmail);
      //정보 받아오면 멤버쉽 정보, 결제정보도 받아옴
      fetchUserRank(response.data.userEmail);
      fetchUserPoint(response.data.userEmail);
    } catch (error) {
      console.error('유저 정보가 없습니다.', error);
    }
  };

  //포인트 결제 테이블 불러오기
  const fetchUserPoint = async (userEmail) => {
    try {
      const response = await axios.post('http://localhost:4000/user/myPage/point/info', {
        userEmail: userEmail,
      });

      // 받은 데이터 처리
      console.log(response.data);
      setPointDataList(response.data);
    } catch (error) {
      console.error('포인트 결제 테이블 정보가 없습니다.', error);
    }
  };

  //멤버쉽 정보 불러오기
  const fetchUserRank = async (userEmail) => {
    try {
      const response = await axios.post('http://localhost:4000/user/myPage/rank', {
        userEmail: userEmail,
      });

      // 받은 데이터 처리
      //console.log(response.data);
      setUserRank({ ...userRank, rankLevel: response.data.rankLevel, rankPoint: response.data.rankPoint });
    } catch (error) {
      console.error('유저의 멤버쉽 정보가 없습니다.', error);
    }
  };

  //포인트 충전 dto
  const [point, setPoint] = useState('');
  const [money, setMoney] = useState('');
  const [selectedBox, setSelectedBox] = useState(null);

  const selectPoint = (point, money) => {
    setPoint(point);
    setMoney(money);
    setSelectedBox(point); // 선택된 상자의 포인트 값을 상태로 설정
  };

  //포인트 충전 MODAL
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
      height: '350px',
      padding: '0',
      overflow: 'hidden',
    },
  };

  // overlayClick 함수 정의
  const onClickClose = () => {
    setIsOpen(false); // 모달 닫기
    setPoint(''); // 포인트 초기화
    setMoney(''); // 돈 초기화
    setSelectedBox(null); // 선택된 상자 초기화
  };

  const [isOpen, setIsOpen] = useState(false);

  // 검색 클릭
  const onPoint = () => {
    setIsOpen(!isOpen); // isOpen 상태를 토글하여 모달 열고 닫기
  };

  //결제모듈
  const IMP = window.IMP;
  IMP.init('imp72611382'); /* imp~ : 가맹점 식별코드*/

  //일반결제
  const payKg = () => {
    console.log('일반 결제 시작');

    if (money === '') {
      alert('충전 포인트를 선택해주세요. ');
      return;
    }

    // IMP 객체를 사용하여 결제를 요청
    IMP.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: new Date().getTime(), //임의 번호 부여
        name: 'ArtiQ 포인트 충전 / ' + point + 'p',
        amount: 100, //100원으로 고정 진행
        buyer_email: userEmail,
        buyer_name: userName,
      },
      function (rsp) {
        // 결제 성공 시
        if (rsp.success) {
          console.log('결제 성공, 백앤드 검증 시작');
          console.log('rsp.imp_uid' + rsp.imp_uid);
          const merchant_uid = rsp.imp_uid;
          const imp_uid = rsp.imp_uid;

          //백엔드 검증
          pointCheck(imp_uid, merchant_uid);

          //DB 저장
          pointSubmit(rsp.imp_uid);

          alert('포인트 충전 성공');
          getUserMyPage(); //유저정보 로드
          setIsOpen(!isOpen); //모달창 닫음
        } else {
          // 결제 실패 시
          var msg = '결제에 실패하였습니다.';
          msg += '에러내용 : ' + rsp.error_msg;
          alert(msg);
        }
      }
    );
  };

  //카카오페이 결제
  const payKakao = () => {
    console.log('카카오 결제 시작');

    if (money === '') {
      alert('충전 포인트를 선택해주세요. ');
      return;
    }

    // IMP 객체를 사용하여 결제를 요청
    IMP.request_pay(
      {
        pg: 'kakaopay',
        pay_method: 'card',
        merchant_uid: new Date().getTime(), //임의 번호 부여
        name: 'ArtiQ 포인트 충전 / ' + point + 'p',
        amount: 100, //100원으로 고정 진행
        buyer_email: userEmail,
        buyer_name: userName,
      },
      function (rsp) {
        // 결제 성공 시
        if (rsp.success) {
          console.log('결제 성공, 백앤드 검증 시작');
          console.log('rsp.imp_uid' + rsp.imp_uid);
          const merchant_uid = rsp.imp_uid;
          const imp_uid = rsp.imp_uid;

          //백엔드 검증
          pointCheck(imp_uid, merchant_uid);

          //결제 성공 메세지, 모달 창 닫기
          alert('포인트 충전 성공');
          getUserMyPage(); //유저정보 다시 받아옴
          setIsOpen(!isOpen);
        } else {
          // 결제 실패 시
          var msg = '결제에 실패하였습니다.';
          msg += '에러내용 : ' + rsp.error_msg;
          alert(msg);
        }
      }
    );
  };

  //백엔드 검증 함수
  const pointCheck = async (imp_uid, merchant_uid) => {
    try {
      console.log('백엔드 검증 실행');
      const response = await axios.post('http://localhost:4000/verify/' + imp_uid);

      console.log('결제 검증 완료', response.data);
      //db에 저장
      pointSubmit(merchant_uid);
    } catch (error) {
      console.error('결제 검증 실패', error);
    }
  };

  //결제 정보 전달
  const pointSubmit = async (merchant_uid) => {
    try {
      console.log('넘어가는 결제 번호:' + merchant_uid);
      const response = await axios.post('http://localhost:4000/user/myPage/point/pay', {
        pointCertify: merchant_uid.toString(),
        userEmail: userEmail,
        pointCharge: point,
        pointPay: money,
      });

      // 받은 데이터
      console.log(response.data);
    } catch (error) {
      console.error('결제 테이블 저장 실패', error);
    }
  };

  //날짜 정규화
  function normalizeDate(dateString) {
    const date = new Date(dateString); // 문자열을 Date 객체로 파싱
    const year = String(date.getFullYear()).slice(2); // 년도의 마지막 두 자리
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월
    const day = String(date.getDate()).padStart(2, '0'); // 일
    const hours = String(date.getHours()).padStart(2, '0'); // 시
    const minutes = String(date.getMinutes()).padStart(2, '0'); // 분
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`; // YYMMDD/HH:MM 형식으로 변환
    return formattedDate;
  }

  return (
    <div className="MyPoint_div">
      <div className="MyPoint_div">
        <h3 className="MyPoint_title">포인트 충전</h3>
        <div className="MyPoint_sub">
          <div className="MyPoint_sub_point">
            <div className="MyPoint_sub1">
              <div className="MyPoint_sub_point_title">사용 가능 포인트</div>
              <div className="MyPoint_sub_point_point">{userRank.rankPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}P</div>
            </div>
            <div className="MyPoint_sub2">
              <div className="MyPoint_sub_point_title">소멸 예정 포인트</div>
              <div className="MyPoint_sub_point_point">0P</div>
            </div>
          </div>
          {/* 포인트충전모달 */}
          <Modal isOpen={isOpen} ariaHideApp={false} style={customStyles}>
            <div className="MyPoint_modal">
              <div className="MyPoint_modal_close">
                <div className="MyPoint_modal_close_btn" onClick={onClickClose}>
                  <IoMdCloseCircleOutline size="25" />
                </div>
              </div>
              <div className="MyPoint_modal_title">충전 포인트 선택</div>
              <hr className="MyPoint_hr" />
              <div className="MyPoint_modal_money">
                <div>선택금액: </div>
                <div> {money || '0'}원</div>
              </div>

              <div className="MyPoint_modal_content">
                <div className={`MyPoint_modal_content_box ${selectedBox === 10000 ? 'selected' : ''}`} id="box1" onClick={() => selectPoint(10000, 1000)}>
                  <div className="MyPoint_modal_content_title">10,000P</div>
                  <div className="MyPoint_modal_content_money">1,000원</div>
                </div>
                <div className={`MyPoint_modal_content_box ${selectedBox === 50000 ? 'selected' : ''}`} id="box2" onClick={() => selectPoint(50000, 5000)}>
                  <div className="MyPoint_modal_content_title">50,000P</div>
                  <div className="MyPoint_modal_content_money">5,000원</div>
                </div>
                <div className={`MyPoint_modal_content_box ${selectedBox === 100000 ? 'selected' : ''}`} id="box3" onClick={() => selectPoint(100000, 10000)}>
                  <div className="MyPoint_modal_content_title">100,000P</div>
                  <div className="MyPoint_modal_content_money">10,000원</div>
                </div>
              </div>
              <hr className="MyPoint_hr" />
              <div className="MyPoint_modal_pay">
                <div className="MyPoint_modal_pay_btn" onClick={payKg}>
                  일반결제
                </div>
                <div className="MyPoint_modal_pay_btn2" onClick={payKakao}>
                  카카오페이
                </div>
              </div>
            </div>
          </Modal>

          <div className="MyPoint_sub3">
            <div className="MyPoint_sub3_btn" onClick={onPoint}>
              포인트 충전
            </div>
          </div>
        </div>
        <div className="MyPoint_info">포인트 유효기간은 적립일로부터 최대 1년까지이며, 유형에 따라 달라질 수 있습니다.</div>
        <hr className="MyPoint_hr" />
        {/* 적립내역표 */}
        <div className="MyPoint_table">
          <div className="MyPoint_table_name">
            <div className="MyPoint_table_name1">적립/사용</div>
            <div className="MyPoint_table_name2">적용일시</div>
            <div className="MyPoint_table_name3">포인트</div>
            <div className="MyPoint_table_name4">상세내역</div>
          </div>
          <div className="MyPoint_table_content">
            {/* 역순 출력 (최신순부터) */}
            {pointDataList
              .slice()
              .reverse()
              .map((pointData, index) => (
                <div key={index} className="MyPoint_table_name_sub">
                  <p className="MyPoint_table_name1_sub">{pointData.pointRole}</p>
                  <p className="MyPoint_table_name2_sub">{normalizeDate(pointData.pointDate)}</p>
                  <p className="MyPoint_table_name3_sub">
                    {pointData.pointRole === '충전' || pointData.pointRole === '반환' ? '+' : '-'}  
                    {pointData.pointCharge.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </p>
                  <p className="MyPoint_table_name4_sub">{pointData.pointComment}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPoint;
