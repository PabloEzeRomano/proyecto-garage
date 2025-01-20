interface LoginIconProps {
  className?: string;
}

export const LoginIcon: React.FC<LoginIconProps> = ({
  className = "theme-icon"
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      strokeWidth="2"
      d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"
    />
  </svg>
);