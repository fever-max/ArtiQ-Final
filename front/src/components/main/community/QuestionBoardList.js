import React from "react";
import QuestionBoardItem from "./QuestionBoardItem";

function QuestionBoardList({ data, currentUserEmail }) {
  const totalCount = data.length;

  return (
    <div>
      {data.map((item, index) => (
        <QuestionBoardItem key={item.questionNumber} item={item} index={index} totalCount={totalCount} currentUserEmail={currentUserEmail} />
      ))}
    </div>
  );
}


export default QuestionBoardList;
