import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function NaverCallback() {
  const history = useHistory();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    const state = new URL(window.location.href).searchParams.get('state');

    axios
      .post(
        'http://localhost:4000/api/oauth2/naver',
        {
          authorizationCode: code,
          state: state,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          // 정보가 있으면
          const userEmail = response.data.response.email; // 이메일 값을 추출하여 변수에 할당
          history.push(`/join?email=${userEmail}&code=NAVER`); // 회원가입 페이지로 이동하면서 이메일, 소셜 코드 전달
        } else if (response.status === 204) {
          window.location.href = '/'; // 로그인 후 이동
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [history]);

  return null;
}

export default NaverCallback;
