// src/components/animations.ts
// 공통 애니메이션/트랜지션 유틸리티 (Tailwind 기반)

export const fadeIn = 'animate-fade-in';
export const fadeOut = 'animate-fade-out';
export const pop = 'animate-pop';
export const shake = 'animate-shake';

// Tailwind CSS에 아래 keyframes/animation을 추가해야 합니다.
// 예시:
// .animate-fade-in { animation: fadeIn 0.4s ease; }
// .animate-fade-out { animation: fadeOut 0.4s ease; }
// .animate-pop { animation: pop 0.3s cubic-bezier(.17,.67,.83,.67); }
// .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }

// 실제 keyframes는 tailwind.config.js 또는 globals.css에 정의 필요
