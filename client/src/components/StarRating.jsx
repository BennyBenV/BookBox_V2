import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    const [hover, setHover] = useState(null);

    return (
        <div className="flex">
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;

                return (
                    <label key={i}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => !readOnly && onRatingChange(ratingValue)}
                            className="hidden"
                        />
                        <FaStar
                            className={`cursor-pointer transition-colors ${readOnly ? '' : 'hover:scale-110 active:scale-95'}`}
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            size={readOnly ? 20 : 30}
                            onMouseEnter={() => !readOnly && setHover(ratingValue)}
                            onMouseLeave={() => !readOnly && setHover(null)}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default StarRating;
