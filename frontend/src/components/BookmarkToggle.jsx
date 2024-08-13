import { useState } from "react";
import PropTypes from "prop-types";

function BookmarkToggle({ isFavorite, onMark, onRemove }) {
  const [checked, setChecked] = useState(isFavorite);

  const handleClick = () => {
    if (checked) {
      onRemove();
    } else {
      onMark();
    }
    setChecked(!checked);
  };

  return (
    <div className={`bookmark ${checked ? "bookmark-checked" : ""} absolute top-2 right-3 `} onClick={handleClick}>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512" className="svgIcon2">
        <path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path>
      </svg>
    </div>
  );
}

BookmarkToggle.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  onMark: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default BookmarkToggle;
