// NoticeBoardDetail.js
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/main/community/noticeDetail.css';

function NoticeBoardDetail() {
  const { noticeNumber } = useParams();
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [userNickname, setUserNickname] = useState(null);
  const history = useHistory();

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
    noticeViewCount();
  }, [noticeNumber]);

  const fetchBoardDetail = async () => {
    try {
      // 게시글 상세 정보 요청
      const response = await axios.get(`http://localhost:4000/noticeBoardDetail/${noticeNumber}`);
      setBoardData(response.data);
    } catch (error) {
      console.error('게시글 상세 정보를 불러오는데 실패했습니다:', error);
    }
  };

  // 조회수 메서드
  const noticeViewCount = async () => {
    try {
      // 게시글 상세 정보 요청
      await axios.get(`http://localhost:4000/noticeDetail/increaseViewCount/${noticeNumber}`);
      fetchBoardDetail();
    } catch (error) {
      console.error('조회수 증가 실패:', error);
    }
  };

  // 목록으로
  const handleNoticeClick = () => {
    history.push('/noticeBoard');
  };

  // 삭제
  const noticeDelete = async () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:4000/noticeDetail/${noticeNumber}`);
        alert('게시글이 삭제되었습니다.');
        history.push('/noticeBoard');
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
    <div className="notice_detail_div">
      <div className="notice_detail_main">
        {loading ? (
          <div>로딩 중...</div>
        ) : boardData ? (
          <>
            <div className="notice_detail_heder_line">
              <div className="notice_detail_heder">공지사항</div>
            </div>
            <div className="notice_detail_list_all">
              <div className="notice_detail_list_header">
                <h3 className="notice_detail_title">{boardData.noticeTitle}</h3>
                <div className="notice_detail_title_bottom">
                  <div className="notice_detail_fl">
                    <span> {boardData.noticeDate}</span>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ whiteSpace: 'pre-wrap' }}>{boardData.noticeContent.replace(/<br>/g, '\n')}</p>
              </div>
            </div>
          </>
        ) : (
          <div>해당 공지사항을 찾을 수 없습니다.</div>
        )}
      </div>
      <div className="notice_detail_btn_line">
        {isAuthor() && (
          <button onClick={noticeDelete} className="notice_detail_delete">
            삭제
          </button>
        )}
        <button onClick={handleNoticeClick} className="notice_detail_back">
          목록으로
        </button>
      </div>
    </div>
  );
}

export default NoticeBoardDetail;
