import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">LATIO <span className="logo-accent">ACADEMY</span></h2>
            <p className="footer-tagline">Nâng tầm kỹ năng, bứt phá sự nghiệp cùng LATIO Academy.</p>
            {/* <div className="social-links">
              <a href="https://www.facebook.com/Khoahocmarketing.43?locale=vi_VN" target="_blank" rel="noopener noreferrer"><i className="ph ph-facebook-logo"></i></a>
            </div> */}
          </div>
          
          <div className="footer-links-group">
            <div className="footer-col">
              <h3>Khóa học Nổi bật</h3>
              <ul>
                <li><Link to="/courses">Lộ trình Agency Toàn Diện</Link></li>
                <li><Link to="/courses">Edit Video CapCut Thực Chiến</Link></li>
                <li><Link to="/courses">Designer 2D Chuyên Nghiệp</Link></li>
                <li><Link to="/courses">Facebook & TikTok Ads</Link></li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h3>Liên hệ</h3>
              <ul>
                <li><i className="ph ph-phone"></i> 0868 651 224</li>
                <li><i className="ph ph-envelope"></i> latiodigital@gmail.com</li>
                <li><i className="ph ph-map-pin"></i> 86 Đoàn Văn Cừ, Đà Nẵng</li>
              </ul>
            </div>
            
            <div className="footer-col">
              <h3>Bản đồ</h3>
              <div className="footer-map" style={{ marginTop: '10px' }}>
                <iframe 
                  src="https://maps.google.com/maps?q=86%20Đoàn%20Văn%20Cừ,%20Đà%20Nẵng&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="150" 
                  style={{ border: 0, borderRadius: '8px' }} 
                  allowFullScreen="" 
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Latio Academy Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; LATIO Academy</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
