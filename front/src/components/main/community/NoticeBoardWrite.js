import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../../../styles/main/community/noticeWrite.css';

function NoticeBoardWrite() {
  const [userInfo, setUserInfo] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noticeViewCount, setNoticeViewCount] = useState(0);
  const [noticeNumber, setNoticeNumber] = useState(1);
  const history = useHistory();
  const [scrollToTop, setScrollToTop] = useState(false);

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'auto' }); // 페이지 맨 위로 스크롤
      setScrollToTop(false);
    }
  }, [scrollToTop]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('http://localhost:4000/freeBoard/getEmail', { withCredentials: true });
      setUserInfo(response.data);
    } catch (error) {
      console.error('사용자 정보를 가져오는 데 실패했습니다:', error);
    }
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    setTitle(inputValue);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    console.log('넘기는 내용: ' + content);
    try {
      await axios.post(
        'http://localhost:4000/noticeBoard/write',
        {
          noticeNumber: noticeNumber,
          noticeTitle: title,
          noticeContent: content,
          noticeDate: new Date().toISOString(),
          noticeViewCount: noticeViewCount,
        },
        {
          withCredentials: true,
        }
      );
      alert('게시글이 성공적으로 등록되었습니다.');

      history.push('/noticeBoard');
    } catch (error) {
      console.error('게시글 등록에 실패했습니다:', error);
      alert('게시글 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 공지사항 으로
  const noticeCancelClick = () => {
    history.push('/noticeBoard');
  };

  return (
    <div className="notice_write_div">
      <div>
        <div className="noticeboard_write_heder_line">
          <div className="noticeboard_write_heder">공지사항</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="notice_write_title_line">
            <div>
              <input id="title" type="text" value={title} onChange={handleTitleChange} placeholder="제목을 입력해주세요." className="notice_write_title" />
            </div>
            <div className="notice_write_info">※음란물, 차별, 비하, 혐오 및 초상권, 저작권 침해 게시물은 민, 형사상의 책임을 질 수 있습니다.</div>
          </div>
          <div className="notice_write_content_line">
            <textarea id="content" value={content} onChange={handleContentChange} className="notice_write_content" placeholder="내용을 입력해주세요." wrap="hard"></textarea>
          </div>
          <div className="notice_write_btn_line">
            <button type="submit" className="notice_write_btn">
              등록
            </button>
            <button onClick={noticeCancelClick} className="notice_write_btn">
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoticeBoardWrite;
