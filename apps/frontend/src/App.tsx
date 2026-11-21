import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { ArrowRight, ArrowUpRight, BookOpenText, GithubLogo, Keyboard, Lightning, List, ShareNetwork, Sparkle, Stack, X } from '@phosphor-icons/react';
import HNReels from './components/HNReels';
import { BrandLogo } from './components/BrandLogo';
import { GitHubStar } from './components/GitHubStar';
import { SourceLogo } from './components/SourceLogo';
import { ThemeToggle } from './components/ThemeToggle';
import { shareLink } from './components/shared/helpers';

const HERO_HEADLINE = <>Your agent is coding.<br /><em>Go read something.</em></>;

function Reveal({ children, className, id }: { children: ReactNode; className: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const whyVisibilityClass = className === 'why-section' && visible ? 'is-visible' : '';
  return <section ref={ref} id={id} className={`${className} reveal ${visible ? 'is-revealed' : ''} ${whyVisibilityClass}`}>{children}</section>;
}

function Landing({ onStart }: { onStart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const shareLanding = async () => {
    const result = await shareLink('Your agent is coding. Go read something. — Reed', window.location.href);
    if (result.ok) { setShared(true); window.setTimeout(() => setShared(false), 1600); }
  };
  return <main className="landing-shell" id="top">
    <header className="masthead">
      <div className="issue-line"><span>Vol. 1 · No. 47</span><span>Thursday · Reed Press</span><span>Stop doom-scrolling. Start smart-scrolling.</span></div>
      <nav className="landing-nav" aria-label="Main navigation">
        <a className="brand-lockup" href="#top" aria-label="Reed home"><BrandLogo /><span>reed</span></a>
        <div className={menuOpen ? 'landing-links open' : 'landing-links'}><a href="#wait-problem" onClick={() => setMenuOpen(false)}>The wait</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href="#sources" onClick={() => setMenuOpen(false)}>Sources</a></div>
        <div className="landing-nav-actions"><button className="mobile-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>{menuOpen ? <X size={19} /> : <List size={19} />}</button><ThemeToggle /><GitHubStar /><button className="nav-button" onClick={onStart}>Open the feed <ArrowUpRight size={14} /></button></div>
      </nav>
    </header>

    <section className="hero-section">
      <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-rule" /> THE REED READING DESK</p><h1>{HERO_HEADLINE}</h1><p className="hero-description">Useful tech reading for the minutes your coding agent takes to finish.</p><div className="hero-actions"><button className="primary-button" onClick={onStart}>Start reading <ArrowRight size={17} weight="bold" /></button><a className="text-button" href="#how-it-works">See how it works <ArrowRight size={15} /></a></div><p className="hero-tagline">Stop doom-scrolling. Start smart-scrolling.</p></div>
      <div className="hero-preview" aria-label="Preview of Reed while an agent runs"><div className="preview-top"><span>REED / AGENT GAP EDITION</span><span>01 / 05</span></div><div className="preview-rule" /><div className="agent-status"><span className="status-dot" /> claude ▸ refactoring 14 files… <b>(est. 4 min)</b></div><span className="preview-stamp">HACKER NEWS</span><p className="preview-kicker">WHILE YOUR AGENT RUNS</p><h2>The best ideas deserve more than a headline.</h2><p className="preview-summary"><span className="drop-cap">R</span>eed gives useful stories room to breathe, then lets you decide whether they’re worth the full read.</p><div className="preview-bottom"><span>4 MIN READ</span><span>SWIPE ↓</span></div></div>
    </section>

    <Reveal className="wait-section" id="wait-problem"><div className="section-intro"><p className="eyebrow"><span className="eyebrow-rule" /> THE WAIT PROBLEM</p><h2>Your agent waits.<br /><em>So do you.</em></h2></div><div className="wait-lines"><p>Agent starts. You open TikTok.</p><p>Forty minutes later, you know everything about pressure-washing driveways.</p><p>The build finishes. Your brain is somewhere else.</p></div></Reveal>

    <Reveal className="gap-section" id="fits-the-gap"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-rule" /> FITS THE GAP</p><h2>Read at the<br /><em>run time.</em></h2></div><p className="section-deck">Reed reads fit your agent’s run time. Pick up a card. Put it down when the ping arrives.</p></div><div className="gap-grid"><article><span className="gap-time">30 SEC</span><strong>1 card</strong><p>A quick signal between tool calls.</p></article><article><span className="gap-time">2 MIN</span><strong>5 cards</strong><p>Enough context for a coffee refill.</p></article><article><span className="gap-time">10 MIN</span><strong>Deep read</strong><p>Let the agent cook. Follow a thread.</p></article></div></Reveal>

    <Reveal className="how-section" id="how-it-works"><div className="section-intro"><p className="eyebrow"><span className="eyebrow-rule" /> HOW IT WORKS</p><h2>Start the agent.<br /><em>Open Reed.</em></h2></div><div className="steps"><article><span className="step-number">01</span><Lightning size={22} /><h3>Start the agent</h3><p>Claude, Codex, Cursor, Copilot. Let it run.</p></article><article><span className="step-number">02</span><BookOpenText size={22} /><h3>Swipe, skim, learn</h3><p>Short summaries. Full stories when they earn it.</p></article><article><span className="step-number">03</span><ArrowUpRight size={22} /><h3>Come back when it pings</h3><p>Your code is ready. Your context is still there.</p></article></div></Reveal>

    <section className="source-marquee" id="sources" aria-label="Reed sources"><span className="marquee-label">Real tech news,<br />not random content.</span><div className="source-viewport"><div className="source-track"><div className="source-list"><SourceLogo source="Hacker News" /><SourceLogo source="Lobsters" /><SourceLogo source="DEV Community" /><SourceLogo source="Hashnode" /><SourceLogo source="Reddit" /><SourceLogo source="Stack Overflow" /><SourceLogo source="Cloudflare" /><SourceLogo source="GitHub" /><SourceLogo source="Vercel" /><SourceLogo source="Netflix" /><SourceLogo source="SO Blog" /><SourceLogo source="Mozilla" /><span className="more-source">+ more on the way</span></div><div className="source-list" aria-hidden="true"><SourceLogo source="Hacker News" /><SourceLogo source="Lobsters" /><SourceLogo source="DEV Community" /><SourceLogo source="Hashnode" /><SourceLogo source="Reddit" /><SourceLogo source="Stack Overflow" /><SourceLogo source="Cloudflare" /><SourceLogo source="GitHub" /><SourceLogo source="Vercel" /><SourceLogo source="Netflix" /><SourceLogo source="SO Blog" /><SourceLogo source="Mozilla" /><span className="more-source">+ more on the way</span></div></div></div></section>

    <Reveal className="feature-section" id="features"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-rule" /> IN THIS ISSUE</p><h2>Useful while<br />you <em>wait.</em></h2></div><p className="section-deck">No feed archaeology. No random content. Just a good next card.</p></div><div className="feature-grid"><article><span className="feature-number">01</span><BookOpenText size={22} /><h3>Full-screen cards.</h3><p>One story gets the whole page.</p></article><article><span className="feature-number">02</span><Lightning size={22} /><h3>Short summaries.</h3><p>Know the point before the tab opens.</p></article><article><span className="feature-number">03</span><Stack size={22} /><h3>Many sources.</h3><p>HN, Lobsters, DEV, Reddit and engineering blogs.</p></article><article><span className="feature-number">04</span><Keyboard size={22} /><h3>Swipe or J/K.</h3><p>Touch, wheel, arrows. Keep your hands moving.</p></article></div></Reveal>

    <Reveal className="why-section" id="about"><div className="why-mark-stage agent-gap-card" aria-label="Agent gap reading status"><div className="agent-gap-top"><span>AGENT GAP</span><span>READY</span></div><div className="agent-gap-rule" /><p>While your<br /><em>agent runs.</em></p><div className="agent-gap-lines"><i /><i /><i /></div><div className="agent-gap-bottom"><span>READ THE NEXT THING</span><ArrowUpRight size={15} /></div></div><div className="why-copy"><p className="eyebrow"><span className="eyebrow-rule" /> BUILT BY A DEV</p><h2>I hated my own<br /><em>scrolling habit.</em></h2><p>I made Reed for the awkward gap between “agent is running” and “agent is done.” It is a small reading desk for getting your brain back on the work.</p><a className="text-button" href="https://github.com/xeureka" target="_blank" rel="noreferrer">Meet Eureka on GitHub <ArrowUpRight size={15} /></a></div></Reveal>

    <section className="final-cta"><p className="eyebrow"><span className="eyebrow-rule" /> THE NEXT EDITION IS WAITING</p><h2>Your agent will finish<br /><em>without you.</em></h2><button className="primary-button" onClick={onStart}>Start reading <ArrowRight size={17} weight="bold" /></button><button className="share-button" type="button" onClick={shareLanding}><ShareNetwork size={16} /> {shared ? 'Link copied' : 'Share Reed'}</button></section>
    <footer className="landing-footer"><span>© 2026 Reed Press</span><a href="https://eureka.et" target="_blank" rel="noreferrer">Made By Eureka <ArrowUpRight size={13} /></a><span>Made for the agent gap</span></footer>
  </main>;
}

function App() {
  const [isReader, setIsReader] = useState(() => window.location.hash === '#read');
  useEffect(() => { const syncRoute = () => setIsReader(window.location.hash === '#read'); window.addEventListener('hashchange', syncRoute); return () => window.removeEventListener('hashchange', syncRoute); }, []);
  useEffect(() => { const saved = localStorage.getItem('reed-theme'); document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light'; }, []);
  const openReader = () => { window.location.hash = 'read'; setIsReader(true); };
  return <><>{isReader ? <HNReels onBack={() => { window.location.hash = ''; setIsReader(false); }} /> : <Landing onStart={openReader} />}</><Analytics /></>;
}

export default App;
