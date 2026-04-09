import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-6 ${className}`}>
      {children}
    </div>
  );
}
