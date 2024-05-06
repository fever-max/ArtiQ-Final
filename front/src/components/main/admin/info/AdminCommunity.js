import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../../styles/main/admin/info/AdminCommunity.css';
import { Link } from 'react-router-dom';

function AdminCommunity() {
  const [boardFreeData, setBoardFreeData] = useState([]);
  const [boardQuestionData, setBoardQuestionData] = useState([]);
  const [visibleContent, setVisibleContent] = useState({});
  const [visibleContent2, setVisibleContent2] = useState({});

  useEffect(() => {
    fetchFreeBoardData();
    fetchQuestionData();
  }, []);

  const fetchFreeBoardData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/freeBoard');
      setBoardFreeData(response.data);
      //console.log('board 데이터' + response.data);
    } catch (error) {
      console.error('자유게시판 불러오기 에러:' + error);
    }
  };

  const fetchQuestionData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/questionBoard');
      setBoardQuestionData(response.data);
    } catch (error) {
      console.error('질문 게시판을 불러오는데 실패했습니다:', error);
    }
  };

  //게시글 삭제
  const questionDelete = async (questionNumber) => {
    if (window.confirm('질문게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:4000/questionDetail/${questionNumber}`);
        alert('질문게시글이 삭제되었습니다.');
        fetchQuestionData();
      } catch (error) {
        console.error('게시글 삭제에 실패했습니다:', error);
      }
    }
  };
  const freeBoardDelete = async (boardNumber) => {
    if (window.confirm('자유게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:4000/freeBoardDetail/${boardNumber}`);
        alert('자유게시글이 삭제되었습니다.');
        fetchFreeBoardData();
      } catch (error) {
        console.error('게시글 삭제에 실패했습니다:', error);
      }
    }
  };

  const toggleContentVisibility = (index) => {
    setVisibleContent((prevVisibleContent) => ({
      ...prevVisibleContent,
      [index]: !prevVisibleContent[index],
    }));
  };

  const toggleContentVisibility2 = (index) => {
    setVisibleContent2((prevVisibleContent) => ({
      ...prevVisibleContent,
      [index]: !prevVisibleContent[index],
    }));
  };

  return (
    <div className="AdminCommunity_div">
      <div className="AdminCommunity_div">
        <h3 className="AdminCommunity_title">커뮤니티 내역</h3>
        <p className="MyCommunity_title_sub">*제목 클릭시 해당 게시물로 이동합니다.</p>
        <div className="MyCommunity_Table">
          <hr className="MyCommunity_hr" />
          <div className="MyCommunity_table_column">
            <div className="AdminCommunity_table_column1">카테고리</div>
            <div className="AdminCommunity_table_column2">제목</div>
            <div className="AdminCommunity_table_column3">작성일</div>
            <div className="AdminCommunity_table_column4">작성자</div>
            <div className="AdminCommunity_table_column5">삭제</div>
          </div>
          <hr className="MyCommunity_hr" />
          {boardFreeData.length === 0 ? (
            <div className="MyPageSub_noDataMessage">작성된 자유게시글이 없습니다.</div>
          ) : (
            boardFreeData.map((board, index) => (
              <>
                <div className="MyCommunity_table_column_sub" key={index} onClick={() => toggleContentVisibility(index)}>
                  <div className="AdminCommunity_table_column1">{board.boardCategory}</div>
                  <div className="AdminCommunity_table_column2">
                    <Link to={`/freeBoardDetail/${board.boardNumber}`} className="MyCommunity_table_column_txt">
                      {board.boardTitle}
                    </Link>
                  </div>
                  <div className="AdminCommunity_table_column3">{board.boardDate}</div>
                  <div className="AdminCommunity_table_column4">{board.userNickname}</div>

                  <div className="AdminCommunity_table_column5">
                    <div className="MyCommunity_table_btn" onClick={() => freeBoardDelete(board.boardNumber)}>
                      삭제
                    </div>
                  </div>
                </div>
                {visibleContent[index] && (
                  <div className="AdminCommunity_content">
                    <div className="AdminCommunity_content1">{board.userNickname}유저의 작성글입니다.</div>
                    <div>{board.boardContent}</div>
                  </div>
                )}
              </>
            ))
          )}
          {boardQuestionData.length === 0 ? (
            <div className="MyPageSub_noDataMessage">작성한 질문게시글이 없습니다.</div>
          ) : (
            boardQuestionData.map((board, index) => (
              <>
                <div className="MyCommunity_table_column_sub" key={index} onClick={() => toggleContentVisibility2(index)}>
                  <div className="MyCommunity_table_column1">{board.questionCategory}</div>
                  <div className="MyCommunity_table_column2">
                    <Link to={`/questionDetail/${board.questionNumber}`} className="MyCommunity_table_column_txt">
                      {board.questionTitle}
                    </Link>
                  </div>
                  <div className="MyCommunity_table_column3">{board.questionDate}</div>
                  <div className="MyCommunity_table_column4">{board.userNickname}</div>
                  <div className="MyCommunity_table_column5">
                    <div className="MyCommunity_table_btn" onClick={() => questionDelete(board.questionNumber)}>
                      삭제
                    </div>
                  </div>
                </div>
                {visibleContent2[index] && (
                  <div className="AdminCommunity_content">
                    <div className="AdminCommunity_content1">{board.userNickname}유저의 작성글입니다.</div>
                    <div>{board.questionContent}</div>
                  </div>
                )}
              </>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCommunity;
