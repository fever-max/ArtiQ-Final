import React from 'react';
import '../../../styles/main/matching/CommissionComplete.css';

const CommissionCompleted = () => {
    return (
        <div className="commissionComplete_div">
            <div className="commissionComplete_main">
            <div className="commissionComplete_title">
                <h2>의뢰 신청 완료</h2>
            </div>
            <hr className="commissionComplete_hr"></hr>
            <div className="commissionComplete_sub">
                <div>
                <div>선택하신 감정사에게 신청서를 전달했습니다.</div>
                <div>승인 결과는 빠른 시일 내 마이페이지에서 확인하실 수 있습니다.</div>
                </div>
            </div>
            <a className="commissionComplete_btn" href="/myPage">
                <div>신청 확인</div>
            </a>
            </div>
        </div>
    );
};

export default CommissionCompleted;