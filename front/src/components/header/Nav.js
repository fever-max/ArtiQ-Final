import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header/nav.css';

function Nav({ userNickname }) {
  return (
    <div className="nav_box">
      <div className="nav_logo">
        <a href="/">
          <img src="https://ifh.cc/g/8fm9AR.jpg" alt="로고" border="0" />
        </a>
      </div>
      <div className="nav">
        <nav className="navMain">
          <ul>
            <li className="nav_li">
              <Link to="#" className="title">
                About
              </Link>
              <ul className="nav_ul">
                <li>
                  <a href="/about">ArtiQ</a>
                </li>
                <li>
                  <a href="/guide">이용가이드</a>
                </li>
              </ul>
            </li>
            <li className="nav_li">
              <Link to="#" className="title">
                Auction
              </Link>
              <ul className="nav_ul">
                <li>
                  <a href={userNickname ? '/liveAuction' : '/login'}>
                    라이브경매 <div className="nav_dot"></div>
                  </a>
                </li>
                <li>
                  <a href="/basicAuction">일반경매</a>
                </li>
              </ul>
            </li>
            <li className="nav_li">
              <Link to="#" className="title">
                Matching
              </Link>
              <ul className="nav_ul">
                <li>
                  <a href={userNickname ? '/commission' : '/login'}>명화 감정 신청</a>
                </li>
                <li>
                  <a href={userNickname ? '/expertRequest' : '/login'}>감정사 신청</a>
                </li>
                <li>
                  <a href="/expertList">
                    감정사 현황 <div className="nav_dot"></div>
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav_li">
              <Link to="#" className="title">
                Community
              </Link>
              <ul className="nav_ul">
                <li>
                  <a href="/noticeBoard">
                    공지사항 <div className="nav_dot"></div>
                  </a>
                </li>
                <li>
                  <a href="/freeBoard">자유게시판</a>
                </li>
                <li>
                  <a href="/questionBoard">질문게시판</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Nav;
