'use client';

import React from 'react';
import { IconAlertTriangle } from '@/components/common';
import { Button } from './Button';

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmButtonText?: string;
};

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = '확인',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full px-7 py-8 sm:px-10 sm:py-10 border border-slate-100/80 transition-all duration-300 animate-modal-pop"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex gap-5 items-start">
          <div className="w-14 h-14 flex-shrink-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center shadow-inner">
            <div className="text-red-500 w-8 h-8"><IconAlertTriangle /></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug mb-1">{title}</h3>
            <div className="text-slate-600 mt-1 text-base leading-relaxed break-words">{message}</div>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
          <Button onClick={onClose} variant="secondary" className="py-2.5 px-6 rounded-xl shadow-sm">
            취소
          </Button>
          <Button onClick={onConfirm} variant="danger" className="py-2.5 px-6 rounded-xl shadow-md font-bold">
            {confirmButtonText}
          </Button>
        </div>
        {/* 모달 닫기 버튼(모바일용) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors sm:hidden"
          aria-label="닫기"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  );
};
