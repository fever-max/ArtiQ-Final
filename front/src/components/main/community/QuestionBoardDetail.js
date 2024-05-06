import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import AnswerList from './AnswerList';
import '../../../styles/main/community/questionDetail.css';

function QuestionBoardDetail() {
  const { questionNumber } = useParams();
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [userNickname, setUserNickname] = useState(null);
  const history = useHistory();
  const [scrollToTop, setScrollToTop] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [boardNumber, setBoardNumber] = useState('');
  const [boardPostUser, setBoardPostUser] = useState('');

  // 맨 위로 스크롤
  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      setScrollToTop(true);
    }
  }, [scrollToTop]);

  // 사용자 닉네임 불러오기
  useEffect(() => {
    const getUserNickname = async () => {
      try {
        const response = await axios.get('http://localhost:4000/freeBoard/getEmail', {
          withCredentials: true,
        });
        setUserNickname(response.data);
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
        setUserNickname(null);
      } finally {
        setLoading(false);
      }
    };
    getUserNickname();
  }, []);

  // 게시글 상세 정보 불러오기
  useEffect(() => {
    fetchBoardDetail();
    questionViewCount();
  }, [questionNumber]);

  const fetchBoardDetail = async () => {
    try {
      // 게시글 상세 정보 요청
      const response = await axios.get(`http://localhost:4000/questionDetail/${questionNumber}`);
      setBoardData(response.data);
      console.log('게시글 상세 정보' + response.data);
      setBoardPostUser(response.data.userEmail);
      if (response.data.answers) {
        setAnswers(response.data.answers);
      }
    } catch (error) {
      console.error('게시글 상세 정보를 불러오는데 실패했습니다:', error);
    }
  };

  // 조회수 메서드
  const questionViewCount = async () => {
    try {
      // 게시글 상세 정보 요청
      await axios.get(`http://localhost:4000/questionDetail/increaseViewCount/${questionNumber}`);
      fetchBoardDetail();
    } catch (error) {
      console.error('조회수 증가 실패:', error);
    }
  };

  // 답글 작성 처리 함수
  const handleQuestionAnswer = async () => {
    if (!userNickname) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const userResponse = await axios.get('http://localhost:4000/freeBoard/getEmail', {
        withCredentials: true,
      });
      const userNickname = userResponse.data.userNickname;
      const userEmail = userResponse.data.userEmail;
      setUserEmail(userEmail);

      // 새로운 답글 객체 생성
      const newAnswerObject = {
        questionNumber: questionNumber,
        userEmail: userEmail,
        userNickname: userNickname,
        answerContent: newAnswer,
        answerDate: new Date().toISOString().slice(0, 10),
      };

      // 서버에 새로운 답글 추가
      await axios.post('http://localhost:4000/answer', newAnswerObject);

      // 답글 목록 다시 불러오기
      const getAnswersResponse = await axios.get(`http://localhost:4000/answers/question/${questionNumber}`);
      const updatedAnswers = [...getAnswersResponse.data]; // 새로운 답글 목록을 복사해서 업데이트
      setAnswers(updatedAnswers); // 업데이트된 답글 목록으로 설정

      // 게시글 상세 정보 다시 불러오기
      const boardResponse = await axios.get(`http://localhost:4000/questionDetail/${questionNumber}`);
      setBoardData(boardResponse.data);

      // 답글 입력값 초기화
      setNewAnswer('');
    } catch (error) {
      console.error('답글 작성에 실패했습니다:', error);
    }
  };

  // 답글 목록 불러오기
  useEffect(() => {
    const getAnswers = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/answers/question/${questionNumber}`);
        // 각 답글의 채택 상태를 서버에서 가져온 값으로 설정하고, 값이 없는 경우에는 기본값 false로 설정
        const answersWithAcceptance = response.data.map((answer) => ({
          ...answer,
          isAccepted: answer.isAccepted || false,
        }));
        setAnswers(answersWithAcceptance);
      } catch (error) {
        console.error('답글을 불러오는데 실패했습니다:', error);
      }
    };
    getAnswers();
  }, [questionNumber]);

  // 답글 내용 변경 처리 함수
  const handleAnswerChange = (event) => {
    setNewAnswer(event.target.value);
  };

  // 목록으로
  const handleClick = () => {
    history.push('/questionBoard');
  };

  // 삭제
  const questionDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:4000/questionDetail/${questionNumber}`);
        alert('게시글이 삭제되었습니다.');
        history.push('/questionBoard');
      } catch (error) {
        console.error('게시글 삭제에 실패했습니다:', error);
      }
    }
  };

  // 로그인한 사용자가 게시글 작성자인지 확인하는 함수
  const isAuthor = () => {
    return userNickname && boardData && boardData.userEmail === userNickname.userEmail;
  };

  // 댓글 채택 처리 함수
  const handleAccept = async (answerNumber) => {
    try {
      // 서버에 채택 처리 요청
      const response = await axios.put(`http://localhost:4000/answers/${answerNumber}/accept`);

      // 채택이 성공적으로 처리되었을 때 채택 상태 업데이트
      if (response.status === 200) {
        // 채택 상태를 true로 설정
        setAnswers((prevAnswers) => prevAnswers.map((answer) => (answer.answerNumber === answerNumber ? { ...answer, isAccepted: true } : answer)));
      }
    } catch (error) {
      console.error('댓글 채택 처리에 실패했습니다:', error);
    }
  };

  return (
    <div className="question_detail_div">
      <div className="question_detail_main">
        {boardData ? (
          <>
            <div className="question_detail_heder">질문 게시판</div>
            <div className="question_detail_heder_line"></div>
            <div className="question_detail_list_all">
              <div className="question_detail_list_header">
                <h3 className="question_detail_title">{boardData.questionTitle}</h3>
                <div className="question_detail_title_bottom">
                  <div className="question_detail_fl">
                    <span> {boardData.userNickname}</span> /<span> {boardData.questionDate}</span>
                  </div>
                  <div className="question_detail_fr">
                    <span> 조회 {boardData.questionViewCount}</span>
                    <span> 댓글 {answers.length}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="board_main_size">{boardData.questionContent}</div>
              </div>

              <div className="question_detail_comment_count">
                전체 댓글 <em className="font_red">{answers.length}</em>개
              </div>
            </div>
          </>
        ) : (
          <div>로딩 중...</div>
        )}
      </div>
      <div className="comment_write_all">
        <AnswerList data={answers} questionNumber={questionNumber} onAccept={handleAccept} boardPostUser={boardPostUser} />
        <textarea value={newAnswer} onChange={handleAnswerChange} className="question_comment_write"></textarea>
        <div className="question_detail_btn_line">
          {isAuthor() && (
            <button onClick={questionDelete} className="question_comment_delete_btn">
              삭제
            </button>
          )}
          <button onClick={handleQuestionAnswer} className="question_comment_create_btn">
            댓글 작성
          </button>
          <button onClick={handleClick} className="question_cancel">
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionBoardDetail;
