// src/shared/components/Card.tsx
import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
        hover && 'transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}