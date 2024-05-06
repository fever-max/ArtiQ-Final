import React, { useState, useEffect } from 'react';
import '../../../../styles/main/admin/info/AdminUserInfo.css';
import axios from 'axios';
import Modal from 'react-modal';
import { IoMdCloseCircleOutline } from 'react-icons/io';

function AdminUserInfo({ jwt }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUserInfo, setEditedUserInfo] = useState({
    userNo: '',
    userEmail: '',
    userRole: '',
    userNickname: '',
    rankLevel: '',
    rankPoint: '',
    socialPlatform: '',
    userDate: '',
  });
  const [userProfile, setUserProfile] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchOption, setSearchOption] = useState('userEmail'); // 기본적으로 이메일로 검색
  const [searchResults, setSearchResults] = useState([]);
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userInfoResponse = await axios.get('http://localhost:4000/admin/userInfo', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUsers(userInfoResponse.data);
    } catch (error) {
      console.error('유저 정보를 가져오는 중 오류가 발생했습니다.', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditedUserInfo({
      userNo: user.userNo,
      userEmail: user.userEmail,
      userRole: user.userRole,
      userNickname: user.userNickname,
      rankLevel: user.rankLevel,
      rankPoint: user.rankPoint,
      socialPlatform: user.socialPlatform,
      userDate: user.userDate,
    });

    fetchUserProfileImage(user.userEmail);
    onModify();
  };

  const fetchUserProfileImage = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:4000/user/myPage/userProfileImage?userEmail=${userEmail}`, {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);

      setUserProfile(imageUrl);
    } catch (error) {
      console.error('유저의 프로필 이미지가 없습니다.', error);
      setUserProfile('https://kream.co.kr/_nuxt/img/blank_profile.4347742.png');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
    },
    content: {
      left: '0',
      margin: 'auto',
      width: '600px',
      height: '370px',
      padding: '0',
      overflow: 'hidden',
    },
  };

  const onClickClose = () => {
    setIsOpen(false);
  };

  const onModify = () => {
    setIsOpen(!isOpen);
  };

  const handleEditComplete = async () => {
    try {
      const response = await axios.post('http://localhost:4000/admin/userInfo/update', editedUserInfo, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      alert('사용자 정보 업데이트 성공');
      console.log('사용자 정보 업데이트 성공', response.data);

      fetchData();

      setIsOpen(false);
    } catch (error) {
      console.error('사용자 정보 업데이트 오류', error);
    }
  };

  const handleRoleChange = (e) => {
    const { value } = e.target;
    setEditedUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      userRole: value,
    }));
  };

  const handleDelete = async (userEmail) => {
    const confirmDelete = window.confirm(userEmail + '사용자를 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        const response = await axios.post(
          'http://localhost:4000/admin/userInfo/delete',
          { userEmail: userEmail },
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        alert('사용자 정보 삭제 성공');
        console.log('사용자 정보 삭제 성공', response.data);

        fetchData();
      } catch (error) {
        console.error('사용자 정보 삭제 오류', error);
      }
    }
  };

  const today = new Date().toISOString().slice(0, 10);
  const todayJoinUsers = users.filter((user) => user.userDate && user.userDate.startsWith(today)).length;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = searchResults.length > 0 ? searchResults.slice(indexOfFirstUser, indexOfLastUser) : users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = () => {
    const results = users.filter((user) => user[searchOption].toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
    setSearchCurrentPage(1); // 검색이 다시 시작되면 첫 페이지로 돌아갑니다.
  };

  const getPaginatedSearchResults = () => {
    const indexOfLastUser = searchCurrentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return searchResults.slice(indexOfFirstUser, indexOfLastUser);
  };

  const searchPaginate = (pageNumber) => setSearchCurrentPage(pageNumber);

  return (
    <div className="AdminUserInfo_div">
      <h3 className="AdminUserInfo_title">회원관리</h3>
      <div className="AdminUserInfo_sub">
        <div>
          전체 회원: {users.length}명 / 오늘 가입 회원: {todayJoinUsers}명
        </div>
      </div>
      <div className="AdminUserInfo_search">
        <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)} className="AdminUserInfo_search1">
          <option value="userEmail">이메일</option>
          <option value="userNickname">닉네임</option>
          <option value="userRole">권한</option>
        </select>
        <input
          className="AdminUserInfo_search2"
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch} className="AdminUserInfo_search3">
          검색
        </button>
      </div>
      <hr className="AdminUserInfo_hr" />
      <div className="AdminUserInfo_table">
        <div className="AdminUserInfo_table_name">
          <div className="AdminUserInfo_table_name1">번호</div>
          <div className="AdminUserInfo_table_name2">이메일</div>
          <div className="AdminUserInfo_table_name3">닉네임</div>
          <div className="AdminUserInfo_table_name4">권한</div>
          <div className="AdminUserInfo_table_name5">포인트</div>
          <div className="AdminUserInfo_table_name6">소셜</div>
          <div className="AdminUserInfo_table_name7">가입일</div>
          <div className="AdminUserInfo_table_name8">수정 / 삭제</div>
        </div>
        <hr className="AdminUserInfo_hr" />
        <div className="AdminUserInfo_table_content">
          {currentUsers.map((user, index) => (
            <div key={index}>
              <div className="AdminUserInfo_table_row">
                <div className="AdminUserInfo_table_content1">{user.userNo}</div>
                <div className="AdminUserInfo_table_content2">{user.userEmail}</div>
                <div className="AdminUserInfo_table_content3">{user.userNickname}</div>
                <div className="AdminUserInfo_table_content4">{user.userRole}</div>
                <div className="AdminUserInfo_table_content5">{user.rankPoint.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
                <div className="AdminUserInfo_table_content6">{user.socialPlatform}</div>
                <div className="AdminUserInfo_table_content7">{user.userDate}</div>
                <div className="AdminUserInfo_table_content8">
                  <div className="AdminUserInfo_table_btn" onClick={() => handleEditUser(user)}>
                    수정
                  </div>
                  <div className="AdminUserInfo_table_btn" onClick={() => handleDelete(user.userEmail)}>
                    삭제
                  </div>
                </div>
              </div>
              {selectedUser === user && (
                <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
                  <div className="AdminUserInfo-user-modal">
                    <div className="AdminUserInfo_close_btn" onClick={onClickClose}>
                      <IoMdCloseCircleOutline size="25" />
                    </div>
                    <h3 className="AdminUserInfo_title">유저정보수정</h3>
                    <p className="AdminUserInfo_title_sub">*닉네임, 권한, 포인트만 수정이 가능합니다.</p>
                    <hr className="AdminUserInfo_hr" />
                    <div className="AdminUserInfo-user-modal_sub">
                      <div className="AdminUserInfo-user-modal1">
                        <img src={userProfile} alt="유저이미지" className="AdminUserInfo-user-modal-img" />
                      </div>
                      <div className="AdminUserInfo-user-modal2">
                        <div className="AdminUserInfo-user-modal-text">유저 닉네임</div>
                        <input type="text" name="userNickname" value={editedUserInfo.userNickname} onChange={handleInputChange} />
                        <div className="AdminUserInfo-user-modal-text">유저 Email</div>
                        <input type="text" name="userEmail" value={editedUserInfo.userEmail} onChange={handleInputChange} readOnly style={{ backgroundColor: '#ffffff' }} />
                        <div className="AdminUserInfo-user-modal-text">유저 권한</div>
                        <select name="userRole" value={editedUserInfo.userRole} onChange={handleRoleChange} className="AdminUserInfo-select">
                          <option value="ROLE_USER">일반 사용자</option>
                          <option value="ROLE_EXPERT">감정 전문가</option>
                          <option value="ROLE_ADMIN">관리자</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <div className="AdminUserInfo-user-modal-point">
                        <div className="AdminUserInfo-user-modal-point-sub">
                          <div className="AdminUserInfo-user-modal-text">유저 레벨</div>
                          <input type="text" name="rankLevel" value={editedUserInfo.rankLevel} onChange={handleInputChange} readOnly style={{ backgroundColor: '#ffffff' }} />
                        </div>
                        <div className="AdminUserInfo-user-modal-point-sub">
                          <div className="AdminUserInfo-user-modal-text">유저 포인트</div>
                          <input type="number" name="rankPoint" value={editedUserInfo.rankPoint} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="AdminUserInfo-user-modal-social">
                        <div className="AdminUserInfo-user-modal-text">유저 소셜 로그인</div>
                        <input type="text" name="socialPlatform" value={editedUserInfo.socialPlatform} onChange={handleInputChange} readOnly style={{ backgroundColor: '#ffffff' }} />
                      </div>
                      <div className="AdminUserInfo-user-modal-ok">
                        <div className="AdminUserInfo-user-modal-ok-btn" onClick={handleEditComplete}>
                          수정완료
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          ))}
        </div>
      </div>
      {searchResults.length > 0 && (
        <ul className="pagination">
          {Array.from({ length: Math.ceil(searchResults.length / usersPerPage) }, (_, index) => (
            <li key={index} className="page-item">
              <button onClick={() => searchPaginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!searchResults.length > 0 && (
        <ul className="pagination">
          {Array.from({ length: Math.ceil(users.length / usersPerPage) }, (_, index) => (
            <li key={index} className="page-item">
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminUserInfo;
