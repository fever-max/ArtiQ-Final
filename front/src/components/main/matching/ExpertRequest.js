import React, { useState, useEffect } from 'react';
import '../../../styles/main/matching/ExpertRequest.css';
import axios from 'axios';

function ExpertRequest() {
  const [user, setUser] = useState({
    userEmail: '',
    userName: '',
    apCareer: '',
    reField: '',
    reGenre: '',
    apMessage: '',
  });

  const [image, setImage] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [emailExistsInDB, setEmailExistsInDB] = useState(false); 

  //유저 이메일
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const checkEmailExists = async () => {
      try {
        const response = await axios.get('http://localhost:4000/user/myPage/userInfo', {
          withCredentials: true,
        });
        setUserEmail(response.data.userEmail);
        console.log("response.data.userEmail:"+response.data.userEmail)
        const emailResponse = await axios.get(`http://localhost:4000/api/checkEmail?userEmail=${response.data.userEmail}`);
        if (emailResponse.data === "EXIST") {
          // DB에 이메일이 이미 존재하는 경우
          setEmailExistsInDB(true);
          alert('감정사 승인 여부는 마이페이지에서 확인 가능합니다.');
          window.location.href = '/myPage';
        } else {
          // DB에 이메일이 존재하지 않는 경우
          setEmailExistsInDB(false);
        }
      } catch (error) {
        console.error('이메일 확인 오류:', error);
      }
    };

    // 페이지 접속시 checkEmailExists 함수 호출
    checkEmailExists();
  }, []);


  //페이지 접속시 유저 이메일 받아옴
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:4000/user/myPage/userInfo', {
          withCredentials: true,
        });
        //console.log('받아온 유저 이메일:' + response.data.userEmail);
        //이메일만 저장
        setUserEmail(response.data.userEmail);
      
      } catch (error) {
        alert('로그인이 필요한 서비스입니다. 로그인해주세요.');
        window.location.href = '/login';
        console.error('유저 정보가 없습니다.', error);
      }
    };

    getUserInfo();
  }, []);

  const changeImage = (evt) => {
    setImage(evt.target.files);
  };

  const changeInput = (evt) => {
    const { value, name } = evt.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();

    // 필수 입력 필드 확인
    if (!user.userName || !user.reField || !user.apMessage || !image) {
      alert('감정사 신청 시 필요한 항목을 모두 채워주세요.');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', image[0]); // 파일 추가
      formData.append('userEmail', userEmail);
      formData.append('reField', user.reField);
      formData.append('apCareer', user.apCareer);
      formData.append('userName', user.userName);
      formData.append('apMassage', user.apMessage);

      user.reGenre.forEach((genre, index) => {
        formData.append(`reGenre${index + 1}`, genre);
      });
      for (let i = user.reGenre.length + 1; i <= 5; i++) {
        formData.append(`reGenre${i}`, '');
      }

      await axios.post('http://localhost:4000/api/uploads', formData, user, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      window.location.href = '/expertReqSuccess';
    } catch (error) {
      console.error('전송 오류:', error);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);

  const categories = {
    한국화: ['민속화', '인물화', '산수화', '꽃도화', '문인화'],
    중국화: ['산수화', '역사화', '꽃도화', '새도화', '선화'],
    일본화: ['풍경화', '인물화', '야수화', '산수화', '선화'],
    서양화: ['추상화', '역사화', '인물화', '풍경화', '현대화'],
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSubCategories(categories[category]);

    setUser({
      ...user,
      reField: category,
    });
  };

  const handleGenreChange = (e) => {
    const selectedGenre = e.target.value;
    const isChecked = e.target.checked;

    setSelectedGenres((prevGenres) => {
      if (isChecked) {
        return [...prevGenres, selectedGenre];
      } else {
        return prevGenres.filter((genre) => genre !== selectedGenre);
      }
    });

    setUser((prevUser) => ({
      ...prevUser,
      reGenre: isChecked ? [...prevUser.reGenre, selectedGenre] : prevUser.reGenre.filter((genre) => genre !== selectedGenre),
    }));
  };

  return (
    <div className="ERDiv">
      <div className="ERDiv_main">
        <div className="ER_title">
          <h2>감정사 신청</h2>
        </div>
        <form onSubmit={onSubmit} name="form" method="post" action="http://localhost:4000/api/uploads" encType="multipart/form-data">
          <div>
            <p>
              <input className="cursor" type="text" id="userName" name="userName" value={user.userName} onChange={changeInput} placeholder="이름" />
            </p>
            <p>
              <input className="cursor" type="text" id="userEmail" name="userEmail" value={userEmail} onChange={changeInput} placeholder="이메일" readOnly />
            </p>
          </div>

          <div>
            <div className="input100">
              <select className="classify" id="reField" name="reField" value={user.reField} onChange={handleCategoryChange}>
                <option disabled hidden value="">
                  분야
                </option>
                {Object.keys(categories).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="input100">
              <div className="genre-checkboxes">
                {subCategories.map((subCategory) => (
                  <label key={subCategory} className="genre-checkbox">
                    <div className="subCategoryPadding1">
                      <input type="checkbox" name="reGenre" value={subCategory} onChange={handleGenreChange} checked={selectedGenres.includes(subCategory)} />
                    </div>
                    <div className="subCategoryPadding2">{subCategory}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className='parent1'>
            <div className="genre-checkboxes-title">경력</div>
            <div className="genre-checkboxes2">
              <label className="genre-checkbox2">
                <input type="checkbox" name="apCareer" value="1년 미만" checked={user.apCareer === '1년 미만'} onChange={changeInput} />
                1년 미만
              </label>
              <label className="genre-checkbox2">
                <input type="checkbox" name="apCareer" value="1년~5년" checked={user.apCareer === '1년~5년'} onChange={changeInput} />
                1년~5년
              </label>
              <label className="genre-checkbox2">
                <input type="checkbox" name="apCareer" value="5~10년" checked={user.apCareer === '5~10년'} onChange={changeInput} />
                5~10년
              </label>
              <label className="genre-checkbox2">
                <input type="checkbox" name="apCareer" value="10년 이상" checked={user.apCareer === '10년 이상'} onChange={changeInput} />
                10년 이상
              </label>
            </div>
          </div>  

          <div>
            <textarea className="careerTextarea cursor" type="text" id="apMessage" name="apMessage" value={user.apMessage} onChange={changeInput} placeholder="신청메세지" />
          </div>
          <div className="previewImage imgInput">
            <input type="file" name="files" onChange={changeImage} />
          </div>
          <div>
            <button className={`commission_btn ${userEmail && user.userName && user.apCareer && user.reField && user.reGenre && user.apMessage && changeImage ? 'active' : ''}`} type="submit" id="submit">전송</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpertRequest;
