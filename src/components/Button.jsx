function Button({ children, onClick, className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`text-medium font-[10px] cursor-pointer rounded-full ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
