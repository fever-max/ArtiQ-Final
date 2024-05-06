import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../styles/main/home/home.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { IoIosTimer } from 'react-icons/io';
import { MdArrowRightAlt } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';

function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [auctionData, setAuctionData] = useState({ artData: [], artData2: [] });
  const [expertData, setExpertData] = useState([]);
  const [boardData, setBoardData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 5;
  const [liveArtData, setLiveArtData] = useState({ liveAuctionData: [], liveAuctionInfo: [] });
  const [data, setData] = useState([]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['img/banner-1.jpg', 'img/banner-2.jpg', 'img/banner-3.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 이미지가 3초마다 넘어가도록 설정
    return () => clearInterval(interval); // 컴포넌트가 unmount될 때 interval을 정리
  }, [currentImageIndex]); // currentImageIndex가 변경될 때마다 useEffect를 호출하여 setInterval 재설정

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  //매일 6시 30분으로 설정
  const currentDate = new Date();
  const targetDate = new Date(currentDate);
  targetDate.setHours(18);
  targetDate.setMinutes(30);
  targetDate.setSeconds(0);

  if (currentDate.getHours() >= 18 && currentDate.getMinutes() >= 30) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  // useState 훅을 사용하여 상태를 업데이트합니다.
  const [endDate] = useState(targetDate);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchAuctionData();
    fetchExpertData();
    fetchBoardData();
    fetchLiveData();
    fetchApiData();
  }, []);

  const fetchApiData = async () => {
    try {
      const key = process.env.REACT_APP_API_KEY;
      const response = await axios.get(`http://openapi.seoul.go.kr:8088/${key}/json/SemaPsgudInfoKorInfo/1/500`);
      if (response.data.SemaPsgudInfoKorInfo.row !== null) {
        await axios.post('http://localhost:4000/insertData', response.data.SemaPsgudInfoKorInfo.row);
        //console.log('나실행중');
      } else {
        console.log('데이터가 존재하지 않습니다.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchAuctionData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/basicAuction');
      setAuctionData(response.data);
      //console.log('일반 경매 데이터', response.data); // 로그 추가
    } catch (error) {
      console.error('전문가 데이터 불러오기 에러', error);
    }
  };

  const fetchExpertData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/data/expertData');
      setExpertData(response.data);
      //console.log('expertData: ' + response.expertData);
    } catch (error) {
      console.error('전문가 데이터 불러오기 에러:', error);
    }
  };

  const fetchBoardData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/freeBoard');
      setBoardData(response.data);
      //console.log('board 데이터' + response.data);
    } catch (error) {
      console.error('게시판 데이터 불러오기 에러:', error);
    }
  };

  const fetchLiveData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/liveAuction/getData');
      setLiveArtData(response.data);
      //console.log('라이브데이터' + response.data.liveAuctionInfo);
      //console.log('라이브데이터' + liveArtData);
    } catch (error) {
      setLiveArtData('');
      console.error('데이터를 불러오는데 실패했습니다:', error);
    }
  };

  const handleNext = () => {
    const newStartIndex = Math.min(startIndex + itemsPerPage, auctionData.artData.length - itemsPerPage);
    setStartIndex(newStartIndex);
  };

  const handlePrevious = () => {
    const newStartIndex = Math.max(startIndex - itemsPerPage, 0);
    setStartIndex(newStartIndex);
  };

  const currentPageData = auctionData.artData.slice(startIndex, startIndex + itemsPerPage);

  const startDate = new Date(endDate.getTime() - 33 * 60 * 60 * 1000);

  // Date 객체를 포맷팅하여 문자열로 반환하는 함수
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  // 남은 시간 계산 함수
  function calculateRemainingTime() {
    const now = new Date();
    const remainingTime = endDate - now;

    const hours = Math.floor(remainingTime / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTime(calculateRemainingTime());
    }, 1000);

    return () => clearTimeout(timer);
  }, [time]);

  return (
    <div className="home_div">
      <div className="home_div_main">
        <div className="home_div_main_txt">
          <div className="nav_dot"></div>
          <div className="home_div_main_txt1">Invitation to consign</div>
          <div className="home_div_main_txt2">당신의 소중한 명화, ArtiQ가 그 가치를 높여드립니다.</div>
          <div className="home_div_main_btn">
            <a href="/guide">
              상세보기 <MdArrowRightAlt />
            </a>
          </div>
        </div>
        <div className="home_div_main_img">
          <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex + 1}`} className="home_div_main_img2" />
        </div>
      </div>

      <div className="home_dots">
        {images.map((_, index) => (
          <div key={index} className={index === currentImageIndex ? 'home_dot active' : 'home_dot'} onClick={() => goToSlide(index)} />
        ))}
      </div>

      {/* 실시간 경매 */}
      <div>
        <div className="home_liveAuction_title">
          <div className="home_title_btn">Now</div>
          <div>Live Auction</div>
        </div>
        {liveArtData.liveAuctionData ? (
          <div className="home_liveAuction_div">
            <div className="home_liveAuction_txt">
              <div className="home_liveAuction_txt_title">{liveArtData.liveAuctionData.prdct_nm_korean}</div>
              <div className="home_liveAuction_txt_time">
                {formattedStartDate} ~ {formattedEndDate}
              </div>
              <div className="home_liveAuction_txt_time2">
                <IoIosTimer />
                {time.hours.toString().padStart(2, '0')}:{time.minutes.toString().padStart(2, '0')}:{time.seconds.toString().padStart(2, '0')}
              </div>
              <div className="home_liveAuction_txt_btn">
                <a href="/liveAuction">
                  경매 참여
                  <MdArrowRightAlt />
                </a>
              </div>
            </div>
            <div className="home_liveAuction_imgContent">
              <img src={liveArtData.liveAuctionData.main_image} alt="auction item" className="home_liveAuction_img" />
            </div>
          </div>
        ) : null}
      </div>

      {/* 일반 경매 */}
      <div className="home_basicAuction_div">
        <div className="home_title">
          <div className="home_title_sub">
            <div className="nav_dot"></div>Basic Auction
          </div>
          <div>
            <a href="/basicAuction" className="home_community_link" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              전체보기 {isHovered ? <MdKeyboardDoubleArrowRight className="arrow-icon" /> : <MdKeyboardArrowRight className="arrow-icon" />}
            </a>
          </div>
        </div>
        <div className="home_basicAuction_content">
          <button className="home_basicAuction_btn" onClick={handlePrevious} disabled={startIndex === 0}>
            <FaAngleLeft size={25} />
          </button>
          {currentPageData.map((art, index) => (
            <div className="home_basicAuction_content_sub" key={index}>
              <a href={`/basicAuctionDetail/${art.artId}`}>
                <div className="image-container">
                  <img src={art.main_image} alt={art.prdct_nm_korean} className="home_basicAuction_img" />
                  <div className="overlay">
                    <div>
                      <div className="data_year">{art.manage_no_year}作</div>
                      <div className="data_technique">{art.matrl_technic}</div>
                      <div className="data_stndrd">{art.prdct_stndrd}</div>
                    </div>
                  </div>
                </div>
              </a>
              <div className="home_basicAuction_title">
                {art.prdct_nm_korean} / {art.prdct_cl_nm}
              </div>
              <div className="home_basicAuction_writer">{art.writr_nm}</div>
            </div>
          ))}
          <button className="home_basicAuction_btn" onClick={handleNext} disabled={startIndex + itemsPerPage >= auctionData.artData.length}>
            <FaAngleRight size={25} />
          </button>
        </div>
      </div>

      {/* 전문가 리스트 */}
      <div className="home_expertList_div">
        <div className="home_title">
          <div className="home_title_sub">
            <div className="nav_dot"></div>Matching List
          </div>
          <div>
            <a href="/expertList" className="home_community_link" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              전체보기 {isHovered ? <MdKeyboardDoubleArrowRight className="arrow-icon" /> : <MdKeyboardArrowRight className="arrow-icon" />}
            </a>
          </div>
        </div>
        <div className="home_expertList_content">
          {expertData.slice(0, 2).map((expert, index) => (
            <div className="home_expertList_content_sub" key={index}>
              <div className="home_expertList_content_img">
                <a href={`/commission?name=${expert.userName}&email=${expert.userEmail}`}>
                  <img src={expert.imageURL} alt={expert.userName} />
                </a>
              </div>
              <div className="home_expertList_content_txt">
                <div className="home_expertList_content_name">
                  <div className="home_expertList_content_name_dot">online</div>
                  {expert.userName}
                </div>
                <div className="home_expertList_content_field">
                  {expert.reField} / {expert.reGenre1} {expert.reGenre2} {expert.reGenre3} {expert.reGenre4} {expert.reGenre5}
                </div>
                <p className="home_expertList_content_career">경력: {expert.apCareer}</p>
                <p className="home_expertList_content_msg">{expert.apMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 커뮤니티 */}
      <div className="home_community_div">
        <div className="home_title">
          <div className="home_title_sub">
            <div className="nav_dot"></div>Community
          </div>
          <div>
            <a href="/freeBoard" className="home_community_link" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              전체보기 {isHovered ? <MdKeyboardDoubleArrowRight className="arrow-icon" /> : <MdKeyboardArrowRight className="arrow-icon" />}
            </a>
          </div>
        </div>
        <div className="home_community_content">
          <hr className="home_hr" />
          <div className="home_community_content_title">
            <div className="home_community_content_title1">카테고리</div>
            <div className="home_community_content_title2">제목</div>
            <div className="home_community_content_title3">닉네임</div>
            <div className="home_community_content_title4">작성일</div>
            <div className="home_community_content_title5">조회수</div>
            <div className="home_community_content_title6">추천수</div>
          </div>
          <hr className="home_hr" />
          {boardData.slice(0, 5).map((board, index) => (
            <div className="home_community_content_sub" key={index}>
              <a href={`/freeBoardDetail/${board.boardNumber}`} className="home_community_content_sub2">
                <div className="home_community_content_title1">{board.boardCategory}</div>
                <div className="home_community_content_title2">{board.boardTitle}</div>
                <div className="home_community_content_title3">{board.userNickname}</div>
                <div className="home_community_content_title4">{board.boardDate}</div>
                <div className="home_community_content_title5">{board.boardViewCount}</div>
                <div className="home_community_content_title6">{board.boardUpCount}</div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
