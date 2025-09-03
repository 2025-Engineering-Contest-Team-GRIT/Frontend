import React, { useState } from 'react';
import { IconCheck, IconRefreshCw } from './common';
// react-icons 라이브러리에서 필요한 아이콘을 가져옵니다.
import {
    LuUser,
    LuChevronRight,
    LuMap,
    LuCalendar,
    LuLayoutDashboard,
    LuLogOut,
    LuSparkles,
    LuGraduationCap,
    LuCheck,
    LuClock,
    LuPlus,
    LuBookOpen,
    LuCompass,
    LuLock,
    LuRocket,
    LuTarget,
    LuServer,
    LuShield,
    LuGamepad2,
    LuClub,
    LuCpu,
    LuChevronDown,
    LuTag,
    LuTrophy,
    LuBriefcase,
    LuFastForward,
    LuSettings,
    LuTriangle,
    LuX,
    LuShare2,
    LuLink,
    LuCopy,
    LuEye,
    LuEyeOff,
    LuArrowLeft,
    LuGlobe,
    LuRefreshCw,
    LuStar,
    LuMapPin,
    LuSearch,
} from 'react-icons/lu';

import { BiBarChart } from 'react-icons/bi';

// 각 아이콘을 export하여 다른 컴포넌트에서 직접 import할 수 있도록 합니다.
export {
    LuUser as IconUser,
    LuChevronRight as IconChevronRight,
    LuMap as IconMap,
    LuCalendar as IconCalendar,
    LuLayoutDashboard as IconDashboard,
    LuLogOut as IconLogOut,
    LuSparkles as IconSparkles,
    LuGraduationCap as IconMortarBoard,
    LuCheck as IconCheck,
    LuClock as IconClock,
    LuPlus as IconPlus,
    LuBookOpen as IconBook,
    LuCompass as IconCompass,
    LuLock as IconLock,
    LuRocket as IconRocket,
    LuTarget as IconTarget,
    LuServer as IconServer,
    LuShield as IconShield,
    LuGamepad2 as IconGamepad,
    LuClub as IconCube,
    LuCpu as IconCpu,
    LuChevronDown as IconChevronDown,
    LuTag as IconTag,
    LuTrophy as IconTrophy,
    LuBriefcase as IconBriefcase,
    LuFastForward as IconFastForward,
    LuSettings as IconSettings,
    LuTriangle as IconAlertTriangle,
    LuX as IconX,
    BiBarChart as IconBarChart2,
    LuShare2 as IconShare2,
    LuLink as IconLink,
    LuCopy as IconCopy,
    LuEye as IconEye,
    LuEyeOff as IconEyeOff,
    LuArrowLeft as IconArrowLeft,
    LuGlobe as IconWorld,
    LuRefreshCw as IconRefreshCw,
    LuStar as IconStar,
    LuMapPin as IconMapPin,
    LuSearch as IconSearch,
};

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200/80 ${className}`}>
    {children}
  </div>
);

export const RefreshButton = ({ onRefresh, text, className = '' }: { onRefresh: () => Promise<void>, text: string, className?: string }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleClick = async () => {
        if (isLoading || isDone) return;
        setIsLoading(true);
        try {
            await new Promise(res => setTimeout(res, 1200));
            await onRefresh();
            setIsDone(true);
        } catch (error) {
            console.error("Refresh failed", error);
        } finally {
            setIsLoading(false);
            setTimeout(() => setIsDone(false), 2000);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg transition-all duration-300 disabled:opacity-70 ${
                isDone
                    ? 'bg-emerald-100 text-emerald-700'
                    : isLoading 
                    ? 'bg-slate-200 text-slate-500 cursor-wait' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            } ${className}`}
        >
            {isDone ? (
                <>
                    <IconCheck className="w-4 h-4" />
                    <span>완료!</span>
                </>
            ) : isLoading ? (
                <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>{text}...</span>
                </>
            ) : (
                <>
                    <IconRefreshCw className="w-4 h-4" />
                    <span>{text}</span>
                </>
            )}
        </button>
    );
};
