import { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import Timer from '../components/Timer';
import Game from '../components/Game';

const THEME_KEY = 'boreddoro-theme';

const Home: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="app-wrap">
          <header className="header">
            <div className="header-row">
              <div className="logo">
                <span className="logo-icon" aria-hidden="true">🦥</span>
                <h1>Bored Doro</h1>
              </div>
              <button
                type="button"
                className="theme-toggle"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
                aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
            <p className="motto">Time to bore you.</p>
          </header>

          <main className="main">
            <section className="timer-section">
              <Timer />
            </section>

            <section className="game-section">
              <p className="game-label">Or play while you wait</p>
              <Game theme={theme} />
              <p className="game-hint">Jump over the bones. That’s it.</p>
            </section>
          </main>

          <footer className="footer">
            <p>You don’t have to be productive. You’re allowed to be bored. 🦥</p>
            <div className="footer-links">
              <a
                href="https://buymeacoffee.com/kolmanfreei"
                target="_blank"
                rel="noopener noreferrer"
                className="support-link"
              >
                <span className="support-icon" aria-hidden="true">☕</span>
                Support
              </a>
              <a
                href="https://github.com/sponsors/Kolman-Freecss"
                target="_blank"
                rel="noopener noreferrer"
                className="support-link"
              >
                <span className="support-icon" aria-hidden="true">❤️</span>
                GitHub Sponsors
              </a>
            </div>
          </footer>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
