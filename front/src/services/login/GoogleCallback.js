import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function GoogleCallback() {
  const history = useHistory();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('code: ' + code);

    axios
      .post(
        'http://localhost:4000/api/oauth2/google',
        {
          authorizationCode: code,
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
          const userEmail = response.data; // 이메일 값을 추출하여 변수에 할당
          history.push(`/join?email=${userEmail}&code=GOOGLE`); // 회원가입 페이지로 이동하면서 이메일, 소셜 코드 전달
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

export default GoogleCallback;
