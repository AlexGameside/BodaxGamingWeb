import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';
import './NewsDetail.css';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleAndLatest = async () => {
      setLoading(true);
      try {
        // Fetch current article
        const docRef = doc(db, 'news', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
             if (id.startsWith('social-')) {
                 navigate('/news'); 
                 return;
             }
             console.log("No such document!");
             navigate('/news');
             return;
        }

        // Fetch latest news for the bottom section
        const newsRef = collection(db, 'news');
        const q = query(newsRef, orderBy('date', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        
        const newsData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.id !== id)
          .slice(0, 3);

        setLatestNews(newsData);
      } catch (error) {
        console.error("Error fetching news detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleAndLatest();
    }
    
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="news-detail-page loading-state">
        <div className="container">Loading...</div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="news-detail-page">
      {/* Article Header / Hero */}
      <section className="news-article-hero">
        <div className="container">
          <Link to="/news" className="back-link">
            <span className="back-arrow">←</span> Back to News
          </Link>
          
          <div className="article-header-inner">
            <div className="article-meta">
              {article.platform && (
                <span className="article-platform-badge">{article.platform.toUpperCase()}</span>
              )}
              {article.platform && <span className="meta-dot">•</span>}
              <span className="article-date">
                {article.date 
                  ? format(article.date?.toDate ? article.date.toDate() : new Date(article.date), 'MMMM d, yyyy')
                  : '—'
                }
              </span>
            </div>

            <h1 className="article-title">{article.title}</h1>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="news-article-body-section">
        <div className="container article-container">
          {article.image && (
            <div className="article-main-image">
              <img src={article.image} alt={article.title} />
            </div>
          )}

          <div className="article-content-text">
            {article.content}
          </div>
        </div>
      </section>

      {/* Latest Updates */}
      {latestNews.length > 0 && (
        <section className="news-more-section">
          <div className="container">
            <div className="section-head">
              <div className="section-kicker">Keep reading</div>
              <h2 className="section-title">Latest Updates</h2>
            </div>
            
            <div className="more-news-grid">
              {latestNews.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/news/${item.id}`}
                  className="more-news-card"
                >
                  <div className="more-news-image">
                    {item.image ? (
                      <img src={item.image} alt="" />
                    ) : (
                       <div className="placeholder-image" /> 
                    )}
                  </div>
                  
                  <div className="more-news-content">
                    <div className="more-news-meta">
                      {item.platform && (
                        <span className="mini-platform">{item.platform.toUpperCase()}</span>
                      )}
                      <span className="mini-date">
                        {item.date 
                          ? format(item.date?.toDate ? item.date.toDate() : new Date(item.date), 'MMM d')
                          : '—'
                        }
                      </span>
                    </div>
                    <div className="more-news-title">{item.title}</div>
                    <div className="read-more">Read Article →</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsDetail;
