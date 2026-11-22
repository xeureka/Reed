import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, BookOpenText, Keyboard, Lightning, List, ShareNetwork, Stack, X } from '@phosphor-icons/react';
import HNReels from './components/HNReels';
import { BrandLogo } from './components/BrandLogo';
import { GitHubStar } from './components/GitHubStar';
import { SourceLogo } from './components/SourceLogo';
import { ThemeToggle } from './components/ThemeToggle';
import { shareLink } from './components/shared/helpers';
import { landingContent } from './content/landing';

function Reveal({ children, className, id, tag = 'section', ariaLabel }: { children: ReactNode; className: string; id?: string; tag?: 'section' | 'footer'; ariaLabel?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const Tag = tag;
  return <Tag ref={ref as never} id={id} aria-label={ariaLabel} className={`${className} reveal ${visible ? 'is-revealed' : ''}`}>{children}</Tag>;
}

function Landing({ onStart }: { onStart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const shareLanding = async () => {
    const result = await shareLink(landingContent.meta.headline, window.location.href);
    if (result.ok) { setShared(true); window.setTimeout(() => setShared(false), 1600); }
  };
  const content = landingContent;
  const sources = content.sources.names;
  const sourceList = (hidden = false) => <div className="source-list" aria-hidden={hidden || undefined}>{sources.map((source) => <SourceLogo key={source} source={source} />)}<span className="more-source">+ more on the way</span></div>;
  return <main className="landing-shell" id="top">
    <header className="masthead">
      <div className="issue-line"><span>{content.masthead.issue}</span><span>{content.masthead.edition}</span><span>{content.masthead.tagline}</span></div>
      <nav className="landing-nav" aria-label="Main navigation">
        <a className="brand-lockup" href="#top" aria-label="Reed home"><BrandLogo /><span>reed</span></a>
        <div className={menuOpen ? 'landing-links open' : 'landing-links'}><a href="#wait-problem" onClick={() => setMenuOpen(false)}>{content.nav.wait}</a><a href="#how-it-works" onClick={() => setMenuOpen(false)}>{content.nav.how}</a><a href="#sources" onClick={() => setMenuOpen(false)}>{content.nav.sources}</a></div>
        <div className="landing-nav-actions"><button className="mobile-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>{menuOpen ? <X size={19} /> : <List size={19} />}</button><ThemeToggle /><GitHubStar /><button className="nav-button" onClick={onStart}>{content.nav.openFeed} <ArrowUpRight size={14} /></button></div>
      </nav>
    </header>

    <Reveal className="hero-section"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-rule" /> THE REED READING DESK</p><h1>{content.hero.headline[0]}<br /><em>{content.hero.headline[1]}</em></h1><p className="hero-description">{content.hero.subline}</p><div className="hero-actions"><button className="primary-button" onClick={onStart}>{content.nav.startReading} <ArrowRight size={17} weight="bold" /></button><a className="text-button" href="#how-it-works">{content.nav.seeHow} <ArrowRight size={15} /></a></div><p className="hero-tagline">{content.masthead.tagline}</p></div>
      <div className="hero-preview" aria-label="Preview of Reed for an idle moment"><div className="preview-top"><span>{content.hero.edition}</span><span>{content.hero.issue}</span></div><div className="preview-rule" /><div className="reading-status"><span className="status-dot" /> {content.hero.previewLabel}</div><span className="preview-stamp">{content.hero.source}</span><p className="preview-kicker">{content.hero.previewKicker}</p><h2>{content.hero.previewTitle}</h2><p className="preview-summary"><span className="drop-cap">R</span>{content.hero.previewSummary.slice(1)}</p><div className="preview-bottom"><span>{content.hero.readTime}</span><span>{content.hero.swipe}</span></div></div>
    </Reveal>

    <Reveal className="wait-section" id="wait-problem"><div className="section-intro"><p className="eyebrow"><span className="eyebrow-rule" /> {content.wait.eyebrow}</p><h2>{content.wait.title[0]}<br /><em>{content.wait.title[1]}</em></h2></div><div className="wait-lines">{content.wait.lines.map((line) => <p key={line}>{line}</p>)}</div></Reveal>

    <Reveal className="gap-section" id="fits-the-gap"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-rule" /> {content.gap.eyebrow}</p><h2>{content.gap.title[0]}<br /><em>{content.gap.title[1]}</em></h2></div><p className="section-deck">{content.gap.deck}</p></div><div className="gap-grid">{content.gap.lengths.map(([time, title, description]) => <article key={time}><span className="gap-time">{time}</span><strong>{title}</strong><p>{description}</p></article>)}</div></Reveal>

    <Reveal className="how-section" id="how-it-works"><div className="section-intro"><p className="eyebrow"><span className="eyebrow-rule" /> {content.how.eyebrow}</p><h2>{content.how.title[0]}<br /><em>{content.how.title[1]}</em></h2></div><div className="steps">{content.how.steps.map(([title, description], index) => <article key={title}><span className="step-number">{String(index + 1).padStart(2, '0')}</span>{index === 0 ? <Lightning size={22} /> : index === 1 ? <BookOpenText size={22} /> : <ArrowUpRight size={22} />}<h3>{title}</h3><p>{description}</p></article>)}</div></Reveal>

    <Reveal className="source-marquee" id="sources" ariaLabel="Reed sources"><span className="marquee-label">{content.sources.label.split(', ')[0]},<br />{content.sources.label.split(', ').slice(1).join(', ')}</span><div className="source-viewport"><div className="source-track">{sourceList()}{sourceList(true)}</div></div></Reveal>

    <Reveal className="feature-section" id="features"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-rule" /> {content.features.eyebrow}</p><h2>{content.features.title[0]}<br />{content.features.title[1]}</h2></div><p className="section-deck">{content.features.deck}</p></div><div className="feature-grid">{content.features.items.map(([title, description], index) => <article key={title}><span className="feature-number">{String(index + 1).padStart(2, '0')}</span>{index === 0 ? <BookOpenText size={22} /> : index === 1 ? <Lightning size={22} /> : index === 2 ? <Stack size={22} /> : <Keyboard size={22} />}<h3>{title}</h3><p>{description}</p></article>)}</div></Reveal>

    <Reveal className="why-section" id="about"><div className="why-mark-stage reading-gap-card" aria-label="Reading for the in-between"><div className="reading-gap-top"><span>READING GAP</span><span>READY</span></div><div className="reading-gap-rule" /><p>Make the<br /><em>minutes count.</em></p><div className="reading-gap-lines"><i /><i /><i /></div><div className="reading-gap-bottom"><span>READ THE NEXT THING</span><ArrowUpRight size={15} /></div></div><div className="why-copy"><p className="eyebrow"><span className="eyebrow-rule" /> {content.about.eyebrow}</p><h2>{content.about.title[0]}<br /><em>{content.about.title[1]}</em></h2><p>{content.about.body}</p><a className="text-button" href="https://github.com/xeureka" target="_blank" rel="noreferrer">{content.about.link} <ArrowUpRight size={15} /></a></div></Reveal>

    <Reveal className="feature-section roadmap-section" id="roadmap"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-rule" /> {content.roadmap.eyebrow}</p><h2>{content.roadmap.title[0]}<br /><em>{content.roadmap.title[1]}</em></h2></div></div><div className="feature-grid">{content.roadmap.items.map(([title, description]) => <article key={title}><span className="source-pill">{content.roadmap.badge}</span><h3>{title}</h3><p>{description}</p></article>)}</div></Reveal>

    <Reveal className="final-cta"><p className="eyebrow"><span className="eyebrow-rule" /> {content.final.eyebrow}</p><h2>{content.final.title[0]}<br /><em>{content.final.title[1]}</em></h2><button className="primary-button" onClick={onStart}>{content.nav.startReading} <ArrowRight size={17} weight="bold" /></button><button className="share-button" type="button" onClick={shareLanding}><ShareNetwork size={16} /> {shared ? content.final.copied : content.final.share}</button></Reveal>
    <Reveal tag="footer" className="landing-footer"><span>{content.footer.copyright}</span><a href="https://eureka.et" target="_blank" rel="noreferrer">{content.footer.creator} <ArrowUpRight size={13} /></a><span>{content.footer.note}</span></Reveal>
  </main>;
}

function App() {
  const [isReader, setIsReader] = useState(() => window.location.hash === '#read');
  useEffect(() => { const syncRoute = () => setIsReader(window.location.hash === '#read'); window.addEventListener('hashchange', syncRoute); return () => window.removeEventListener('hashchange', syncRoute); }, []);
  useEffect(() => { const saved = localStorage.getItem('reed-theme'); document.documentElement.dataset.theme = saved === 'dark' ? 'dark' : 'light'; }, []);
  const openReader = () => { window.location.hash = 'read'; setIsReader(true); };
  return <>{isReader ? <HNReels onBack={() => { window.location.hash = ''; setIsReader(false); }} /> : <Landing onStart={openReader} />}</>;
}

export default App;
