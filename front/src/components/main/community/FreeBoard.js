import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import '../../../styles/main/community/freeboard.css';
import FreeBoardList from './FreeBoardList';

function FreeBoard() {
  const [userNickname, setUserNickname] = useState(null); // 현재 사용자의 닉네임
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태
  const [data, setData] = useState([]); // 백엔드에서 가져온 데이터
  const history = useHistory(); // 브라우저 히스토리
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 15; // 페이지당 아이템 수
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터
  const [scrollToTop, setScrollToTop] = useState(false); // 맨 위로 스크롤 여부
  const [redirectPath, setRedirectPath] = useState(null); // 리디렉션 경로
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [searchOption, setSearchOption] = useState('all'); // 검색 옵션

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

  // 백엔드에서 자유게시판 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/freeBoard');
        const sortedData = response.data.sort((a, b) => b.boardNumber - a.boardNumber);
        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchData();
  }, []);

  // 글쓰기 버튼 클릭 처리
  const handleWriteButtonClick = async () => {
    if (!userNickname) {
      alert('로그인이 필요합니다.');
      setRedirectPath('/freeBoardWrite');
      history.push('/login');
    } else {
      await setScrollToTop(true);
      history.push('/freeBoardWrite');
    }
  };

  // 검색어 입력 핸들러
  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // 검색 옵션 변경 핸들러
  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  // 검색 버튼 클릭 처리
  const handleSearchButtonClick = () => {
    if (!data) return;

    const filtered = data.filter((item) => {
      switch (searchOption) {
        case 'title':
          return item.boardTitle.toLowerCase().includes(searchTerm.toLowerCase());
        case 'content':
          return item.boardContent.toLowerCase().includes(searchTerm.toLowerCase());
        case 'nickname':
          return item.userNickname && item.userNickname.toLowerCase().includes(searchTerm.toLowerCase());
        case 'comment':
          return item.comments && item.comments.some((comment) => comment.content.toLowerCase().includes(searchTerm.toLowerCase()));
        default:
          return item.boardTitle.toLowerCase().includes(searchTerm.toLowerCase()) || item.boardContent.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    setFilteredData(filtered);
    setCurrentPage(0);
    setScrollToTop(true);
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
    <div className="freeboard_div">
      {/* 게시판 헤더 */}
      <div className="freeboard_main">
        <div className="freeboard_heder">자유 게시판</div>
        <div className="freeboard_heder_line"></div>

        {/* 게시판 목록 */}
        <div className="freeboard_list_all">
          <div className="free_col">
            <div className="free_num_col">번호</div>
            <div className="free_category_col">카테고리</div>
            <div className="free_title_col">제목</div>
            <div className="free_nickname_col">닉네임</div>
            <div className="free_create_col">작성일</div>
            <div className="free_hit_count_col">조회</div>
            <div className="free_like_col">추천</div>
          </div>

          <FreeBoardList data={currentPageData} currentUserEmail={userNickname} />
        </div>
      </div>

      {/* 글쓰기 버튼 */}
      <div className="freeboard_btn_line">
        <div className="freeboard_writer_btn">
          <button onClick={handleWriteButtonClick} className="writer_btn">
            글쓰기
          </button>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="paging_line">
        <ReactPaginate previousLabel={'이전'} nextLabel={'다음'} breakLabel={'...'} pageCount={Math.ceil(data.length / postsPerPage)} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handlePageClick} containerClassName={'pagination'} activeClassName={'active'} forcePage={currentPage} />
      </div>

      {/* 검색 기능 */}
      <div className="search-container">
        <select className="dropdown" value={searchOption} onChange={handleSearchOptionChange}>
          <option value="all">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="nickname">닉네임</option>
        </select>
        <input type="text" className="search-input" value={searchTerm} onChange={handleSearchInputChange} placeholder="검색어를 입력하세요" />
        <button className="search-button" onClick={handleSearchButtonClick}>
          검색
        </button>
      </div>
    </div>
  );
}

export default FreeBoard;
