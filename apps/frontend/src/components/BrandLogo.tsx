interface BrandLogoProps { className?: string; }

export function BrandLogo({ className = '' }: BrandLogoProps) {
  return <img className={`brand-logo ${className}`} src="/reed-logo.svg" alt="" aria-hidden="true" />;
}
