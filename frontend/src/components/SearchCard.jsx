import PropTypes from "prop-types";
import BookmarkToggle from "./BookmarkToggle";

function SearchCard({ data, onClick, onMark, onRemove, isFavorite }) {
  return (
    <div className="flex flex-row ">
      <div className="w-[150px] mr-4 relative">
        <img onClick={() => onClick(data.url)} src={data.poster} alt={data.title} className="rounded-sm w-full select-none hover:cursor-pointer" />
        <BookmarkToggle isFavorite={isFavorite} onMark={onMark} onRemove={onRemove} />
      </div>
      <div>
        <h3
          className="text-gray-800 text-lg mb-0 mt-[0.4375rem] font-semibold hover:cursor-pointer dark:text-white"
          onClick={() => onClick(data.url)}
        >
          {data.title}
        </h3>
        <p className="text-sm text-gray-600 mt-2 dark:text-gray-300">{data.author}</p>
        <div className="flex gap-[5px] items-center mb-0 mt-[0.4rem] text-gray-600 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M14.45 2.44A1.5 1.5 0 0013.388 2H5.52a1.5 1.5 0 00-1.5 1.5v17a1.5 1.5 0 001.5 1.5h12.997a1.49 1.49 0 001.492-1.483L20.01 20V8.621a1.5 1.5 0 00-.44-1.06l-5.12-5.122zM16.01 17a1 1 0 01-1 1h-6a1 1 0 110-2h6a1 1 0 011 1zm0-4a1 1 0 01-1 1h-6a1 1 0 110-2h6a1 1 0 011 1zm-1.5-4a1.5 1.5 0 01-1.5-1.5v-4l5.5 5.5h-4z"
              strokeLinecap="round"
            ></path>
          </svg>
          {data.last_chapter_number} ch
        </div>
      </div>
    </div>
  );
}

SearchCard.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    last_chapter_number: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onMark: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default SearchCard;
