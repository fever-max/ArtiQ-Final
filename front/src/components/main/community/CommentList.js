import React from "react";
import CommentItem from "./CommentItem";

const CommentList = ({ data, boardNumber }) => {
  return (
    <div>
      {data.map((comment) => (
        <div key={comment.commentNumber}>
          <CommentItem item={comment} boardNumber={boardNumber} />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
