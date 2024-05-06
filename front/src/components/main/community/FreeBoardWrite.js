import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import "../../../styles/main/community/freeboardwrite.css";

function FreeBoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [boardUpCount, setBoardUpCount] = useState(0);
  const [boardDownCount, setBoardDownCount] = useState(0);
  const [boardViewCount, setBoardViewCount] = useState(0);
  const [boardComment, setBoardComment] = useState(0);
  const [boardNumber, setBoardNumber] = useState(1);
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
        "http://localhost:4000/freeBoard/write",
        {
          boardNumber: boardNumber,
          boardCategory: "자유게시판",
          boardTitle: title,
          boardContent: content,
          boardDate: new Date().toISOString(),
          userNickname: userInfo.userNickname,
          userEmail: userInfo.userEmail,
          boardUpCount: boardUpCount,
          boardDownCount: boardDownCount,
          boardViewCount: boardViewCount,
          boardComment: boardComment,
        },
        {
          withCredentials: true,
        }
      );
      alert("게시글이 성공적으로 등록되었습니다.");

      history.push("/freeBoard");
    } catch (error) {
      console.error("게시글 등록에 실패했습니다:", error);
      alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 자유게시판 으로
  const freeCancelClick = () => {
    history.push("/freeBoard");
  };

  return (
    <div className="free_write_div">
      <div>
        <div className="free_write_heder_line">
          <div className="free_write_heder">자유 게시판</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="free_write_title_line">
            <div>
              <input id="title" type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력해주세요." className="free_write_title" />
            </div>
            <div className="free_write_info">※음란물, 차별, 비하, 혐오 및 초상권, 저작권 침해 게시물은 민, 형사상의 책임을 질 수 있습니다.</div>
          </div>
          <div className="free_write_content_line">
            <textarea id="content" value={content} onChange={handleContentChange} className="free_write_content" placeholder="내용을 입력해주세요."></textarea>
          </div>
          <div className="free_write_btn_line">
            <button type="submit" className="free_write_btn">
              등록
            </button>
            <button onClick={freeCancelClick} className="free_write_btn">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FreeBoardWrite;
