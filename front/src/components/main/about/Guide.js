import React, { useState, useEffect } from 'react';
import '../../../styles/main/about/Guide.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function Guide() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ['img/001.jpg', 'img/002.jpg', 'img/003.jpg', 'img/004.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // 이미지가 3초마다 넘어가도록 설정
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

  return (
    <div className="Guide_div">
      <button className="prev" onClick={prevSlide}>
        <FaAngleLeft size={30} />
      </button>
      <div className="Guide_img">
        <img src={images[currentImageIndex]} alt={`Slide ${currentImageIndex + 1}`} />
      </div>
      <button className="next" onClick={nextSlide}>
        <FaAngleRight size={30} />
      </button>
      <div className="dots">
        {images.map((_, index) => (
          <div key={index} className={index === currentImageIndex ? 'dot active' : 'dot'} onClick={() => goToSlide(index)} />
        ))}
      </div>
    </div>
  );
}

export default Guide;
