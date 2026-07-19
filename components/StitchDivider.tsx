export default function StitchDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <line
        x1="0"
        y1="6"
        x2="400"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="10 8"
        strokeLinecap="round"
      />
    </svg>
  );
}
