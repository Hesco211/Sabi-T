"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props 
}: ButtonProps) {
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  const baseClasses = `flex justify-center items-center gap-2 rounded-2xl font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] ${sizeClasses[size]}`;
  
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = (disabled || isLoading) ? "opacity-60 cursor-not-allowed pointer-events-none" : "";
  
  const variants = {
    primary: "bg-primary text-white shadow-[0_18px_36px_-24px_rgba(59,130,246,0.55)] hover:bg-primary-strong hover:shadow-[0_20px_40px_-22px_rgba(59,130,246,0.48)]",
    secondary: "bg-white text-primary border border-blue-200/80 shadow-[0_14px_30px_-24px_rgba(59,130,246,0.25)] hover:bg-blue-50/85 hover:border-blue-300/80",
    outline: "bg-white/80 text-slate-700 border border-blue-200/90 shadow-[0_12px_24px_-24px_rgba(24,49,83,0.18)] hover:border-primary/35 hover:bg-blue-50/75"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
}
