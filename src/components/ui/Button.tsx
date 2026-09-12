import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary:
      "bg-white text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50",
    ghost: "text-brand hover:bg-brand-light",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
