import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const middleEllipsis = (str: string, len: number) => {
  if (!str) {
    return '';
  }

  return `${str.slice(0, len)}...${str.slice(str.length - len, 2*str.length-len)}`;
};



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}