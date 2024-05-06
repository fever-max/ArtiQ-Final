import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../styles/main/community/noticeItem.css";

const NoticeBoardItem = ({ item, index, totalCount }) => {
  const { noticeTitle, noticeDate } = item;
  const [scrollToTop, setScrollToTop] = useState(false);
  const descendingIndex = totalCount - index;

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: "auto" }); // 페이지 맨 위로 스크롤
      setScrollToTop(false);
    }
  }, [scrollToTop]);

  
  return (
    <article>
      <div className="notice_col_1">
        <div className="notice_num_col">{descendingIndex}</div>
        <div className="notice_title_col_1">
          <Link to={`/noticeBoardDetail/${item.noticeNumber}`}>{noticeTitle}</Link>
        </div>
        <div className="notice_create_col_1">{noticeDate}</div>
      </div>
    </article>
  );
};

export default NoticeBoardItem;