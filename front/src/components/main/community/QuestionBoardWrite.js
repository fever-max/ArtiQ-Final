import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "../../../styles/main/community/questionBoardWrite.css";

function QuestionBoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [questionViewCount, setQuestionViewCount] = useState(0);
  const [boardComment, setBoardComment] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const history = useHistory();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:4000/freeBoard/getEmail", { withCredentials: true });
      setUserInfo(response.data);
    } catch (error) {
      console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
    }
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length > 30) {
      setTitle(inputValue.slice(0, 30));
      alert("제목은 최대 30자까지 입력 가능합니다.");
    } else {
      setTitle(inputValue);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:4000/question/write",
        {
          questionNumber: questionNumber,
          questionCategory: "질문게시판",
          questionTitle: title,
          questionContent: content,
          questionDate: new Date().toISOString(),
          userNickname: userInfo.userNickname,
          userEmail: userInfo.userEmail,
          questionViewCount: questionViewCount,
          boardComment: boardComment,
        },
        {
          withCredentials: true,
        }
      );
      alert("게시글이 성공적으로 등록되었습니다.");

      history.push("/questionBoard");
    } catch (error) {
      console.error("게시글 등록에 실패했습니다:", error);
      alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 질문게시판 으로
  const questionCancelClick = () => {
    history.push("/questionBoard");
  };

  return (
    <div className="question_write_div">
      <div>
        <div className="question_write_heder_line">
          <div className="question_write_heder">질문 게시판</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="question_write_title_line">
            <div>
              <input id="title" type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력해주세요." className="question_write_title" />
            </div>
            <div className="question_write_info">※음란물, 차별, 비하, 혐오 및 초상권, 저작권 침해 게시물은 민, 형사상의 책임을 질 수 있습니다.</div>
          </div>
          <div className="question_write_content_line">
            <textarea id="content" value={content} onChange={handleContentChange} className="question_write_content" placeholder="내용을 입력해주세요."></textarea>
          </div>
          <div className="question_write_btn_line">
            <button type="submit" className="question_write_btn">
              등록
            </button>
            <button onClick={questionCancelClick} className="question_write_btn">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionBoardWrite;
