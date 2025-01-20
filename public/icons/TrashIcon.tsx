interface TrashIconProps {
  className?: string;
}

export const TrashIcon: React.FC<TrashIconProps> = ({
  className = "w-6 h-6"
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className={`text-current ${className}`}
    fill="none"
  >
    <path d="M5 7.5H19L18 21H6L5 7.5Z" />
    <path d="M15.5 9.5L15 19" />
    <path d="M12 9.5V19" />
    <path d="M8.5 9.5L9 19" />
    <path d="M16 5H19C20.1046 5 21 5.89543 21 7V7.5H3V7C3 5.89543 3.89543 5 5 5H8M16 5L15 3H9L8 5M16 5H8" />
  </svg>
);
