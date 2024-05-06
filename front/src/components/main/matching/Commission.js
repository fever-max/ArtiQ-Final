import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../../styles/main/matching/Commission.css';
import axios from 'axios';

function Commission() {
  const history = useHistory();

  const [emailExistsInDB, setEmailExistsInDB] = useState(false); //

  useEffect(() => {
    //
    const checkEmailExists = async () => {
      try {
        const response = await axios.get('http://localhost:4000/user/myPage/userInfo', {
          withCredentials: true,
        });
        setUserEmail(response.data.userEmail);
        console.log('response.data.userEmail:' + response.data.userEmail);
        const emailResponse = await axios.get(`http://localhost:4000/commissionList/checkEmail?userEmail=${response.data.userEmail}`);
        if (emailResponse.data === 'EXIST') {
          // DB에 이메일이 이미 존재하는 경우
          setEmailExistsInDB(true);
          console.log(emailExistsInDB);
          alert('의뢰 승인 여부는 마이페이지에서 확인 가능합니다.');
          window.location.href = '/myPage';
        } else {
          // DB에 이메일이 존재하지 않는 경우
          setEmailExistsInDB(false);
        }
      } catch (error) {
        console.error('이메일 확인 오류:', error);
      }
    };

    checkEmailExists();
  }, []);

  //유저 이메일
  const [userEmail, setUserEmail] = useState('');

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
    // 유저 마이페이지 정보
    getUserInfo();
  }, []);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reField, setReField] = useState('');
  const [reGenre1, setReGenre1] = useState('');
  const [reGenre2, setReGenre2] = useState('');
  const [reGenre3, setReGenre3] = useState('');
  const [reGenre4, setReGenre4] = useState('');
  const [reGenre5, setReGenre5] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const paramName = searchParams.get('name');
    const paramEmail = searchParams.get('email');
    const paramReField = searchParams.get('reField');
    const paramReGenre1 = searchParams.get('reGenre1');
    const paramReGenre2 = searchParams.get('reGenre2');
    const paramReGenre3 = searchParams.get('reGenre3');
    const paramReGenre4 = searchParams.get('reGenre4');
    const paramReGenre5 = searchParams.get('reGenre5');
    setName(paramName || '');
    setEmail(paramEmail || '');
    setReField(paramReField || '');
    setReGenre1(paramReGenre1 || '');
    setReGenre2(paramReGenre2 || '');
    setReGenre3(paramReGenre3 || '');
    setReGenre4(paramReGenre4 || '');
    setReGenre5(paramReGenre5 || '');
    console.log('Name:', paramName);
    console.log('Email:', paramEmail);
    console.log('reField:', paramReField);
    console.log('reGenre1:', paramReGenre1);
    console.log('reGenre2:', paramReGenre2);
    console.log('reGenre3:', paramReGenre3);
    console.log('reGenre4:', paramReGenre4);
    console.log('reGenre5:', paramReGenre5);
  }, []);

  const [art, setArt] = useState({
    userName: '',
    reqUserEmail: '',
    reArtwork: '',
    reArtist: '',
    reSize: '',
    reProductYear: '',
    reField: '',
    reGenre: '',
    reGenre1: '',
    reGenre2: '',
    reGenre3: '',
    reGenre4: '',
    reGenre5: '',
    reDetails: '',
    email: '',
  });

  const [image, setImage] = useState();
  const [selectedGenres, setSelectedGenres] = useState([]);

  const changeImage = (evt) => {
    setImage(evt.target.files);
  };

  const changeInput = (evt) => {
    const { value, name } = evt.target;
    setArt({
      ...art,
      [name]: value,
    });
  };

  const onSubmit = async (evt) => {
    evt.preventDefault();

    // 필수 입력 필드 확인
    if (name && email) {
      if (!userEmail || !art.userName || !art.reArtwork || !art.reArtist || !art.reSize || !art.reProductYear || !reField || !selectedGenres.length || !art.reDetails || !image) {
        alert('의뢰 신청 시 필요한 항목을 모두 채워주세요.');
        return;
      }
    } else {
      if (!userEmail || !art.userName || !art.reArtwork || !art.reArtist || !art.reSize || !art.reProductYear || !art.reField || !subCategories.length || !art.reDetails || !image) {
        alert('의뢰 신청 시 필요한 항목을 모두 채워주세요.');
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append('userName', art.userName);
      formData.append('reqUserEmail', userEmail);
      formData.append('userEmail', email);
      formData.append('reArtwork', art.reArtwork);
      formData.append('reArtist', art.reArtist);
      formData.append('reSize', art.reSize);
      formData.append('reProductYear', art.reProductYear);
      if (name && email) {
        formData.append('reField', reField);
      } else {
        formData.append('reField', art.reField);
      }
      formData.append('reGenre', art.reGenre);
      formData.append('reGenre1', reGenre1);
      formData.append('reGenre2', reGenre2);
      formData.append('reGenre3', reGenre3);
      formData.append('reGenre4', reGenre4);
      formData.append('reGenre5', reGenre5);
      formData.append('reDetails', art.reDetails);
      formData.append('file', image[0]);

      if (name && email) {
        await axios.post('http://localhost:4000/commission/uploads', formData, art, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        history.push('/commissionCompleted');
      } else {
        const data = {
          reqUserEmail: userEmail,
          reField: art.reField,
          reGenre: art.reGenre,

          userName: art.userName,
          reArtwork: art.reArtwork,
          reArtist: art.reArtist,
          reSize: art.reSize,
          reProductYear: art.reProductYear,
          reDetails: art.reDetails,
          file: image[0],
        }; //

        history.push('/commissionList', { Data: data });
      }
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
    console.log(selectedCategory);
    setArt({
      ...art,
      reField: category,
    });
  };

  const handleGenreChange = (e) => {
    const selectedGenre = e.target.value;

    setSelectedGenres([selectedGenre]);

    setArt({
      ...art,
      reGenre: selectedGenre,
    });
  };

  return (
    <div className="CoDiv">
      <div className="CoDiv_main">
        <div className="Co_title">
          {name && email ? (
            <div>
              <h2>{name} 감정사 의뢰 페이지</h2>
            </div>
          ) : (
            <div>
              <h2>명화 감정 신청</h2>
            </div>
          )}
        </div>
        <div>
          <form onSubmit={onSubmit} name="form" method="post" encType="multipart/form-data">
            <div className="flex-container">
              <p className="input100">
                <input className="cursor" type="text" id="userName" name="userName" value={art.userName} onChange={changeInput} placeholder="이름" />
              </p>
              <div className="spacer"></div>
              <p className="input100">
                <input className="cursor" type="text" id="reqUserEmail" name="reqUserEmail" value={userEmail} onChange={changeInput} readOnly />
              </p>
            </div>
            <div>
              <input className="cursor" type="hidden" id="userEmail" name="userEmail" value={email} onChange={changeInput} readOnly />
            </div>
            <div className="flex-container">
              <p className="input100">
                <input className="cursor" type="text" id="reArtwork" name="reArtwork" value={art.reArtwork} onChange={changeInput} placeholder="작품명" />
              </p>
              <div className="spacer"></div>
              <p className="input100">
                <input className="cursor" type="text" id="reArtist" name="reArtist" value={art.reArtist} onChange={changeInput} placeholder="작가명" />
              </p>
            </div>
            <div className="flex-container">
              <p className="input100">
                <input className="cursor" type="text" id="reSize" name="reSize" value={art.reSize} onChange={changeInput} placeholder="규격 ( mm * mm )" />
              </p>
              <div className="spacer"></div>
              <p className="input100">
                <input className="cursor" type="text" id="reProductYear" name="reProductYear" value={art.reProductYear} onChange={changeInput} placeholder="제작년대 ( YYYY )" />
              </p>
            </div>
            {name && email ? (
              <div>
                {' '}
                {/* 선택한 감정사 전문 분야 장르 */}
                <div className="input100">
                  {/* <input className='cursor' type="text" id="reqUserEmail" name="reqUserEmail" value={userEmail} onChange={changeInput} readOnly/> */}
                  <input className="cursor" type="text" id="reField" name="reField" value={reField} onChange={changeInput} readOnly />
                </div>
                <div className="input100">
                  <div className="genre-checkboxes">
                    {reGenre1 && (
                      <label className="genre-checkbox">
                        <div className="subCategoryPadding1">
                          <input type="checkbox" id="reGenre1" name="reGenre" value={reGenre1} onChange={handleGenreChange} checked={selectedGenres.includes(reGenre1)} />
                        </div>
                        <p className="subCategoryPadding2">{reGenre1}</p>
                      </label>
                    )}
                    {reGenre2 && (
                      <label className="genre-checkbox">
                        <div className="subCategoryPadding1">
                          <input type="checkbox" id="reGenre2" name="reGenre" value={reGenre2} onChange={handleGenreChange} checked={selectedGenres.includes(reGenre2)} />
                        </div>
                        <p className="subCategoryPadding2">{reGenre2}</p>
                      </label>
                    )}
                    {reGenre3 && (
                      <label className="genre-checkbox">
                        <div className="subCategoryPadding1">
                          <input type="checkbox" id="reGenre3" name="reGenre" value={reGenre3} onChange={handleGenreChange} checked={selectedGenres.includes(reGenre3)} />
                        </div>
                        <p className="subCategoryPadding2">{reGenre3}</p>
                      </label>
                    )}
                    {reGenre4 && (
                      <label className="genre-checkbox">
                        <div className="subCategoryPadding1">
                          <input type="checkbox" id="reGenre4" name="reGenre" value={reGenre4} onChange={handleGenreChange} checked={selectedGenres.includes(reGenre4)} />
                        </div>
                        <p className="subCategoryPadding2">{reGenre4}</p>
                      </label>
                    )}
                    {reGenre5 && (
                      <label className="genre-checkbox">
                        <div className="subCategoryPadding1">
                          <input type="checkbox" id="reGenre5" name="reGenre" value={reGenre5} onChange={handleGenreChange} checked={selectedGenres.includes(reGenre5)} />
                        </div>
                        <p className="subCategoryPadding2">{reGenre5}</p>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="input100">
                  <select className="classify" id="reField" name="reField" value={art.reField} onChange={handleCategoryChange}>
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
                        <p className="subCategoryPadding2">{subCategory}</p>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div>
              <p>
                <textarea className="careerTextarea cursor" type="text" id="reDetails" name="reDetails" value={art.reDetails} onChange={changeInput} placeholder="내용" />
              </p>
            </div>
            <div className="previewImage imgInput">
              <input type="file" name="files" onChange={changeImage} />
            </div>
            {name && email ? (
              <div>
                <button className={`commission_btn ${userEmail && art.userName && art.reArtwork && art.reArtist && art.reSize && art.reProductYear && reField && selectedGenres && art.reDetails && image ? 'active' : ''}`} type="submit" id="submit">
                  전송
                </button>
              </div>
            ) : (
              <div>
                <button className={`commission_btn ${userEmail && art.userName && art.reArtwork && art.reArtist && art.reSize && art.reField && art.reProductYear && subCategories && art.reDetails && image ? 'active' : ''}`} type="submit" id="submit">
                  전송
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Commission;
