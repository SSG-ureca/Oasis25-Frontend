import React, { useState } from "react";
import { createPortal } from "react-dom";

interface FloatingTooltipProps {
  show: boolean;
  x: number;
  y: number;
  children: React.ReactNode;
}

export const FloatingTooltip = ({
  show,
  x,
  y,
  children,
}: FloatingTooltipProps) => {
  if (!show) return null;

  return createPortal(
    <div
      className="fixed pointer-events-none z-[9999] px-3.5 py-2 bg-bg-light/95 backdrop-blur-sm text-[11px] font-bold rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex items-center gap-1.5 transition-transform duration-75 ease-out select-none whitespace-nowrap"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}>
      {children}
    </div>,
    document.body,
  );
};

interface RestrictedAreaProps {
  isRestricted: boolean;
  tooltipText?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const RestrictedArea = ({
  isRestricted,
  tooltipText,
  children,
  className = "",
}: RestrictedAreaProps) => {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
  }>({ show: false, x: 0, y: 0 });

  if (!isRestricted) {
    return <>{children}</>;
  }

  return (
    <div
      onMouseEnter={() => {
        setTooltip({ show: true, x: 0, y: 0 });
      }}
      onMouseMove={(e) => {
        setTooltip((prev) => ({
          ...prev,
          x: e.clientX + 12,
          y: e.clientY + 12,
        }));
      }}
      onMouseLeave={() => {
        setTooltip((prev) => ({ ...prev, show: false }));
      }}
      className={`relative cursor-not-allowed ${className}`}>
      <div className="pointer-events-none">{children}</div>
      <FloatingTooltip show={tooltip.show} x={tooltip.x} y={tooltip.y}>
        {tooltipText || (
          <span className="text-text-muted">로그인이 필요한 기능입니다</span>
        )}
      </FloatingTooltip>
    </div>
  );
};

export default RestrictedArea;
