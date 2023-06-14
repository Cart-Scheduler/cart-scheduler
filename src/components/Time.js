export default function Time({ date, className }) {
  const h = date.getHours();
  const m = date.getMinutes();
  return (
    <span className={className}>
      {h}:{m < 10 ? `0${m}` : m}
    </span>
  );
}
