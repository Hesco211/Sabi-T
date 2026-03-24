export default function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`${sizeClasses[size]} border-4 border-blue-100 border-t-primary rounded-full animate-spin shadow-[0_12px_24px_-20px_rgba(59,130,246,0.42)]`}
      />
    </div>
  );
}
