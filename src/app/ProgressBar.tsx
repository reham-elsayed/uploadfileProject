import React from 'react'
import { cn } from '../lib/utils';
interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'secondary';
  animation?: boolean;
  label: string;
  className?: string;
}
const ProgressBar = ({value, max=100, size='md', variant='default' , animation=false , label, className}: ProgressBarProps) => {
const sizes ={
  sm: 'h-2',
  md: 'h-4',
  lg: 'h-6',
}

const colorVariants ={
  default: 'bg-gray-200',
  primary: 'bg-blue-500',
  secondary: 'bg-green-500',
}
  const percentage = Math.min(Math.max((value/max)*100, 0), 100)
  return (
 <div className={cn('w-full', className)}>
{label && <p className="block mb-2 text-sm font-medium text-gray-700">{label}</p>}
 <div className={cn(`w-full bg-gray-200 rounded-full overflow-hidden`, sizes[size])}>
    <div className={cn('h-full  transition-all duration-1000 ease-in-out rounded-full', colorVariants[variant], animation && 'animate-pulse')}
    style={{width: `${percentage}%`}}
    ></div>
  </div>

 </div>
  )
}

export default ProgressBar