import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import '../../styles/header/header.css';
import UserInfo from './UserInfo';
import axios from 'axios';

function Header() {
  const [userNickname, setUserNickname] = useState(null);

  useEffect(() => {
    const getUserNickname = async () => {
      try {
        const response = await axios.get('http://localhost:4000/user/nickname', {
          withCredentials: true,
        });
        setUserNickname(response.data);
      } catch (error) {
        console.error('로그인한 유저 정보가 없습니다.', error);
        setUserNickname(null);
      }
    };
    // 유저 닉네임 요청 보내기
    getUserNickname();
  }, []);

  return (
    <div className="pix">
      <div className="header">
        <UserInfo userNickname={userNickname} />
        <Nav userNickname={userNickname} />
      </div>
    </div>
  );
}

export default Header;
