import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import { site } from '../config/site';
import './News.css';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchNews();
  }, []);

  const SOCIAL_PLATFORMS = ['x', 'twitter', 'tiktok', 'discord', 'youtube', 'twitch', 'instagram'];

  const fetchNews = async () => {
    try {
      const newsRef = collection(db, 'news');
      const q = query(newsRef, orderBy('date', 'desc'), limit(50));
      const snapshot = await getDocs(q);
      
      let newsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // If no news items exist, show placeholder social media feed
      if (newsData.length === 0) {
        newsData = [
          { id: 'social-x', title: 'Follow us on X', link: site.socials.x, platform: 'x', date: new Date(), image: '/icons/social/x.svg', content: 'Stay updated with the latest announcements and match results.' },
          { id: 'social-tiktok', title: 'Watch highlights on TikTok', link: site.socials.tiktok, platform: 'tiktok', date: new Date(), image: '/icons/social/tiktok.svg', content: 'Catch the best plays and behind-the-scenes moments.' },
          { id: 'social-discord', title: 'Join our Community', link: site.socials.discord, platform: 'discord', date: new Date(), image: '/icons/social/discord.svg', content: 'Chat with players, staff, and other fans in our Discord server.' },
          { id: 'social-twitch', title: 'Watch Live', link: site.socials.twitch, platform: 'twitch', date: new Date(), image: '/icons/social/twitch.svg', content: 'Tune in to our live broadcasts and support the team.' },
          { id: 'social-insta', title: 'Follow on Instagram', link: site.socials.instagram, platform: 'instagram', date: new Date(), image: '/icons/social/instagram.svg', content: 'See photos from events and daily life.' },
          { id: 'social-yt', title: 'Subscribe on YouTube', link: site.socials.youtube, platform: 'youtube', date: new Date(), image: '/icons/social/youtube.svg', content: 'Watch VODs, guides, and other video content.' },
        ].filter(i => Boolean(i.link));
      }

      setNewsItems(newsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback data
      const fallbackData = [
          { id: 'social-x', title: 'Follow us on X', link: site.socials.x, platform: 'x', date: new Date(), image: '/icons/social/x.svg', content: 'Stay updated with the latest announcements and match results.' },
          { id: 'social-tiktok', title: 'Watch highlights on TikTok', link: site.socials.tiktok, platform: 'tiktok', date: new Date(), image: '/icons/social/tiktok.svg', content: 'Catch the best plays and behind-the-scenes moments.' },
          { id: 'social-discord', title: 'Join our Community', link: site.socials.discord, platform: 'discord', date: new Date(), image: '/icons/social/discord.svg', content: 'Chat with players, staff, and other fans in our Discord server.' },
      ].filter(i => Boolean(i.link));
      
      setNewsItems(fallbackData);
      setLoading(false);
    }
  };

  const getLinkProps = (item) => {
    const isInternal = !SOCIAL_PLATFORMS.includes(item.platform) || item.platform === 'news';
    const Wrapper = isInternal ? Link : 'a';
    const props = isInternal 
      ? { to: `/news/${item.id}` }
      : { href: item.link || '#', target: item.link ? "_blank" : undefined, rel: item.link ? "noopener noreferrer" : undefined };
    return { Wrapper, props, isInternal };
  };

  const formatDate = (date) => {
    return date 
      ? format(date?.toDate ? date.toDate() : new Date(date), 'MMM d, yyyy')
      : '—';
  };

  const mainFeatured = newsItems.length > 0 ? newsItems[0] : null;
  const subFeatured = newsItems.length > 1 ? newsItems.slice(1, 4) : [];
  
  // Calculate recent news based on filter
  const remainingItems = newsItems.length > 4 ? newsItems.slice(4) : [];
  let recentNews = [];
  
  if (selectedCategory === 'all') {
    recentNews = remainingItems;
  } else if (selectedCategory === 'social') {
    recentNews = remainingItems.filter(item => SOCIAL_PLATFORMS.includes(item.platform));
  } else if (selectedCategory === 'news') {
    recentNews = remainingItems.filter(item => !SOCIAL_PLATFORMS.includes(item.platform) || item.platform === 'news');
  }

  return (
    <div className="news-page">
      <div className="container">
        {/* Featured Section */}
        <section className="featured-news-section">
          
          <div className="featured-grid">
            {/* Main Featured (Left) */}
            <div className="main-featured-col">
              {mainFeatured && (() => {
                const { Wrapper, props, isInternal } = getLinkProps(mainFeatured);
                return (
                  <Wrapper className="main-featured-card" {...props}>
                    <div className="main-featured-image">
                      {mainFeatured.image ? (
                        <img src={mainFeatured.image} alt="" />
                      ) : (
                        <div className="placeholder-image" />
                      )}
                    </div>
                    <div className="main-featured-content">
                      <div className="news-meta">
                        {mainFeatured.platform && <span className="news-platform">{mainFeatured.platform}</span>}
                        <span className="news-dot">•</span>
                        <span className="news-date">{formatDate(mainFeatured.date)}</span>
                      </div>
                      <h3 className="main-featured-title">{mainFeatured.title}</h3>
                      <span className="read-more-link">{isInternal ? 'Read Article' : 'Read More'} <span>→</span></span>
                    </div>
                  </Wrapper>
                );
              })()}
            </div>

            {/* Sub Featured (Right) */}
            <div className="sub-featured-col">
              {subFeatured.map(item => {
                const { Wrapper, props } = getLinkProps(item);
                return (
                  <Wrapper key={item.id} className="sub-featured-card" {...props}>
                    <div className="sub-featured-image">
                      {item.image ? (
                        <img src={item.image} alt="" />
                      ) : (
                        <div className="placeholder-image" />
                      )}
                    </div>
                    <div className="sub-featured-content">
                      <h4 className="sub-featured-title">{item.title}</h4>
                      <div className="news-meta small">
                        <span className="news-date">{formatDate(item.date)}</span>
                      </div>
                    </div>
                  </Wrapper>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent News Section */}
        <section className="recent-news-section">
          <div className="recent-header-row">
            <h2 className="section-header">Recent News</h2>
            <div className="news-filters">
              <button 
                className={`filter-text-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All News
              </button>
              <button 
                className={`filter-text-btn ${selectedCategory === 'social' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('social')}
              >
                Social
              </button>
              <button 
                className={`filter-text-btn ${selectedCategory === 'news' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('news')}
              >
                Articles
              </button>
            </div>
          </div>

          <div className="recent-news-grid">
            {recentNews.length > 0 ? (
              recentNews.map(item => {
                const { Wrapper, props } = getLinkProps(item);
                return (
                  <Wrapper key={item.id} className="recent-news-card" {...props}>
                    <div className="recent-news-image">
                      {item.image ? (
                        <img src={item.image} alt="" />
                      ) : (
                        <div className="placeholder-image" />
                      )}
                    </div>
                    <div className="recent-news-content">
                      <div className="news-meta">
                         {item.platform && <span className="news-platform">{item.platform}</span>}
                         <span className="news-date">{formatDate(item.date)}</span>
                      </div>
                      <h4 className="recent-news-title">{item.title}</h4>
                    </div>
                  </Wrapper>
                );
              })
            ) : (
              <div className="empty-state">No recent updates found.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default News;
