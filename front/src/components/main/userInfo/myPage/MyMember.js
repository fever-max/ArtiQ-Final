import React, { useEffect, useState } from 'react';
import '../../../../styles/main/userInfo/myPage/MyMember.css';
import axios from 'axios';

function MyMember() {
  const [userRank, setUserRank] = useState({
    rankLevel: '',
    rankPoint: '',
  });

  // 유저 레벨에 따른 할인률 객체
  const discountRates = {
    1: '5.0%',
    2: '10%',
    3: '25%',
    4: '50%',
    5: '100%',
  };

  useEffect(() => {
    const getUserMyPage = async () => {
      try {
        const response = await axios.get('http://localhost:4000/user/myPage/userInfo', {
          withCredentials: true,
        });
        //console.log(response.data);
        const { userEmail } = response.data;
        fetchUserRank(userEmail); //정보 받아오면 멤버쉽 정보도 받아옴
      } catch (error) {
        console.error('유저 정보가 없습니다.', error);
      }
    };
    // 유저 마이페이지 정보
    getUserMyPage();
  }, []);

  //멤버쉽 정보 불러오기
  const fetchUserRank = async (userEmail) => {
    try {
      const response = await axios.post('http://localhost:4000/user/myPage/rank', {
        userEmail: userEmail,
      });

      // 받은 데이터 처리
      //console.log(response.data);
      setUserRank({ ...userRank, rankLevel: response.data.rankLevel, rankPoint: response.data.rankPoint });
    } catch (error) {
      console.error('유저의 멤버쉽 정보가 없습니다.', error);
    }
  };

  return (
    <div className="MyMember_div">
      <div className="MyMember_div">
        <h3 className="MyMember_title">멤버쉽 정보</h3>
        <hr className="MyMember_hr" />
        <div className="MyMember_sub">
          <div className="MyMember_sub_title">My MemberShip</div>
          <div className="MyMember_MyMemberShip">
            <div className="MyMember_MyMemberShip1">
              <div className="MyMember_MyMemberShip1_sub1">
                <div className="MyMember_MyMemberShip1_sub_title">현재 등급</div>
                <div className="MyMember_MyMemberShip1_sub_LV">LV.{userRank.rankLevel}</div>
              </div>
              <div className="MyMember_MyMemberShip_line"></div>
              <div className="MyMember_MyMemberShip1_sub2">
                <div className="MyMember_MyMemberShip1_sub_title">수수료 할인률</div>
                <div className="MyMember_MyMemberShip1_sub_LV2">{discountRates[userRank.rankLevel]}</div>
              </div>
            </div>
            <div className="MyMember_MyMemberShip2">
              <div>적용 기간 2024.05.01 - 2024.05.31</div>
              <div>다음 등급 업데이트 2024.06.01</div>
            </div>
          </div>
          <div className="MyMember_sub_title">멤버쉽 레벨별 혜택</div>
          <div className="MyMember_LVs">
            <div className="MyMember_LV1">
              <div className="MyMember_LV_title">LV1</div>
              <div className="MyMember_LV_sub">5%</div>
            </div>
            <div className="MyMember_LV2">
              <div className="MyMember_LV_title">LV2</div>
              <div className="MyMember_LV_sub">10%</div>
            </div>
            <div className="MyMember_LV3">
              <div className="MyMember_LV_title">LV3</div>
              <div className="MyMember_LV_sub">25%</div>
            </div>
            <div className="MyMember_LV4">
              <div className="MyMember_LV_title">LV4</div>
              <div className="MyMember_LV_sub">50%</div>
            </div>
            <div className="MyMember_LV5">
              <div className="MyMember_LV_title">LV5</div>
              <div className="MyMember_LV_sub">100%</div>
            </div>
          </div>

          <div className="MyMember_LV_info">
            <div className="MyMember_LV_info_sub">
              <div className="MyMember_LV_info_sub1">
                <div className="MyMember_LV_info_sub_LV">LV5</div>
                <div className="MyMember_LV_info_sub_LV2">*20만 포인트 제공</div>
              </div>
              <div className="MyMember_LV_info_sub2">
                <div className="MyMember_LV_info_money">
                  <div className="MyMember_LV_info_money_title">구매 할인 수수료</div>
                  <div className="MyMember_LV_info_money_sub">100%</div>
                </div>
                <div>
                  <div className="MyMember_LV_info_money_title">전월 총 구매 금액</div>
                  <div className="MyMember_LV_info_money_sub">200만원 이상</div>
                </div>
              </div>
            </div>
            <div className="MyMember_LV_info_sub">
              <div className="MyMember_LV_info_sub1">
                <div className="MyMember_LV_info_sub_LV">LV4</div>
                <div className="MyMember_LV_info_sub_LV2">*15만 포인트 제공</div>
              </div>
              <div className="MyMember_LV_info_sub2">
                <div className="MyMember_LV_info_money">
                  <div className="MyMember_LV_info_money_title">구매 할인 수수료</div>
                  <div className="MyMember_LV_info_money_sub">50%</div>
                </div>
                <div>
                  <div className="MyMember_LV_info_money_title">전월 총 구매 금액</div>
                  <div className="MyMember_LV_info_money_sub">100만원 이상</div>
                </div>
              </div>
            </div>
            <div className="MyMember_LV_info_sub">
              <div className="MyMember_LV_info_sub1">
                <div className="MyMember_LV_info_sub_LV">LV3</div>
                <div className="MyMember_LV_info_sub_LV2">*10만 포인트 제공</div>
              </div>
              <div className="MyMember_LV_info_sub2">
                <div className="MyMember_LV_info_money">
                  <div className="MyMember_LV_info_money_title">구매 할인 수수료</div>
                  <div className="MyMember_LV_info_money_sub">25%</div>
                </div>
                <div>
                  <div className="MyMember_LV_info_money_title">전월 총 구매 금액</div>
                  <div className="MyMember_LV_info_money_sub">60만원 이상</div>
                </div>
              </div>
            </div>
            <div className="MyMember_LV_info_sub">
              <div className="MyMember_LV_info_sub1">
                <div className="MyMember_LV_info_sub_LV">LV2</div>
                <div className="MyMember_LV_info_sub_LV2">*5만 포인트 제공</div>
              </div>
              <div className="MyMember_LV_info_sub2">
                <div className="MyMember_LV_info_money">
                  <div className="MyMember_LV_info_money_title">구매 할인 수수료</div>
                  <div className="MyMember_LV_info_money_sub">10%</div>
                </div>
                <div>
                  <div className="MyMember_LV_info_money_title">전월 총 구매 금액</div>
                  <div className="MyMember_LV_info_money_sub">20만원 이상</div>
                </div>
              </div>
            </div>
            <div className="MyMember_LV_info_sub">
              <div className="MyMember_LV_info_sub1">
                <div className="MyMember_LV_info_sub_LV">LV1</div>
                <div className="MyMember_LV_info_sub_LV2"></div>
              </div>
              <div className="MyMember_LV_info_sub2">
                <div className="MyMember_LV_info_money">
                  <div className="MyMember_LV_info_money_title">구매 할인 수수료</div>
                  <div className="MyMember_LV_info_money_sub">5%</div>
                </div>
                <div>
                  <div className="MyMember_LV_info_money_title">전월 총 구매 금액</div>
                  <div className="MyMember_LV_info_money_sub">20만원 미만</div>
                </div>
              </div>
            </div>
          </div>

          <div className="MyMember_sub_title">구매 수수료 안내</div>
          <div className="MyMember_sub_charge">
            <div className="MyMember_sub_charge_info">
              <div>구매 수수료는 주문 금액의 3.5% 책정됩니다.</div>
              <div>기존 구매 수수료 3.5% = 서비스 이용료 (3.18%) + 부가세 (0.32%)</div>
            </div>
            <div className="MyMember_sub_charge_info">
              <div>구매자가 지불하는 이용료로 안정적인 서비스 운영을 위한 비용으로 활용됩니다.</div>
              <div>구매 수수료는 결제 1건당 1회 부과되며, 서비스 결제시 합산 결제됩니다.</div>
            </div>
          </div>

          <div className="MyMember_sub_title">유의사항</div>
          <div className="MyMember_sub_charge">
            <div className="MyMember_sub_charge_info">
              <div>구매 수수료는 구매 확정 시 최종 정산되며, 거래가 취소되면 해당 비용도 환불됩니다.</div>
              <div>구매 확정된 주문 건의 구매 수수료는 환불이 불가능합니다.</div>
              <div>결제 화면 및 주문 정보에서 구매 수수료를 확인하실 수 있으며, 서비스내에서는 '수수료'로 줄여서 표기됩니다.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyMember;
