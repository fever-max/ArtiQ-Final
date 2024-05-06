import { Link } from 'react-router-dom';
import '../../../styles/main/community/freeboardItem.css';

const FreeBoardItem = ({ item, index, totalCount }) => {
  const { boardCategory, boardTitle, userNickname, boardDate, boardViewCount, boardUpCount, boardCommentCount } = item;
  const descendingIndex = totalCount - index;

  return (
    <article>
      <div className="free_item_col_1">
        <div className="free_item_num_col">{descendingIndex}</div>
        <div className="free_item_category_col">{boardCategory}</div>
        <div className="free_item_title_col_1">
          <Link to={`/freeBoardDetail/${item.boardNumber}`} key={item.boardNumber} className="board_font">
            {boardTitle} <p className="board_count_color">[{boardCommentCount}]</p>
          </Link>
        </div>
        <div className="free_item_nickname_col">{userNickname}</div>
        <div className="free_item_create_col">{boardDate}</div>
        <div className="free_item_hit_count_col">{boardViewCount}</div>
        <div className="free_item_like_col">{boardUpCount}</div>
      </div>
    </article>
  );
};

export default FreeBoardItem;
