import React from 'react';
import '../../styles/footer/footer.css';
import { FaFacebook } from 'react-icons/fa';
import { FaInstagramSquare } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

function FooterInfo() {
  return (
    <div className="footer_info">
      <div className="footer_info_main">
        <div>
          <ul className="footer_info_main">
            <li>
              <a href="/about">서비스 소개</a>
            </li>
            <li>위치안내</li>
            <li>
              <a href="/serviceCenter">자주묻는질문</a>
            </li>
          </ul>
        </div>
        <div className="sns_icon">
          <i>
            <FaFacebook color="#39c3bc" />
          </i>
          <i>
            <FaInstagramSquare color="#39c3bc" />
          </i>
          <i>
            <FaXTwitter color="#39c3bc" />
          </i>
        </div>
      </div>
      <div className="footer_info_sub">
        <ul className="footer_info_sub2">
          <li>(주) 아이티윌 자바 148기 1조</li>
          <li>서울특별시 강남구 테헤란로 124 4층</li>
        </ul>
      </div>
    </div>
  );
}

export default FooterInfo;
