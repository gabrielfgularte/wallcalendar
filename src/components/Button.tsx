import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "secondary";
};

export default function Button({ variant = "default", className = "", ...props }: Props) {
  const variantClass =
    variant === "primary" ? "btn btn-primary" : variant === "secondary" ? "btn btn-secondary" : "btn";

  return <button className={`${variantClass} ${className}`.trim()} {...props} />;
}
