import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import NoticeBoardList from './NoticeBoardList';
import '../../../styles/main/community/noticeboard.css';
import { useHistory } from 'react-router-dom';

function NoticeBoard() {
  const [userNickname, setUserNickname] = useState(null); // 현재 사용자의 닉네임
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [data, setData] = useState([]); // 게시글 데이터
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const itemsPerPage = 10; // 페이지 당 아이템 수
  const [filteredData, setFilteredData] = useState([]); // 필터된 데이터
  const [scrollToTop, setScrollToTop] = useState(false); // 페이지 맨 위로 스크롤
  const [redirectPath, setRedirectPath] = useState(null); // 리디렉션 경로
  const history = useHistory(); // 브라우저 히스토리

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'auto' }); // 페이지 맨 위로 스크롤
      setScrollToTop(false);
    }
  }, [scrollToTop]);

  // 사용자 닉네임 불러오기
  useEffect(() => {
    const getUserNickname = async () => {
      try {
        const response = await axios.get('http://localhost:4000/noticeBoard/getEmail', {
          withCredentials: true,
        });
        const { userNickname } = response.data;
        setUserNickname(userNickname);
        console.log('접속한 닉네임: ' + userNickname);
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
        setUserNickname(null);
      } finally {
        setLoading(false);
      }
    };
    getUserNickname();
  }, []);

  // 백엔드에서 게시글 정보를 불러오는 함수
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/noticeBoard');
        const sortedData = response.data.sort((a, b) => b.noticeNumber - a.noticeNumber); // 게시글을 번호 순으로 정렬
        setData(sortedData); // 데이터 설정
        setFilteredData(sortedData); // 필터된 데이터 설정
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchData();
  }, []);

  // 페이지가 바뀔 때 처리하는 함수
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected); // 현재 페이지 설정
    setScrollToTop(true);
  };

  // 현재 페이지의 데이터 범위 계산
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // 글쓰기 버튼 클릭 처리
  const noticeWriteButtonClick = async () => {
    if (!userNickname) {
      alert('로그인이 필요합니다.');
      setRedirectPath('/noticeBoardWrite');
      history.push('/login');
    } else {
      await setScrollToTop(true);
      history.push('/noticeBoardWrite');
    }
  };

  // 질문게시판 으로
  const handleQuestionClick = () => {
    history.push('/QuestionBoard');
  };

  // 질문게시판 으로
  const handleFAQClick = () => {
    history.push('/serviceCenter');
  };

  return (
    <div className="noticeboard_div">
      <div className="noticeboard_main">
        <div className="noticeboard_heder">공지사항</div>
        <div className="noticeboard_heder_line"></div>
        <div>
          <ul className="notice_ul">
            <li className="notice_li">
              <span className="notice_title">Tel. 0000-0000</span>
              <span className="notice_title2">평일 9:00~18:00</span>
            </li>
            <li className="notice_li2" onClick={handleQuestionClick}>
              <div>
                <span className="notice_title">질문 게시판</span>
                <span className="notice_title2">질문 전 FAQ(고객센터)을 먼저 확인해 주세요.</span>
              </div>
            </li>
            <li className="notice_li2" onClick={handleFAQClick}>
              <div>
                <span className="notice_title">고객센터</span>
                <span className="notice_title2">자주 묻는 질문</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="noticeboard_list_all">
          <div className="notice_col">
            <div className="noticeboard_num_col">번호</div>
            <div className="noticeboard_title_col">제목</div>
            <div className="noticeboard_create_col">작성일</div>
          </div>
          <NoticeBoardList data={currentPageData} /> {/* 게시글 목록 컴포넌트 */}
        </div>
      </div>

      {userNickname === 'admin' && (
        <div className="noticeboard_btn_line">
          <div className="noticeboard_writer_btn">
            <button onClick={noticeWriteButtonClick} className="notice_write">
              글쓰기
            </button>
          </div>
        </div>
      )}

      <div className="notice_paging_line">
        <ReactPaginate previousLabel={'이전'} nextLabel={'다음'} breakLabel={'...'} pageCount={Math.ceil(filteredData.length / itemsPerPage)} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handlePageClick} containerClassName={'pagination'} activeClassName={'active'} forcePage={currentPage} />
      </div>
    </div>
  );
}

export default NoticeBoard;
