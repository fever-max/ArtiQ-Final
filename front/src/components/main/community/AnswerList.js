import React from 'react';
import AnswerItem from './AnswerItem';

const AnswerList = ({ data, questionNumber, onAccept, boardPostUser }) => {
  return (
    <div>
      {data.map((answer) => (
        <div key={answer.answerNumber}>
          <AnswerItem item={answer} questionNumber={questionNumber} onAccept={onAccept} onAcceptData={answer.isAccepted} boardPostUser={boardPostUser} />
        </div>
      ))}
    </div>
  );
};

export default AnswerList;
