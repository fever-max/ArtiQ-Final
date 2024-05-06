import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header/UserInfo.css';
import { IoMdLogIn } from 'react-icons/io';
import { IoMdLogOut } from 'react-icons/io';
import { IoMdPersonAdd } from 'react-icons/io';
import { IoMdCall } from 'react-icons/io';
import { IoMdPerson } from 'react-icons/io';

function UserInfo({ userNickname }) {
  const handleLogout = () => {
    fetch('http://localhost:4000/api/user/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          // 로그아웃 후 홈으로
          window.location.href = '/';
        } else {
          console.error('로그아웃 요청 실패');
        }
      })
      .catch((error) => {
        console.error('로그아웃 요청 중 오류 발생:', error);
      });
  };

  return (
    <div className="user_info">
      <ul>
        {/* JWT 토큰 토글 렌더링 */}
        {userNickname ? (
          <>
            <li>
              <h3>{userNickname}님</h3>
            </li>
            <li>
              <Link to="#" onClick={handleLogout}>
                <IoMdLogOut />
                로그아웃
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <a href="/login">
                <IoMdLogIn />
                로그인
              </a>
            </li>
            <li>
              <a href="/join">
                <IoMdPersonAdd />
                회원가입
              </a>
            </li>
          </>
        )}
        <li>
          <a href={userNickname === 'admin' ? '/admin' : userNickname ? '/myPage' : '/login'}>
            <IoMdPerson />
            {userNickname === 'admin' ? '관리자페이지' : '마이페이지'}
          </a>
        </li>
        <li>
          <a href="/serviceCenter">
            <IoMdCall />
            고객센터
          </a>
        </li>
      </ul>
    </div>
  );
}

export default UserInfo;
