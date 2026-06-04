import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Bugun';
  if (days === 1) return 'Kecha';
  return date.toLocaleDateString('uz-UZ');
}

export function getInitials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

export function getAvatarColor(id: number): string {
  const colors = [
    'bg-violet-500', 'bg-purple-500', 'bg-indigo-500',
    'bg-blue-500', 'bg-cyan-500', 'bg-teal-500',
    'bg-emerald-500', 'bg-pink-500', 'bg-rose-500',
  ];
  return colors[id % colors.length];
}
