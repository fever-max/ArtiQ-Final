// React, useState, useEffect, useHistory를 임포트합니다.
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
// HTTP 요청에 axios를 사용합니다.
import axios from 'axios';
// CSS 파일을 임포트합니다.
import '../../../styles/main/community/questionBoard.css';
// 질문 목록을 렌더링하는 컴포넌트를 임포트합니다.
import QuestionBoardList from './QuestionBoardList';
import ReactPaginate from 'react-paginate';

function QuestionBoard() {
  const [userNickname, setUserNickname] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const history = useHistory();
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 15; // 페이지당 아이템 수
  const [filteredData, setFilteredData] = useState([]);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

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

  // 백엔드에서 질문게시판 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/questionBoard');
        const sortedData = response.data.sort((a, b) => b.questionNumber - a.questionNumber);
        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchData();
  }, []);

  // 글쓰기 버튼 클릭 처리
  const questionWriteButtonClick = async () => {
    if (!userNickname) {
      alert('로그인이 필요합니다.');
      setRedirectPath('/questionWrite');
      history.push('/login');
    } else {
      await setScrollToTop(true);
      history.push('/questionWrite');
    }
  };

  // 페이지 클릭 처리
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
    setScrollToTop(true);
  };

  // 현재 페이지 데이터 계산
  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPageData = data.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="question_div">
      <div className="question_main">
        <div className="question_heder">질문 게시판</div>
        <div className="question_heder_line"></div>

        {/* 게시판 목록 */}
        <div className="question_list_all">
          <div className="question_col">
            <div className="question_num_col">번호</div>
            <div className="question_category_col">카테고리</div>
            <div className="question_title_col">제목</div>
            <div className="question_nickname_col">닉네임</div>
            <div className="question_create_col">작성일</div>
            <div className="question_hit_count_col">조회</div>
          </div>
          <QuestionBoardList data={currentPageData} currentUserEmail={userNickname} />
        </div>
      </div>

      {/* 글쓰기 버튼 */}
      <div className="question_btn_line">
        <div className="question_writer_btn">
          <button onClick={questionWriteButtonClick} className="writer_btn">
            글쓰기
          </button>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="paging_line">
        <ReactPaginate previousLabel={'이전'} nextLabel={'다음'} breakLabel={'...'} pageCount={Math.ceil(data.length / postsPerPage)} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handlePageClick} containerClassName={'pagination'} activeClassName={'active'} forcePage={currentPage} />
      </div>
    </div>
  );
}

export default QuestionBoard;
