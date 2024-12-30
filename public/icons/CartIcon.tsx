interface CartIconProps {
  className?: string;
}

export const CartIcon: React.FC<CartIconProps> = ({
  className = "w-6 h-6 text-current"
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M3 3H4.5L4.9 5M4.9 5L6.8 15.6C6.92163 16.3354 7.31959 16.9981 7.91864 17.4831C8.51769 17.9681 9.27491 18.2431 10.05 18.26H19.8C20.5751 18.2431 21.3323 17.9681 21.9314 17.4831C22.5304 16.9981 22.9284 16.3354 23.05 15.6L24.2 8.3C24.2547 8.01772 24.2141 7.72744 24.0837 7.4697C23.9533 7.21196 23.7392 7.00252 23.475 6.875C23.2988 6.79165 23.1058 6.74851 22.9105 6.74925H4.9M12 9H16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);