import { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '../firebase';
import './Page.css';
import './Schedule.css';

const getMapLine = (match) => {
  // Support a few possible shapes without requiring schema changes.
  const raw =
    match?.mapScores ??
    match?.map_scores ??
    match?.mapscores ??
    match?.maps ??
    match?.mapResults ??
    match?.map_results ??
    match?.mapScoreLine ??
    match?.map_score_line ??
    null;

  if (!raw) return '';
  if (typeof raw === 'string') return raw;
  if (Array.isArray(raw)) {
    // Array of strings or objects.
    const parts = raw
      .map((m) => {
        if (!m) return null;
        if (typeof m === 'string') return m;
        if (typeof m === 'object') {
          if (typeof m.score === 'string') return m.score;
          const a = m.our ?? m.us ?? m.left ?? m.a;
          const b = m.opponent ?? m.them ?? m.right ?? m.b;
          if (a != null && b != null) return `${a}-${b}`;
        }
        return null;
      })
      .filter(Boolean);
    return parts.join(' / ');
  }
  return '';
};

const Schedule = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming | past | all
  const [layout, setLayout] = useState(() => {
    try {
      return localStorage.getItem('scheduleLayout') || 'list'; // list | cards
    } catch {
      return 'list';
    }
  });
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'matches'), orderBy('date', 'desc'));
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMatches(rows);
      } catch (e) {
        console.error('Schedule fetch error:', e);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scheduleLayout', layout);
    } catch {
      // ignore
    }
  }, [layout]);

  const items = useMemo(() => {
    const now = new Date();
    if (filter === 'all') return matches;
    if (filter === 'past') return matches.filter((m) => m.date?.toDate?.() <= now);
    return matches.filter((m) => m.date?.toDate?.() > now).sort((a, b) => a.date.toDate() - b.date.toDate());
  }, [matches, filter]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-hero">
          <span className="kicker">Matches</span>
          <h1 className="h2 page-hero-title">Schedule</h1>
          <p className="page-hero-subtitle">
            VALORANT fixtures and results—streams and VLR links when available.
          </p>
        </div>

        <div className="schedule-toolbar">
          <div className="tabs" role="tablist" aria-label="Schedule filters">
            <button className={`tab ${filter === 'upcoming' ? 'active' : ''}`} onClick={() => setFilter('upcoming')} type="button">
              Upcoming
            </button>
            <button className={`tab ${filter === 'past' ? 'active' : ''}`} onClick={() => setFilter('past')} type="button">
              Results
            </button>
            <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')} type="button">
              All
            </button>
          </div>

          <div className="schedule-layout-toggle" role="group" aria-label="Schedule layout">
            <button
              className={`layout-btn ${layout === 'list' ? 'active' : ''}`}
              onClick={() => setLayout('list')}
              type="button"
            >
              List
            </button>
            <button
              className={`layout-btn ${layout === 'cards' ? 'active' : ''}`}
              onClick={() => setLayout('cards')}
              type="button"
            >
              Cards
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty">Loading schedule…</div>
        ) : items.length === 0 ? (
          <div className="empty">No matches found for this view.</div>
        ) : (
          <>
            {layout === 'list' ? (
              <div className="schedule-list">
                {items.map((m) => {
                  const dt = m.date?.toDate?.() ?? null;
                  const isPast = dt ? dt <= new Date() : false;
                  const our = Number(m.ourScore) || 0;
                  const opp = Number(m.opponentScore) || 0;
                  const isWin = our > opp;
                  const mapLine = getMapLine(m);

                  return (
                    <article key={m.id} className={`match-row ${isPast ? 'past' : 'upcoming'} ${isPast ? (isWin ? 'win' : 'loss') : ''}`}>
                      <div className="match-row-left">
                        <div className="match-row-date">{dt ? format(dt, 'dd.MM.yyyy') : 'TBD'}</div>
                        <div className="match-row-event">{m.tournament || 'Tournament TBA'}</div>
                        <div className="match-row-sub">
                          {dt ? format(dt, 'HH:mm') : null}
                          {dt && m.streamLink ? <span className="dot">•</span> : null}
                          {m.streamLink ? (
                            <a className="hint hint-link" href={m.streamLink} target="_blank" rel="noopener noreferrer">
                              Stream
                            </a>
                          ) : null}
                          {m.vlrLink ? <span className="dot">•</span> : null}
                          {m.vlrLink ? (
                            <a className="hint hint-link" href={m.vlrLink} target="_blank" rel="noopener noreferrer">
                              VLR
                            </a>
                          ) : null}
                        </div>
                      </div>

                      <div className="match-row-team match-row-bodax">
                        <div className="match-row-logo">
                          <img src="/icons/logos/bodax-gaming_logo_2.svg" alt="BODAX GAMING" />
                        </div>
                        <div className="match-row-team-name">BODAX GAMING</div>
                      </div>

                      <div className="match-row-center">
                        <div className="match-row-score">{isPast ? `${our} : ${opp}` : 'VS'}</div>
                        {mapLine ? <div className="match-row-maps">{mapLine}</div> : <div className="match-row-maps muted">—</div>}
                      </div>

                      <div className="match-row-team match-row-opponent-col">
                        <div className="match-row-logo">
                          {m.opponentLogoUrl ? (
                            <img src={m.opponentLogoUrl} alt={m.opponent || 'Opponent'} />
                          ) : (
                            <div className="match-row-logo-fallback">{(m.opponent || 'TBA').slice(0, 3).toUpperCase()}</div>
                          )}
                        </div>
                        <div className="match-row-team-name">{m.opponent || 'TBA'}</div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="schedule-cards" role="list">
                {items.map((m) => {
                  const dt = m.date?.toDate?.() ?? null;
                  const isPast = dt ? dt <= new Date() : false;
                  const our = Number(m.ourScore) || 0;
                  const opp = Number(m.opponentScore) || 0;
                  const isWin = our > opp;
                  const dateLine = dt ? format(dt, 'dd.MM.yyyy • HH:mm') : 'TBD';
                  const game = (m.game || m.title || 'VALORANT').toString();

                  return (
                    <article
                      key={m.id}
                      role="listitem"
                      className={`schedule-card ${isPast ? 'past' : 'upcoming'} ${isPast ? (isWin ? 'win' : 'loss') : ''}`}
                    >
                      <div className="schedule-card-top">
                        <div className="schedule-card-game">{game}</div>
                        <div className="schedule-card-league">{m.tournament || 'Tournament TBA'}</div>
                      </div>

                      <div className="schedule-card-mid">
                        <div className="schedule-card-team">
                          <div className="schedule-card-badge">
                            <img src="/icons/logos/bodax-gaming_logo_2.svg" alt="BODAX GAMING" />
                          </div>
                          <div className="schedule-card-name">BODAX GAMING</div>
                        </div>

                        <div className="schedule-card-center">
                          <div className="schedule-card-date">{dateLine}</div>
                          {isPast ? (
                            <>
                              <div className="schedule-card-result">{isWin ? 'Victory' : 'Defeat'}</div>
                              <div className="schedule-card-score">
                                {our} <span className="x">x</span> {opp}
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="schedule-card-result upcoming">Upcoming</div>
                              <div className="schedule-card-score time">{dt ? format(dt, 'HH:mm') : 'TBD'}</div>
                            </>
                          )}
                        </div>

                        <div className="schedule-card-team right">
                          <div className="schedule-card-badge">
                            {m.opponentLogoUrl ? (
                              <img src={m.opponentLogoUrl} alt={m.opponent || 'Opponent'} />
                            ) : (
                              <div className="schedule-card-badge-fallback">{(m.opponent || 'TBA').slice(0, 3).toUpperCase()}</div>
                            )}
                          </div>
                          <div className="schedule-card-name">{m.opponent || 'TBA'}</div>
                        </div>
                      </div>

                      {(m.streamLink || m.vlrLink) && (
                        <div className="schedule-card-actions">
                          {m.streamLink ? (
                            <a className="btn btn-primary" href={m.streamLink} target="_blank" rel="noopener noreferrer">
                              Watch
                            </a>
                          ) : null}
                          {m.vlrLink ? (
                            <a className="btn" href={m.vlrLink} target="_blank" rel="noopener noreferrer">
                              VLR
                            </a>
                          ) : null}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Schedule;


