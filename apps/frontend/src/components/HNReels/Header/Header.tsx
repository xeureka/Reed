import { ArrowLeft, Radio } from '@phosphor-icons/react';
import { BrandLogo } from '../../BrandLogo';
import { ThemeToggle } from '../../ThemeToggle';

interface HeaderProps { onBack: () => void; }

const Header = ({ onBack }: HeaderProps) => (
  <header className="reader-header">
    <button className="reader-back" onClick={onBack} type="button" aria-label="Back to Reed home"><ArrowLeft size={15} weight="bold" aria-hidden="true" /> home</button>
    <div className="reader-title"><BrandLogo className="small-mark" /><span>reed</span></div>
    <div className="reader-tools"><div className="reader-status"><Radio size={12} weight="fill" aria-hidden="true" /> live feed</div><ThemeToggle /></div>
  </header>
);

export default Header;
