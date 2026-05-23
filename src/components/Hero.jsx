import React from 'react';
import { Link } from 'react-router-dom';
import Hero3DBlock from './Hero3DBlock';

const Hero = () => {
  return (
    <div className="hero-content-wrapper">
      <div className="hero-text">
        <div className="social-proof">
          <div className="badge-live-pulse"></div>
          <span className="social-proof-text">Đào tạo thực chiến · Lộ trình chuẩn Agency · Hỗ trợ trọn đời</span>
        </div>

        <h1 className="hero-headline">
          Bứt Phá Kỹ Năng<br /> Sáng Tạo,<br />Làm Chủ Lộ Trình <span className="text-gradient">Chuẩn Agency</span>
        </h1>

        <p className="hero-subheadline">
          Học Photoshop chuyên nghiệp, biên tập video CapCut PC đỉnh cao và ứng dụng AI Render từ số 0. Tự tay tạo ra các sản phẩm chất lượng cao chuẩn Studio & Agency cùng đội ngũ chuyên gia giàu kinh nghiệm.
        </p>

        <div className="hero-cta-group">
          <Link to="/courses" className="btn-primary">
            Khám phá khóa học
            <div className="icon-circle">
              <i className="ph ph-arrow-right"></i>
            </div>
          </Link>

          {/* <a href="#courses" className="btn-secondary">
            Xem giáo trình <i className="ph ph-book-open"></i>
          </a> */}
        </div>
      </div>

      <div className="hero-visual">
        <Hero3DBlock />
      </div>
    </div>
  );
};

export default Hero;
