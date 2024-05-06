import React, { useState } from 'react';
import '../../../styles/main/userInfo/ServiceCenter.css';
import { MdOutlineQuestionAnswer } from 'react-icons/md';
import { FaCaretDown } from 'react-icons/fa';

function ServiceCenter() {
  const [answersVisibility, setAnswersVisibility] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const toggleAnswerVisibility = (questionId) => {
    // 열린 상태의 질문 ID를 모두 담은 배열 생성
    const openQuestions = Object.keys(answersVisibility).filter((key) => answersVisibility[key]);

    // 클릭된 질문 ID의 상태를 반전
    setAnswersVisibility({
      ...answersVisibility,
      [questionId]: !answersVisibility[questionId],
    });

    // 이전에 열려있던 질문들의 상태를 닫음
    openQuestions.forEach((qid) => {
      if (qid !== questionId) {
        setAnswersVisibility((prevVisibility) => ({
          ...prevVisibility,
          [qid]: false,
        }));
      }
    });
  };

  const filteredFaqData = faqData.filter((faq) => (!selectedCategory || faq.categoryId === selectedCategory) && faq.question.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="ServiceCenter_div">
      <div className="ServiceCenter_title">
        <MdOutlineQuestionAnswer size={40} />
        자주 묻는 질문
      </div>
      <hr className="MyPageUserInfo_hr" />
      <div className="ServiceCenter_search_div">
        <input type="text" placeholder="질문을 검색해주세요." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="ServiceCenter_search" />
      </div>
      <div className="ServiceCenter_categories">
        <div onClick={() => setSelectedCategory(null)} className={`ServiceCenter_category ${selectedCategory === null ? 'active' : ''}`}>
          <div>전체</div>
        </div>
        {categoryData.map((category) => (
          <div key={category.id} onClick={() => setSelectedCategory(category.id)} className={`ServiceCenter_category ${selectedCategory === category.id ? 'active' : ''}`}>
            <div>{category.name}</div>
          </div>
        ))}
      </div>
      <div className="ServiceCenter_qna_content">
        <div className="ServiceCenter_qna">
          {filteredFaqData.map((faq, index) => (
            <div key={index} className="ServiceCenter_question">
              <div className="ServiceCenter_qna_q" onClick={() => toggleAnswerVisibility(faq.id)}>
                <div className="ServiceCenter_qna_q_sub">
                  <div className="ServiceCenter_qna_q1">Q.</div>
                  <div>{faq.question}</div>
                </div>
                <div>
                  <FaCaretDown />
                </div>
              </div>
              <div className={`ServiceCenter_qna_a ${answersVisibility[faq.id] ? 'visible' : 'hidden'}`}>
                {faq.answer.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const categoryData = [
  { id: 1, name: '공통' },
  { id: 2, name: '경매' },
  { id: 3, name: '포인트' },
  { id: 4, name: '커뮤니티' },
];

const faqData = [
  { id: 1, categoryId: 1, question: 'ArtiQ는 어떤 서비스인가요?', answer: ['ArtiQ은 포인트로 명화 경매를 경험하고,커뮤니티를 즐길 수 있는 서비스이며,', '전문가의 철저한 검수를 통해 안전하고 신속하게 거래할 수 있습니다.'] },
  { id: 2, categoryId: 2, question: '경매는 어떤 방식으로 이루어지나요?', answer: ['경매는 포인트를 충전 후 원하는 가격으로 입찰할 수 있으며, 경매가 끝나면 거래가 체결됩니다.', '또한 구매자는 판매자의 입찰 가격 중 가장 즉시 구매 가격으로 즉시 구매할 수 있습니다.'] },
  { id: 3, categoryId: 2, question: '경매 진행 일정이 궁금해요.', answer: ['실시간 경매 같은 경우 매일 오전 11시부터 오후 6시까지 이뤄지며, ', '일반 경매는 매월, 매주, 매일 판매자의 니즈에 따라 시간이 다르기 때문에 상세 페이지 참고 부탁드립니다.'] },
  { id: 4, categoryId: 3, question: '포인트 충전 방법이 궁금해요.', answer: ['포인트 충전은 마이페이지 > 포인트 충전 또는 경매 페이지에서 충전이 가능합니다.', '금액은 100원부터 시작되며, 취소는 마이페이지 포인트 결제 내역에서 가능합니다.'] },
  { id: 5, categoryId: 3, question: '포인트 사용 방법이 궁금해요.', answer: ['구매 입찰 혹은 즉시 구매 시, 가격 입력 하단의 포인트 사용하기 버튼을 통해 포인트 사용이 가능합니다.', 'ArtiQ 포인트는 1,000 포인트 이상부터 100포인트 단위로 구매 금액 제한 없이 사용할 수 있습니다.', '거래가 취소될 경우, 해당 포인트는 환불되며 유효기간이 지난 포인트는 소멸됩니다.'] },
  { id: 6, categoryId: 1, question: '회원가입은 어떻게 하나요?', answer: ['회원가입은 홈페이지의 회원가입 버튼을 클릭하여 필요한 정보를 입력하고 가입 요청을 하시면 됩니다.', '입력하신 정보는 안전하게 보호되며, 손쉽게 서비스를 이용하실 수 있습니다.'] },
  { id: 7, categoryId: 1, question: '비밀번호를 잊어버렸어요. 어떻게 하면 될까요?', answer: ['비밀번호를 잊어버리신 경우, 로그인 화면에서 "비밀번호 찾기" 링크를 클릭하셔서 새로운 비밀번호를 발급받으실 수 있습니다.', '이메일로 새로운 비밀번호가 전송되니 마이페이지에서 꼭 변경해주세요.'] },
  { id: 8, categoryId: 1, question: '서비스 이용 중 문제가 발생했어요. 어떻게 해결하면 될까요?', answer: ['서비스 이용 중에 문제가 발생하신 경우, 고객센터로 문의해주시면 친절히 안내해 드리겠습니다.', '문제의 내용을 자세히 설명해주시면 보다 신속한 해결이 가능합니다.'] },
  { id: 9, categoryId: 4, question: '커뮤니티에서 쓴 글은 어디서 보나요?', answer: ['커뮤니티에서 작성한 글은 마이페이지에서 찾아보실 수 있습니다.'] },
  { id: 10, categoryId: 4, question: '커뮤니티에서 욕설한 회원 신고는 어떻게 하나요?', answer: ['회원 아이디 클릭 후 신고하기 버튼을 눌러주세요.', ' 해당 회원은 경고 2번 이후 강제 탈퇴 됩니다.'] },
];

export default ServiceCenter;
