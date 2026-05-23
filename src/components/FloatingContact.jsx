import React from 'react';
import './FloatingContact.css';

const FloatingContact = () => {
  return (
    <div className="floating-contact">
      <a 
        href="tel:0868651224" 
        className="contact-btn phone-btn" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Gọi điện ngay"
      >
        <div className="contact-tooltip">0868.651.224</div>
        <i className="ph-fill ph-phone-call"></i>
      </a>
      
      <a 
        href="https://zalo.me/0868651224" 
        className="contact-btn zalo-btn" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Chat qua Zalo"
      >
        <div className="contact-tooltip">Zalo: 0868.651.224</div>
        <span className="zalo-text-logo">Zalo</span>
      </a>
      
      <a 
        href="https://www.facebook.com/Khoahocmarketing.43?locale=vi_VN" 
        className="contact-btn fb-btn" 
        target="_blank" 
        rel="noopener noreferrer"
        title="Chat qua Facebook"
      >
        <div className="contact-tooltip">Facebook Latio</div>
        <svg viewBox="0 0 320 512" width="28" height="28" fill="currentColor">
          <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
        </svg>
      </a>
    </div>
  );
};

export default FloatingContact;
