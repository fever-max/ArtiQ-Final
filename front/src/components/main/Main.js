import React from "react";
import "../../styles/main/main.css";
import { Switch, Route } from "react-router-dom";
import Home from "./home/Home";
import About from "./about/About";
import Guide from "./about/Guide";
import LiveAuction from "./auction/LiveAuction";
import BasicAuction from "./auction/BasicAuction";
import Commission from "./matching/Commission";
import ExpertList from "./matching/ExpertList";
import NoticeBoard from "./community/NoticeBoard";
import FreeBoard from "./community/FreeBoard";
import QuestionBoard from "./community/QuestionBoard";
import Login from "./userInfo/Login";
import Join from "./userInfo/Join";
import MyPage from "./userInfo/MyPage";
import ServiceCenter from "./userInfo/ServiceCenter";
import Join_complete from "./userInfo/Join_complete";
import NaverCallback from "../../services/login/NaverCallback";
import Find_password from "./userInfo/find/Find_password";
import Find_email from "./userInfo/find/Find_email";
import Find_info from "./userInfo/find/Find_info";
import NotFound from "./NotFound";
import Find_emailSend from "./userInfo/find/Find_emailSend";
import BasicAuctionDetail from "./auction/BasicAuctionDetail";
import GoogleCallback from "../../services/login/GoogleCallback";
import FreeBoardWrite from "./community/FreeBoardWrite";
import ExpertRequest from "./matching/ExpertRequest";
import ExpertReqSuccess from "./matching/ExpertReqSuccess";
import CommissionList from "./matching/CommissionList";
import FreeBoardDetail from "./community/FreeBoardDetail";
import Admin from "./admin/Admin";
import CommissionCompleted from "./matching/CommissionCompleted";
import NoticeBoardList from "./community/NoticeBoardList";
import NoticeBoardDetail from "./community/NoticeBoardDetail";
import CommentItem from "./community/CommentItem";
import NoticeBoardWrite from "./community/NoticeBoardWrite";
import QuestionBoardWrite from "./community/QuestionBoardWrite";
import QuestionBoardDetail from "./community/QuestionBoardDetail";

function Main() {
  return (
    <div className="main">
      <Switch>
        <Route exact path="/" component={Home} />

        {/* 소개 */}
        <Route path="/about" component={About} />
        <Route path="/guide" component={Guide} />

        {/* 경매 */}
        <Route path="/liveAuction" component={LiveAuction} />
        <Route path="/basicAuction" component={BasicAuction} />
        <Route path="/basicAuctionDetail/:id" component={BasicAuctionDetail} />

        {/* 전문가 매칭 */}
        <Route path="/commission" component={Commission} />
        <Route path="/expertList" component={ExpertList} />
        <Route path="/expertRequest" component={ExpertRequest} />
        <Route path="/expertReqSuccess" component={ExpertReqSuccess} />
        <Route path="/commissionList" component={CommissionList} />
        <Route path="/commissionCompleted" component={CommissionCompleted} />

        {/* 커뮤니티 */}
        <Route path="/freeBoard" component={FreeBoard} />
        <Route path="/noticeBoard" component={NoticeBoard} />
        <Route path="/questionBoard" component={QuestionBoard} />

        <Route path="/freeBoardWrite" component={FreeBoardWrite} />
        <Route path="/noticeBoardWrite" component={NoticeBoardWrite} />
        <Route path="/questionWrite" component={QuestionBoardWrite} />

        <Route exact path="/freeBoardDetail/:boardNumber" component={FreeBoardDetail} />
        <Route path="/comments/:commentNumber">
          <CommentItem />
        </Route>
        <Route exact path="/noticeBoard" component={NoticeBoardList} />
        <Route path="/noticeBoardDetail/:noticeNumber" component={NoticeBoardDetail} />
        <Route path="/questionDetail/:questionNumber" component={QuestionBoardDetail} />

        {/* 유저정보 */}
        <Route path="/login" component={Login} />
        <Route path="/find_password" component={Find_password} />
        <Route path="/find_emailSend" component={Find_emailSend} />
        <Route path="/find_email" component={Find_email} />
        <Route path="/find_info" component={Find_info} />
        <Route path="/join" component={Join} />
        <Route path="/joinComplete" component={Join_complete} />
        <Route path="/myPage" component={MyPage} />
        <Route path="/serviceCenter" component={ServiceCenter} />

        {/* 관리자페이지 */}
        <Route path="/admin" component={Admin} />

        {/* 잘못된 경로 */}
        {/* <Route path="/*" component={NotFound} /> */}

        {/* 소셜 로그인 (콜백) */}
        <Route path="/api/oauth2/naver" component={NaverCallback} />
        <Route path="/api/oauth2/google" component={GoogleCallback} />
      </Switch>
    </div>
  );
}

export default Main;
