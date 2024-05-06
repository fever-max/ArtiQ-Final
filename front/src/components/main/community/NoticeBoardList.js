import React from "react";
import "../../../styles/main/community/freeboardItem.css";
import NoticeBoardItem from "./NoticeBoardItem";

function NoticeBoardList({ data, currentUserEmail }) {
  const totalCount = data.length;

  return (
    <div>
      {data.map((item, index) => (
        <NoticeBoardItem key={item.noticeNumber} item={item} index={index} totalCount={totalCount} currentUserEmail={currentUserEmail}/>
      ))}
    </div>
  );
}

export default NoticeBoardList;
