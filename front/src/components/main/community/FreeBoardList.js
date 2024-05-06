import React from "react";
import "../../../styles/main/community/freeboardItem.css";
import FreeBoardItem from "./FreeBoardItem";

const FreeBoardList = ({ data, currentUserEmail }) => {
  const totalCount = data.length;

  return (
    <div>
      {data.map((item, index) => (
        <FreeBoardItem key={item.boardNumber} item={item} index={index} totalCount={totalCount} currentUserEmail={currentUserEmail} />
      ))}
    </div>
  );
};

export default FreeBoardList;
