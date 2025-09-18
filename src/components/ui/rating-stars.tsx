interface Props {
  value: number;
}

export default function RatingStars({ value }: Props) {
  const stars = Array.from({ length: 5 });
  return (
    <div className="flex items-center gap-1 text-accent">
      {stars.map((_, index) => (
        <span key={index} aria-hidden>
          {value >= index + 1 ? '★' : value > index ? '☆' : '☆'}
        </span>
      ))}
      <span className="sr-only">{value} sur 5</span>
    </div>
  );
}
