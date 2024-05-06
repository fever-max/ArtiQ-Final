import React, { useEffect, useState } from 'react';
import '../../../styles/main/community/commentitem.css';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CommentItem = ({ item, boardNumber, postUserEmail, loggedInUserEmail }) => {
  const { userNickname, commentContent, commentDate, commentNumber } = item;
  const [userEmail, setUserEmail] = useState(null);
  const [comments, setComments] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const response = await axios.get('http://localhost:4000/freeBoard/getEmail', {
          withCredentials: true,
        });
        setUserEmail(response.data.userEmail);
      } catch (error) {
        console.error('유저 정보를 불러오는데 실패했습니다:', error);
      }
    };
    getUserEmail();
  }, []);

  // 댓글 삭제
  const handleDeleteComment = async () => {
    if (!commentNumber) {
      console.error('댓글 번호가 없습니다.');
      return;
    }

    if (window.confirm('정말로 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:4000/comments/${commentNumber}`);
        console.log(boardNumber + '보드넘버');
        console.log('댓글번호' + commentNumber);

        alert('댓글이 삭제되었습니다.');
        history.go(0); // 페이지 새로고침
      } catch (error) {
        console.error('댓글 삭제에 실패했습니다:', error);
      }
    }
  };

  return (
    <div className="free_comment_list_line">
      <div className="free_comment_nickname_line">{userNickname}</div>

      <div className="free_comment_content_line">
        <p className="free_comment_content">
          <div className="free_comment_txt"> {commentContent}</div>
          {userEmail === item.userEmail && (
            <button onClick={handleDeleteComment} className="free_comment_delete">
              삭제
            </button>
          )}
        </p>
      </div>
      <div className="free_comment_fr">{commentDate}</div>
    </div>
  );
};

export default CommentItem;
