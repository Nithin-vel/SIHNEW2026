import React, { useEffect } from 'react';
import { Heart, MessageCircle, Send, AlertTriangle, MoreVertical } from 'lucide-react';
import './Reels.css';

export const Reels = () => {
  // Array of Instagram Reels with mock user data to simulate native UI
  const reelsData = [
    {
      id: 'DYpPU_HFuYs',
      username: 'agri_tech_india',
      avatar: 'https://ui-avatars.com/api/?name=Agri+Tech&background=0D8ABC&color=fff',
      likes: '12.4K',
      comments: '342'
    },
    {
      id: 'DaXovpYT6wN',
      username: 'pragathinaturalfarm',
      avatar: 'https://ui-avatars.com/api/?name=Pragathi&background=16A34A&color=fff',
      likes: '8,932',
      comments: '124'
    },
    {
      id: 'Da_9K8Dz7VD',
      username: 'kisan_smart_farming',
      avatar: 'https://ui-avatars.com/api/?name=Kisan&background=F59E0B&color=fff',
      likes: '45.1K',
      comments: '1.2K'
    }
  ];

  useEffect(() => {
    // Add Instagram embed script to the document if not already there
    if (!window.instgrm) {
      const script = document.createElement('script');
      script.async = true;
      script.src = "https://www.instagram.com/embed.js";
      document.body.appendChild(script);
    } else {
      window.instgrm.Embeds.process();
    }
  }, []);

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

            {/* Custom Native-like UI Overlay */}
            <div className="custom-reel-ui">
              {/* Bottom Left User Info */}
              <div className="reel-user-info">
                <img src={reel.avatar} alt={reel.username} className="reel-avatar" />
                <span className="reel-username">{reel.username}</span>
                <button className="reel-follow-btn">Follow</button>
              </div>

              {/* Vertical Action Bar (Right Side) */}
              <div className="reel-actions-vertical">
                <button className="reel-action-btn">
                  <Heart size={28} />
                  <span>{reel.likes}</span>
                </button>
                <button className="reel-action-btn">
                  <MessageCircle size={28} />
                  <span>{reel.comments}</span>
                </button>
                <button className="reel-action-btn">
                  <Send size={28} />
                  <span>Share</span>
                </button>
                <button className="reel-action-btn" onClick={() => alert('Report submitted to moderators')}>
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
