import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/main/community/freeboarddetail.css';
import CommentList from './CommentList';

function FreeBoardDetail() {
  const { boardNumber } = useParams(); // URL에서 게시글 번호 가져오기
  const [boardData, setBoardData] = useState(null); // 게시글 데이터
  const [comments, setComments] = useState([]); // 댓글 목록
  const [newComment, setNewComment] = useState(''); // 새로운 댓글
  const [userNickname, setUserNickname] = useState(null); // 사용자 닉네임
  const [userEmail, setUserEmail] = useState(null); //사용자 이메일
  const history = useHistory(); // 브라우저 히스토리
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [voted, setVoted] = useState({
    // 추천/비추천 상태
    upvoted: false,
    downvoted: false,
  });
  const [upvoteCount, setUpvoteCount] = useState(0); // 추천 수
  const [downvoteCount, setDownvoteCount] = useState(0); // 비추천 수
  const [redirectPath, setRedirectPath] = useState(null); // 리디렉션 경로
  const [scrollToTop, setScrollToTop] = useState(false);

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
    boardViewCount();
  }, [boardNumber]);

  const fetchBoardDetail = async () => {
    try {
      // 게시글 상세 정보 요청
      const response = await axios.get(`http://localhost:4000/freeBoardDetail/${boardNumber}`);
      setBoardData(response.data);
      if (response.data.comments) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('게시글 상세 정보를 불러오는데 실패했습니다:', error);
    }
  };

  // 조회수 메서드
  const boardViewCount = async () => {
    try {
      // 게시글 상세 정보 요청
      await axios.get(`http://localhost:4000/freeBoardDetail/increaseViewCount/${boardNumber}`);
      fetchBoardDetail();
    } catch (error) {
      console.error('조회수 증가 실패:', error);
    }
  };

  // 댓글 작성 처리 함수
  const handleSubmitComment = async () => {
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

      // 새로운 댓글 객체 생성
      const newCommentObject = {
        boardNumber: boardNumber,
        commentNumber: comments.length + 1,
        userEmail: userEmail,
        userNickname: userNickname,
        commentContent: newComment,
        commentDate: new Date().toISOString().slice(0, 10),
      };

      // 서버에 새로운 댓글 추가
      await axios.post('http://localhost:4000/comments', newCommentObject);

      // 댓글 목록 다시 불러오기
      const getCommentsResponse = await axios.get(`http://localhost:4000/comments/board/${boardNumber}`);
      const updatedComments = [...getCommentsResponse.data]; // 새로운 댓글 목록을 복사해서 업데이트
      setComments(updatedComments); // 업데이트된 댓글 목록으로 설정

      // 게시글 상세 정보 다시 불러오기
      const boardResponse = await axios.get(`http://localhost:4000/freeBoardDetail/${boardNumber}`);
      setBoardData(boardResponse.data);

      // 댓글 입력값 초기화
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성에 실패했습니다:', error);
    }
  };

  // 댓글 목록 불러오기
  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/comments/board/${boardNumber}`);
        setComments(response.data);
      } catch (error) {
        console.error('댓글을 불러오는데 실패했습니다:', error);
      }
    };
    getComments();
  }, [boardNumber]);

  // 댓글 내용 변경 처리 함수
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  // 추천
  const handleUpCount = async () => {
    if (!userNickname) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      console.log('넘기는 이메일: ' + userEmail);
      const response = await axios.post('http://localhost:4000/freeBoardDetail/upCount', {
        boardNumber: boardNumber,
        userEmail: userEmail,
      });

      if (response.status === 200) {
        console.log('추천 성공');
        fetchBoardDetail();
      }
    } catch (error) {
      console.error('추천 실패', error);
    }
  };

  // 비추천
  const handleDownCount = async () => {
    if (!userNickname) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      console.log('넘기는 이메일: ' + userEmail);
      const response = await axios.post('http://localhost:4000/freeBoardDetail/downCount', {
        boardNumber: boardNumber,
        userEmail: userEmail,
      });

      if (response.status === 200) {
        console.log('비추천 성공');
        fetchBoardDetail();
      }
    } catch (error) {
      console.error('비추천 실패', error);
    }
  };

  // 목록으로
  const handleClick = () => {
    history.push('/freeBoard');
  };

  // 삭제
  const freeBoardDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:4000/freeBoardDetail/${boardNumber}`);
        alert('게시글이 삭제되었습니다.');
        history.push('/freeBoard');
      } catch (error) {
        console.error('게시글 삭제에 실패했습니다:', error);
      }
    }
  };

  // 로그인한 사용자가 게시글 작성자인지 확인하는 함수
  const isAuthor = () => {
    return userNickname && boardData && boardData.userEmail === userNickname.userEmail;
  };

  return (
    <div className="free_detail_div">
      <div className="free_detail_main">
        {boardData ? (
          <>
            <div className="free_detail_heder">자유 게시판</div>
            <div className="free_detail_heder_line"></div>
            <div className="free_detail_list_all">
              <div className="free_detail_list_header">
                <h3 className="free_detail_title">{boardData.boardTitle}</h3>
                <div className="free_detail_title_bottom">
                  <div className="free_detail_fl">
                    <span> {boardData.boardNickname}</span>
                    <span> {boardData.boardDate}</span>
                  </div>
                  <div className="free_detail_fr">
                    <span> 조회 {boardData.boardViewCount}</span>
                    <span> 추천 {boardData.boardUpCount}</span>
                    <span> 댓글 {comments.length}</span>
                  </div>
                </div>
              </div>
              <div>
                <p>{boardData.boardContent}</p>
              </div>
              <div className="free_detail_vote_line">
                <div className="free_detail_vote_button_all">
                  <div className="free_detail_upvote" onClick={handleUpCount}>
                    <div className="up_vote_text">
                      <span>추천</span>
                    </div>
                    <div className="up_vote_count">
                      <span>{boardData.boardUpCount}</span>
                    </div>
                  </div>

                  <div className="free_detail_downvote" onClick={handleDownCount}>
                    <div className="down_vote_text">
                      <span>비추천</span>
                    </div>
                    <div className="down_vote_count">
                      <span>{boardData.boardDownCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="free_detail_comment_count">
                전체 댓글 <em className="font_red">{comments.length}</em>개
              </div>
            </div>
          </>
        ) : (
          <div>로딩 중...</div>
        )}
      </div>
      <div className="comment_write_all">
        <CommentList data={comments} boardNumber={boardNumber} />
        <textarea value={newComment} onChange={handleCommentChange} className="free_comment_write"></textarea>
        <div className="free_detail_btn_line">
          {isAuthor() && (
            <button onClick={freeBoardDelete} className="free_comment_delete_btn">
              삭제
            </button>
          )}
          <button onClick={handleSubmitComment} className="free_comment_create_btn">
            댓글 작성
          </button>
          <button onClick={handleClick} className="free_cancel">
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default FreeBoardDetail;
