import React, { useEffect, useState } from 'react';
import { Heart, MessageCircle, Send, AlertTriangle, MoreVertical } from 'lucide-react';
import './Reels.css';

export const Reels = () => {
  // Array of Instagram Reels with mock user data to simulate native UI
  const [reelsData, setReelsData] = useState([
    {
      id: 'DYpPU_HFuYs',
      username: 'agri_tech_india',
      avatar: 'https://ui-avatars.com/api/?name=Agri+Tech&background=0D8ABC&color=fff',
      likes: 12400,
      isLiked: false,
      comments: '342'
    },
    {
      id: 'DaXovpYT6wN',
      username: 'pragathinaturalfarm',
      avatar: 'https://ui-avatars.com/api/?name=Pragathi&background=16A34A&color=fff',
      likes: 8932,
      isLiked: false,
      comments: '124'
    },
    {
      id: 'Da_9K8Dz7VD',
      username: 'kisan_smart_farming',
      avatar: 'https://ui-avatars.com/api/?name=Kisan&background=F59E0B&color=fff',
      likes: 45100,
      isLiked: false,
      comments: '1.2K'
    }
  ]);

  useEffect(() => {
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(script);
    } else {
      window.instgrm.Embeds.process();
    }
  }, []);

  const handleLike = (id) => {
    setReelsData(prev => prev.map(reel => {
      if (reel.id === id) {
        return {
          ...reel,
          isLiked: !reel.isLiked,
          likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1
        };
      }
      return reel;
    }));
  };

  const handleShare = async (id) => {
    const url = `https://www.instagram.com/reel/${id}/`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Farmogram Reel', url });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const formatLikes = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="reels-container">
      {reelsData.map((reel, index) => (
        <div key={reel.id} className="reel-item">
          <div className="reel-iframe-wrapper">
            {/* Top black overlay to hide Instagram header */}
            <div className="reel-overlay-top"></div>
            
            <iframe 
              className="reel-iframe"
              src={`https://www.instagram.com/p/${reel.id}/embed/?theme=dark`}
              frameBorder="0"
              scrolling="no"
              allowTransparency="true"
              allowFullScreen={true}
              title={`Instagram Reel ${index + 1}`}
            />
            
            {/* Bottom black overlay to hide Instagram footer */}
            <div className="reel-overlay-bottom"></div>
            
            {/* Edge overlays to completely hide scrollbars and white lines */}
            <div className="reel-overlay-left"></div>
            <div className="reel-overlay-right"></div>

            {/* Custom Native-like UI Overlay */}
            <div className="custom-reel-ui">
              {/* Bottom Left User Info */}
              <div className="reel-user-info">
                <img src={reel.avatar} alt={reel.username} className="reel-avatar" />
                <span className="reel-username">{reel.username}</span>
                <button className="reel-follow-btn" onClick={(e) => {
                  e.target.innerText = e.target.innerText === 'Follow' ? 'Following' : 'Follow';
                  e.target.style.background = e.target.innerText === 'Following' ? 'rgba(255,255,255,0.2)' : 'transparent';
                }}>Follow</button>
              </div>

              {/* Vertical Action Bar (Right Side) */}
              <div className="reel-actions-vertical">
                <button 
                  className="reel-action-btn" 
                  onClick={() => handleLike(reel.id)}
                  style={{ color: reel.isLiked ? '#ef4444' : '#fff' }}
                >
                  <Heart size={28} fill={reel.isLiked ? '#ef4444' : 'transparent'} />
                  <span>{formatLikes(reel.likes)}</span>
                </button>
                <button className="reel-action-btn" onClick={() => alert('Comments view is currently simulated in this demo.')}>
                  <MessageCircle size={28} />
                  <span>{reel.comments}</span>
                </button>
                <button className="reel-action-btn" onClick={() => handleShare(reel.id)}>
                  <Send size={28} />
                  <span>Share</span>
                </button>
                <button className="reel-action-btn" onClick={() => alert('Report submitted to moderators for review.')}>
                  <AlertTriangle size={24} />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
