import './DiscordCTA.css';
import { site } from '../config/site';

const DiscordCTA = () => {
  return (
    <a
      href={site.socials.discord}
      target="_blank"
      rel="noopener noreferrer"
      className="discord-cta"
    >
      <div className="discord-cta-icon">
        <img src="/icons/social/discord.svg" alt="Discord" />
      </div>
      <div className="discord-cta-content">
        <span className="discord-cta-label">Join our Community</span>
        <span className="discord-cta-sub">Chat with players & staff</span>
      </div>
      <div className="discord-cta-arrow">→</div>
    </a>
  );
};

export default DiscordCTA;

