interface MenuIconProps {
  className?: string;
}

export const MenuIcon: React.FC<MenuIconProps> = ({
  className = "w-6 h-6 text-current"
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="currentColor"
    className={className}
  >
    <g>
      <path d="M257.783,144.629v60.21c0,3.854-3.271,6.959-7.308,6.959h-1.948c-4.036,0-7.29-3.105-7.29-6.959V144.35   c0-9.916-7.011-12.882-13.708-12.882c-6.715,0-13.709,2.966-13.709,12.882v60.489c0,3.854-3.288,6.959-7.306,6.959h-1.948   c-4.019,0-7.307-3.105-7.307-6.959v-60.21c0-17.763-26.53-17.162-26.53,0.2c0,20.79,0,57.497,0,57.497   c-0.121,31.924,7.863,40.222,21.068,50.164c10.647,8.012,19.746,12.605,19.746,32.498v127.998h31.975V284.988   c0-19.893,9.081-24.486,19.728-32.498c13.205-9.942,21.19-18.24,21.068-50.164c0,0,0-36.708,0-57.497   C284.314,127.467,257.783,126.866,257.783,144.629z" />
      <path d="M344.68,150.622c-6.802,18.172-19.536,62.568-19.536,85.115c-1.775,54.235,27.452,25.165,28.183,67.639   v109.966h31.819l0.157,0.392c0,0,0-0.166,0-0.392c0-5.106,0-65.943,0-128.006c0-61.393,0-123.926,0-134.713   C385.303,128.467,355.241,122.361,344.68,150.622z" />
      <path d="M475.332,35.481c-4.419-10.448-11.778-19.285-21.05-25.548c-4.627-3.132-9.742-5.61-15.222-7.315   C433.579,0.913,427.768,0,421.766,0H117.111h-4.888h-21.99c-8.002,0-15.692,1.626-22.651,4.567   C57.126,9.002,48.289,16.344,42.026,25.608c-3.132,4.636-5.62,9.751-7.324,15.23c-1.705,5.463-2.609,11.282-2.609,17.258v395.807   c0,7.976,1.618,15.657,4.575,22.615c4.419,10.448,11.778,19.285,21.034,25.548c4.645,3.131,9.776,5.618,15.239,7.315   C78.42,511.087,84.231,512,90.233,512h21.99h4.888h304.655c7.985,0,15.675-1.626,22.633-4.567   c10.456-4.428,19.311-11.769,25.556-21.042c3.131-4.627,5.637-9.751,7.324-15.222c1.723-5.463,2.628-11.282,2.628-17.266V58.096   C479.907,50.129,478.272,42.439,475.332,35.481z" />
    </g>
  </svg>
);
