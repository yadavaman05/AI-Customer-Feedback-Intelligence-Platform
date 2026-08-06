import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
    rating: number;
    maxStars?: number;
    size?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

export const RatingStars = ({
    rating,
    maxStars = 5,
    size = 14,
    interactive = false,
    onRatingChange,
    className,
}: RatingStarsProps) => {
    const [hoverRating, setHoverRating] = React.useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        if (!interactive) return;
        setHoverRating(index);
    };

    const handleMouseLeave = () => {
        if (!interactive) return;
        setHoverRating(null);
    };

    const handleClick = (index: number) => {
        if (!interactive || !onRatingChange) return;
        onRatingChange(index);
    };

    const currentRating = hoverRating !== null ? hoverRating : rating;

    return (
        <div className={cn("flex items-center gap-0.5", className)}>
            {Array.from({ length: maxStars }).map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= currentRating;

                return (
                    <button
                        key={index}
                        type={interactive ? "button" : undefined}
                        onClick={() => handleClick(starValue)}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                            "focus:outline-none transition-colors",
                            interactive ? "cursor-pointer" : "cursor-default"
                        )}
                        style={{
                            width: size,
                            height: size,
                        }}
                    >
                        <Star
                            size={size}
                            className={cn(
                                isFilled
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-600 fill-transparent"
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default RatingStars;
