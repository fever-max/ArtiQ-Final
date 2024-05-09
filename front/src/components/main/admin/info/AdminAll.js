import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../styles/main/admin/info/AdminAll.css';

function AdminAll({ jwt }) {
  const [users, setUsers] = useState([]);
  const today = new Date().toISOString().slice(0, 10); // 현재 날짜를 YYYY-MM-DD 형식으로 가져옴
  const [todayJoinUsers, setTodayJoinUsers] = useState(0);

  const [expertData, setExpertData] = useState([]);
  const [pointDataList, setPointDataList] = useState([]);
  const [totalPayment, setTotalPayment] = useState(0);
  const [todayPayment, setTodayPayment] = useState(0);
  const [todayPayCount, setTodayPayCount] = useState(0);

  const [totalBoard, setTotalBoard] = useState(0);
  const [todayBoard, setTodayBoard] = useState(0);
  const [todayComment, setTodayComment] = useState(0);

  let freeCount = 0;
  let questionCount = 0;

  useEffect(() => {
    fetchUserData();
    fetchExpertData();
    fetchPoint();
  }, []);

  useEffect(() => {
    Promise.all([fetchFreeBoardData(), fetchQuestionData()]).then(() => {
      setTodayBoard(freeCount + questionCount);
    });
  }, []);

  const fetchUserData = async () => {
    try {
      const userInfoResponse = await axios.get('http://localhost:4000/admin/userInfo', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUsers(userInfoResponse.data);
      setTodayJoinUsers(userInfoResponse.data.filter((user) => user.userDate && user.userDate.startsWith(today)).length);
    } catch (error) {
      console.error('유저 정보를 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const fetchExpertData = async () => {
    try {
      const userInfoResponse = await axios.get('http://localhost:4000/admin/expertData', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setExpertData(userInfoResponse.data);
    } catch (error) {
      console.error('유저 정보를 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const fetchPoint = async () => {
    try {
      const response = await axios.get('http://localhost:4000/admin/userPointTable', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setPointDataList(response.data);
    } catch (error) {
      console.error('포인트 결제 테이블 정보가 없습니다.', error);
    }
  };

  useEffect(() => {
    const total = pointDataList.reduce((acc, item) => {
      if (item.pointPay && !isNaN(parseFloat(item.pointPay))) {
        return acc + parseFloat(item.pointPay);
      }
      return acc;
    }, 0);
    setTotalPayment(total);

    const today = pointDataList
      .filter((item) => {
        const date = new Date(item.pointDate);
        const todayDate = new Date();
        if (item.pointCertify) {
          setTodayPayCount((prevCount) => prevCount + 1);
        }
        return date.getDate() === todayDate.getDate() && date.getMonth() === todayDate.getMonth() && date.getFullYear() === todayDate.getFullYear();
      })
      .reduce((acc, item) => {
        if (item.pointPay && !isNaN(parseFloat(item.pointPay))) {
          return acc + parseFloat(item.pointPay);
        }
        return acc;
      }, 0);
    setTodayPayment(today);
  }, [pointDataList]);

  const fetchFreeBoardData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/freeBoard');
      setTotalBoard((prevTotalBoard) => prevTotalBoard + response.data.length);
      const todayBoards = response.data.filter((board) => board.boardDate && board.boardDate.startsWith(today));
      freeCount = todayBoards.length;
      console.log('자유게시판 오늘글' + todayBoards.length);

      console.log(response.data);

      // // 오늘 게시글의 댓글 수 합산
      // let totalCommentCount = 0;
      // response.data.forEach((board) => {
      //   totalCommentCount += board.board_comment_count || 0; // 객체에서 댓글 수를 추출하여 합산
      // });
      // setTodayComment((prevTodayComment) => prevTodayComment + totalCommentCount);

      return todayBoards.length; // 개수를 반환
    } catch (error) {
      console.error('자유게시판 불러오기 에러:' + error);
    }
  };

  const fetchQuestionData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/questionBoard');
      setTotalBoard((prevTotalBoard) => prevTotalBoard + response.data.length);
      const todayBoards = response.data.filter((board) => board.questionDate && board.questionDate.startsWith(today));
      console.log('질문게시판 오늘글' + todayBoards.length);
      questionCount = todayBoards.length;
      return todayBoards.length; // 개수를 반환
    } catch (error) {
      console.error('질문 게시판을 불러오는데 실패했습니다:', error);
    }
  };

  return (
    <div className="AdminAll_div">
      <div className="AdminAll_div">
        <h3 className="AdminAll_title">ArtiQ 대시보드</h3>
        <hr className="AdminAll_hr" />
        <div className="AdminAll_title_sub">회원 현황</div>
        <div className="AdminAll_sub">
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">전체회원</div>
            <div>{users.length}명</div>
          </div>
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">Today 가입 회원</div>
            <div>{todayJoinUsers}명</div>
          </div>
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">감정사 신청 회원</div>
            <div>{expertData.length}명</div>
          </div>
        </div>
        <div className="AdminAll_title_sub">결제 현황</div>
        <div className="AdminAll_sub">
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">누적 결제 금액</div>
            <div>{totalPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</div>
          </div>
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">Today 결제 건수</div>
            <div>{todayPayCount}건</div>
          </div>
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">Today 결제 금액</div>
            <div>{todayPayment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</div>
          </div>
        </div>
        <div className="AdminAll_title_sub">커뮤니티 현황</div>
        <div className="AdminAll_sub">
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">누적 게시글</div>
            <div>{totalBoard}건</div>
          </div>
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">Today 글</div>
            <div>{todayBoard}건</div>
          </div>
          <div className="AdminAll_sub_content">
            <div className="AdminAll_title_sub2">Today 댓글</div>
            <div>2건</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAll;
