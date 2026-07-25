import type { ReactNode, MouseEventHandler } from "react";

interface ActionIconProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export const ActionIcon = ({ label, onClick, children }: ActionIconProps) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 px-2 py-1 rounded-2xl hover:bg-white/10 active:scale-95 transition"
    aria-label={label}
    title={label}
    type="button"
  >
    {children}
    <span className="text-[10px] opacity-70">{label}</span>
  </button>
);
