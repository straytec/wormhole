import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cosmic' | 'stellar';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-cosmic-600 hover:bg-cosmic-500 text-white focus:ring-cosmic-500',
    secondary: 'bg-stellar-600 hover:bg-stellar-500 text-white focus:ring-stellar-500',
    cosmic: 'bg-gradient-to-r from-cosmic-600 to-stellar-600 hover:from-cosmic-500 hover:to-stellar-500 text-white focus:ring-cosmic-500',
    stellar: 'bg-transparent border-2 border-stellar-400 hover:bg-stellar-400 hover:text-stellar-900 text-stellar-200 focus:ring-stellar-400',
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};