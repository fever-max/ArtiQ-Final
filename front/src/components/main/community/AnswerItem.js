import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../../styles/main/community/commentitem.css';

const AnswerItem = ({ item, onAccept, questionNumber, boardPostUser }) => {
  const { userNickname, answerContent, answerDate, answerNumber } = item;
  const [userEmail, setUserEmail] = useState(null);
  const [answers, setAnswers] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false); // 댓글 채택 여부 상태
  const history = useHistory();

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const response = await axios.get('http://localhost:4000/freeBoard/getEmail', {
          withCredentials: true,
        });
        setUserEmail(response.data.userEmail);
      } catch (error) {
        console.error('유저 정보를 불러오는데 실패했습니다:', error);
      }
    };
    getUserEmail();
  }, []);

  // 채택
  useEffect(() => {
    fetchAnswerAcceptedStatus();
  }, [answerNumber]);

  // 댓글의 채택 여부를 서버에서 확인하고 상태 업데이트
  const fetchAnswerAcceptedStatus = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/answers/isAccepted/${answerNumber}`);
      console.log('isAccepted:' + response.data);
      setIsAccepted(response.data);
    } catch (error) {
      console.error('답글 채택 여부를 불러오는데 실패했습니다:', error);
    }
  };

  // 채택 버튼 클릭
  const handleAccept = async (userNickname) => {
    try {
      // 이미 채택된 댓글인지 확인
      if (isAccepted) {
        console.log('이미 채택된 답글입니다.');
        return;
      }

      if (window.confirm(`${userNickname}님의 댓글을 채택하시겠습니까?`)) {
        await axios.put(`http://localhost:4000/answers/${answerNumber}/accept`);
        window.location.href = `http://localhost:3000/questionDetail/${questionNumber}`;
        //setIsAccepted(true);
        //onAccept(commentNumber); // 채택 완료 시 부모 컴포넌트의 채택 완료 처리 함수 호출
        console.log('채택완료');
      }
    } catch (error) {
      console.error('채택 처리에 실패했습니다:', error);
    }
  };

  // 댓글 삭제
  const handleDeleteAnswer = async () => {
    if (!answerNumber) {
      console.error('답글 번호가 없습니다.');
      return;
    }

    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:4000/answers/${answerNumber}`);
        console.log(questionNumber + '보드넘버');
        console.log('댓글번호' + answerNumber);

        alert('답글이 삭제되었습니다.');
        history.go(0); // 페이지 새로고침
      } catch (error) {
        console.error('답글 삭제에 실패했습니다:', error);
      }
    }
  };

  const currentRoute = window.location.pathname.includes('/questionDetail') ? '/questionDetail' : '';

  return (
    <div className="free_comment_list_line">
      <div className="free_comment_nickname_line">{userNickname}</div>
      <div className="free_comment_content_line">
        <div className="free_comment_content">
          <div className="free_comment_txt">{answerContent}</div>
          {userEmail === item.userEmail && (
            <button onClick={handleDeleteAnswer} className="free_comment_delete">
              삭제
            </button>
          )}
        </div>
        {boardPostUser === userEmail && (
          <>
            {currentRoute === '/questionDetail' && userEmail === boardPostUser && !isAccepted && !item.isAccepted && (
              <button onClick={() => handleAccept(userNickname)} className="comment_no_btn">
                채택필요
              </button>
            )}
            {isAccepted && <button className="comment_ok_btn">채택완료</button>}
          </>
        )}
      </div>
      <div className="free_comment_fr">{answerDate}</div>
    </div>
  );
};

export default AnswerItem;
