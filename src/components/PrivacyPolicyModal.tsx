'use client';

import React from 'react';
import { IconX } from '@/components/common';
import { Button } from './Button';

export const PrivacyPolicyModal = ({ onClose }: { onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
            <header className="p-4 border-b flex justify-between items-center shrink-0">
                <h3 className="text-lg font-bold text-slate-800">개인정보 수집 및 이용 동의</h3>
                <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100">
                    <div className="w-5 h-5"><IconX /></div>
                </button>
            </header>
            <main className="p-6 overflow-y-auto text-slate-600 text-sm">
                <h4 className="font-bold text-slate-700 mb-2">제1조 (개인정보의 수집·이용 목적)</h4>
                <p className="mb-4">&apos;한성 길라잡이&apos;는 다음의 목적을 위하여 개인정보를 수집 및 이용합니다. 수집한 개인정보는 다음의 목적 이외의 용도로는 사용되지 않으며, 이용 목적이 변경될 시에는 사전 동의를 구할 예정입니다.</p>
                <ul className="list-disc list-inside space-y-2 mb-4 pl-4">
                    <li>한성대학교 종합정보시스템 연동을 통한 학적 정보, 수강 과목, 성적, 시간표 데이터 조회</li>
                    <li>조회된 데이터를 기반으로 한 맞춤형 수강 로드맵 추천</li>
                    <li>학업 이수 현황 분석 및 시각화</li>
                    <li>AI 기반 과목 추천 사유 제공</li>
                    <li>서비스 이용 관련 통계 분석 및 서비스 개선</li>
                </ul>

                <h4 className="font-bold text-slate-700 mb-2">제2조 (수집하는 개인정보의 항목)</h4>
                <p className="mb-4">서비스 제공을 위해 필요한 최소한의 범위 내에서 다음과 같은 개인정보를 수집합니다.</p>
                <ul className="list-disc list-inside space-y-2 mb-4 pl-4">
                    <li><strong>필수 항목:</strong> 학번, 이름, 학과, 트랙 정보</li>
                    <li><strong>선택 항목 (사용자 동의 시):</strong> 전체 수강 내역(과목명, 학점, 성적), 학기별 시간표 정보</li>
                </ul>

                <h4 className="font-bold text-slate-700 mb-2">제3조 (개인정보의 처리 및 보유 기간)</h4>
                <p className="mb-4">
                    &apos;한성 길라잡이&apos;는 정보주체로부터 개인정보를 수집할 때 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                    <br />
                    개인정보의 처리는 서버를 거치지 않고, <strong>사용자 개인 기기(브라우저) 내에서만 안전하게 처리</strong>됩니다.
                    <br />
                    서비스 탈퇴 또는 로그아웃 시, 기기에 저장된 정보는 즉시 파기됩니다.
                </p>
                
                 <h4 className="font-bold text-slate-700 mb-2">제4조 (민감 정보 미수집 및 미저장 원칙)</h4>
                <p className="mb-4">
                    &apos;한성 길라잡이&apos;는 서비스 제공에 필요한 데이터 조회 목적 외에, 종합정보시스템 로그인에 사용되는 <strong>비밀번호를 포함한 어떠한 민감 정보도 수집, 처리, 저장하지 않습니다.</strong>
                    인증 과정은 일회성으로 사용자의 기기 내에서만 이루어집니다.
                </p>

                <h4 className="font-bold text-slate-700 mb-2">제5조 (동의를 거부할 권리 및 동의 거부에 따른 불이익)</h4>
                <p>
                    정보주체는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다.
                    <br/>
                    단, 필수 항목의 수집·이용에 대한 동의를 거부하실 경우 &apos;한성 길라잡이&apos; 서비스의 핵심 기능 이용이 제한될 수 있습니다.
                    선택 항목의 수집·이용에 동의하지 않으시는 경우, 해당 정보를 기반으로 하는 맞춤형 기능(예: 성적 기반 분석, 시간표 표시)이 제공되지 않을 수 있습니다.
                </p>
            </main>
            <footer className="p-4 border-t shrink-0 flex justify-end">
                <Button onClick={onClose} variant="primary" className="font-bold py-2 px-6">
                    확인
                </Button>
            </footer>
        </div>
    </div>
);
