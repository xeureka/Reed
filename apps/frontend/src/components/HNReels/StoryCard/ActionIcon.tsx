import type { ReactNode, MouseEventHandler } from "react";

interface ActionIconProps {
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

export const ActionIcon = ({ label, onClick, children }: ActionIconProps) => (
  <button
    onClick={onClick}
    className="action-button"
    aria-label={label}
    title={label}
    type="button"
  >
    {children}
    <span>{label}</span>
  </button>
);
