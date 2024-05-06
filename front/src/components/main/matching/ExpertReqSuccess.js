import React from 'react';
import '../../../styles/main/matching/ExpertReqSuccess.css';

const ExpertReqSuccess = () => {
    return (
        <div className="expertReqSuccess_div">
            <div className="expertReqSuccess_main">
            <div className="expertReqSuccess_title">
                <h2>감정사 신청 완료</h2>
            </div>
            <hr className="expertReqSuccess_hr"></hr>
            <div className="expertReqSuccess_sub">
                <div>
                <div>감정사 신청이 완료되었습니다.</div>
                <div>승인 결과는 빠른 시일 내 마이페이지에서 확인하실 수 있습니다.</div>
                </div>
            </div>
            <a className="expertReqSuccess_btn" href="/myPage">
                <div>신청 확인</div>
            </a>
            </div>
        </div>
    );
};

export default ExpertReqSuccess;