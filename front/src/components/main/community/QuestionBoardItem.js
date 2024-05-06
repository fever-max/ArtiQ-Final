import React from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import '../../../styles/main/community/questionBoardItem.css';

function QuestionBoardItem({ item, index, totalCount }) {
  const { questionCategory, questionTitle, userNickname, questionDate, questionViewCount, questionAnswerCount } = item;
  const descendingIndex = totalCount - index;

  return (
    <article>
      <div className="question_item_col_1">
        <div className="question_item_num_col">{descendingIndex}</div>
        <div className="question_item_category_col">{questionCategory}</div>
        <div className="question_item_title_col_1">
          <Link to={`/questionDetail/${item.questionNumber}`} key={item.questionNumber} className="board_font">
            {questionTitle} <p className="board_count_color">[{questionAnswerCount}]</p>
          </Link>
        </div>
        <div className="question_item_nickname_col">{userNickname}</div>
        <div className="question_item_create_col">{questionDate}</div>
        <div className="question_item_hit_count_col">{questionViewCount}</div>
      </div>
    </article>
  );
}

export default QuestionBoardItem;
