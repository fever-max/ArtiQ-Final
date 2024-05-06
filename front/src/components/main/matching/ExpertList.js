import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../../../styles/main/matching/ExpertList.css';
import { LuChevronLeft,LuChevronRight } from "react-icons/lu";

function ExpertList() {
  const [expertData, setExpertData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/data/expertData');
      setExpertData(response.data);
    } catch (error) {
      console.error('데이터 불러오기 에러:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 4, // 넘길 때 한 번에 이동할 슬라이드 개수
  };

  return (
    <div className="ERDiv">
      <div className="ERDiv_main">
        <div className="ER_title">
          <h2>감정사 현황</h2>
        </div>
        <br />
        <div className="parent">
          <div className="first">
            <LuChevronLeft />  
          </div>
          <div className="second">
          <Slider {...settings}>
            {expertData.map((expert, index) => (
              <div className="list" key={index}>
                <a href={`/commission?name=${expert.userName}&email=${expert.userEmail}&reField=${expert.reField}&reGenre1=${expert.reGenre1}${expert.reGenre2 ? `&reGenre2=${expert.reGenre2}` : ''}${expert.reGenre3 ? `&reGenre3=${expert.reGenre3}` : ''}${expert.reGenre4 ? `&reGenre4=${expert.reGenre4}` : ''}${expert.reGenre5 ? `&reGenre5=${expert.reGenre5}` : ''}`}>
                  <div className="image centered-image">
                    <img src={expert.imageURL} alt={expert.userName} />
                  </div>
                </a>
                <div className="content">
                  <br />
                  <p className="pname">{expert.userName}</p>
                  <p className="pfield1">{expert.reField} / {expert.apCareer}</p>
                  <p className="pfield2">{expert.reGenre1} {expert.reGenre2} {expert.reGenre3} {expert.reGenre4} {expert.reGenre5}</p>
                  <p className="pcarrer">{expert.apMessage}</p>
                </div>
              </div>
            ))}
          </Slider>
          </div>
          <div className="third">
            <LuChevronRight />  
          </div>
        </div>
        <br/><br/>
      </div>
    </div>
  );
}

export default ExpertList;
