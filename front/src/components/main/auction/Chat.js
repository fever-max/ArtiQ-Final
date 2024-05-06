import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../../../styles/main/liveAuction/Chat.css';
import { FaUserLarge } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [userNickname, setUserNickname] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [nowUserEmail, setNowUserEmail] = useState(null);
  const [userProfile, setUserProfile] = useState('');
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [imageUrl1, setImageUrl1] = useState('');
  const currentTime = new Date().toLocaleTimeString();

  const convertToImageUrl = (path) => {
    const imageDirectory = 'http://localhost:4000/images/userImg/';
    const trimmedPath = path.replace('src\\main\\resources\\static\\images\\userImg\\', '');
    const decodedPath = decodeURIComponent(trimmedPath);
    const imageUrl = `${imageDirectory}${decodedPath}`;

    return imageUrl;
  };

  useEffect(() => {
    const getUserNickname = async () => {
      try {
        const response = await axios.get('http://localhost:4000/chat/nickname', {
          withCredentials: true,
        });
        setUserNickname(response.data.nickname);
        setUserEmail(response.data.userEmail);
        setUserProfile(response.data.userimg);
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
        setUserNickname(null);

        const result = Swal.fire({
          title: '로그인 에러',
          text: '실시간 경매는 로그인 후 이용가능합니다',
          confirmButtonColor: '#d33',
          confirmButtonText: '확인',
          showClass: {
            popup: 'animate__animated animate__fadeInDown',
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp',
          },
        });
        history.push('/login');
      } finally {
        setLoading(false);
      }
    };
    getUserNickname();
  }, [history]); // userProfile2를 의존성 배열에서 제거

  useEffect(() => {
    const imagePath = userProfile;
    const imageUrl = imagePath == null ? 'https://kream.co.kr/_nuxt/img/blank_profile.4347742.png' : convertToImageUrl(imagePath);
    setImageUrl1(imageUrl);
  }, [userProfile]);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem('chatMessages'));
    if (storedMessages) {
      const uniqueUsers = new Set(storedMessages.map((messageObj) => messageObj.imageUrl1));
      setOnlineUsersCount(uniqueUsers.size);
    }
  }, []);

  const sendMessage = async () => {
    console.log('전송 실행');
    if (inputMessage.trim() === '') return;
    try {
      const messageData = {
        nickname: userNickname,
        message: inputMessage,
        profileImage: imageUrl1,
        userEmail: userEmail, // 송신자의 프로필 이미지 정보를 함께 전송
      };
      await axios.post('http://localhost:4000/chat/data', messageData);
      const message = `${userNickname}: ${inputMessage} * ${imageUrl1} *${userEmail}`;
      socket.send(message);

      setInputMessage('');
    } catch (error) {
      console.error('메시지 전송 중 오류:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4000/ws/chat');
    ws.onopen = () => console.log('WebSocket chat연결 성공');
    console.log('WebSocket chat연결 성공2');
    ws.onmessage = (event) => {
      console.log('이벤트 읽어옴');
      console.log('event.data:' + event.data);
      const message = event.data;
      const splitMessages = message.split('*');

      const firstPart = splitMessages[0];
      const secondPart = splitMessages[1];
      const userEmail = splitMessages[2];
      const time = currentTime;

      //현재 접속 중인 유저 이메일 저장
      setNowUserEmail(userEmail);

      setMessages((prevMessages) => {
        if (imageUrl1) {
          const newMessages = [...prevMessages, { firstPart, secondPart, userEmail, time }];
          localStorage.setItem('chatMessages', JSON.stringify(newMessages));
          console.log(newMessages);
          return newMessages;
        } else {
          console.log('이미지가 로드되기를 기다립니다.');
          return prevMessages;
        }
      });
    };

    setSocket(ws);
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
    return () => {
      ws.close();
    };
  }, [imageUrl1]);

  return (
    <div className="chat">
      <div className="top">
        <div className="top-left">
          <FaUser /> {onlineUsersCount + 1}명
        </div>
      </div>
      <div className="wrap" style={{ height: '500px' }}>
        {messages.map((messageObj, index) => (
          /* 접속 중 유저 이메일 비교 css 변경 */
          <div key={index} className={messageObj.userEmail === userEmail ? 'chat_ch2' : 'chat ch1'}>
            <div className="icon">
              <img src={messageObj.secondPart || 'https://kream.co.kr/_nuxt/img/blank_profile.4347742.png'} alt="프로필이미지" className="chatprofile" />
            </div>
            <div className="textbox">{typeof messageObj.firstPart === 'string' ? messageObj.firstPart.replace(/"/g, '').replace(/[{}]/g, '').replace('UserName', '알림') : messageObj.firstPart}</div>
            <div className="msgTime">{messageObj.time}</div>
          </div>
        ))}
      </div>
      <div className="bottom">
        <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="메시지를 입력하세요" className="textarea" />
        <button onClick={sendMessage} className="buttonChat">
          전송
        </button>
      </div>
    </div>
  );
};

export default Chat;
