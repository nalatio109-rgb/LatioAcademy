import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CoursesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dbCourses, setDbCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm này sẽ tự động chạy để lấy dữ liệu từ Backend khi trang tải
  useEffect(() => {
    fetch('http://localhost:5000/api/courses')
      .then(res => res.json())
      .then(data => {
        setDbCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi kết nối Backend:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loading]);

  useEffect(() => {
    if (location.hash && !loading) {
      const id = location.hash.replace('#', '');
      
      // Try to find element immediately
      let element = document.getElementById(id);
      
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a temporary highlight effect
          element.style.transition = 'box-shadow 0.5s ease';
          element.style.boxShadow = '0 0 30px rgba(14, 165, 233, 0.5)';
          setTimeout(() => {
            element.style.boxShadow = 'none';
          }, 2000);
        }, 200); // Wait for render to settle
      }
    }
  }, [location, loading]);

  const getHexColor = (colorName) => {
    switch (colorName) {
      case 'orange': return '#f97316';
      case 'blue': return '#3b82f6';
      case 'purple': return '#a855f7';
      case 'rose': return '#f43f5e';
      case 'green': return '#10b981';
      case 'teal': return '#14b8a6';
      default: return '#f97316';
    }
  };

  const formatCourseForUI = (dbCourse, index) => {
    const colors = ['orange', 'blue', 'purple', 'rose', 'green', 'teal'];
    const icons = ['ph-video-camera', 'ph-monitor-play', 'ph-pen-nib', 'ph-paint-brush-broad', 'ph-megaphone', 'ph-chart-line-up'];
    
    const color = colors[index % colors.length];
    const icon = icons[index % icons.length];
    
    const title = dbCourse.title || "Tên Khóa Học...";
    const words = title.split(' ');
    const splitIndex = words.length > 2 ? words.length - 2 : words.length - 1;
    const autoTitlePrefix = words.slice(0, splitIndex).join(' ');
    const autoTitleSuffix = words.slice(splitIndex).join(' ');

    const priceNum = Number(dbCourse.price) || 0;

    return {
      id: dbCourse._id || index,
      title: title,
      parentCourse: dbCourse.parentCourse || "",
      connectorLabel: dbCourse.connectorLabel || "",
      titlePrefix: dbCourse.titlePrefix || autoTitlePrefix,
      titleSuffix: dbCourse.titleSuffix || autoTitleSuffix,
      tagType: "KHÓA HỌC CHUYÊN MÔN",
      tagName: "LATIO ACADEMY",
      overheadTag: dbCourse.overheadTag || "SAU 8 BUỔI HỌC",
      contentTitlePrefix: dbCourse.contentTitlePrefix || "Trở thành chuyên gia ",
      contentTitleHighlight: dbCourse.contentTitleHighlight || title,
      subtitle: dbCourse.description || "",
      description: dbCourse.description || "",
      duration: dbCourse.duration || "8 buổi × 90 phút",
      format: dbCourse.format || "Online",
      oldPrice: dbCourse.oldPrice || (priceNum > 0 ? (priceNum * 1.5).toLocaleString('vi-VN') + "đ" : "0đ"),
      price: priceNum > 0 ? priceNum.toLocaleString('vi-VN') : "0",
      discount: "Tặng kèm tài liệu trọn đời",
      urgencyText: "Đăng ký ngay!",
      spotsLeft: dbCourse.spotsLeft || 5,
      footerBenefits: ["Giảng viên: " + (dbCourse.instructor || "Latio Team"), "Thực hành 100%"],
      icon: icon,
      color: color,
      features: dbCourse.features && dbCourse.features.length > 0 ? dbCourse.features : [
        "Kiến thức cốt lõi và bài bản từ số 0",
        "Thực hành trực tiếp trên dự án thực tế",
        "Hỗ trợ giải đáp thắc mắc 1-1",
        "Tặng bộ tài liệu template độc quyền",
        "Xây dựng Portfolio chất lượng cao"
      ]
    };
  };

  const displayCourses = dbCourses.map((c, i) => formatCourseForUI(c, i));

  return (
    <div className="courses-page animate-fade-in">
      <div className="courses-page-header">
        <h1 className="page-title">Hệ Thống <span className="brand-accent">Khóa Học</span></h1>
        <p className="page-subtitle">Chọn lộ trình phù hợp để bắt đầu hành trình sáng tạo của bạn cùng LATIO Academy.</p>
      </div>

      <div className="courses-zigzag-list">
        {loading ? (
          <p style={{textAlign: 'center', color: '#64748b'}}>Đang tải dữ liệu từ máy chủ...</p>
        ) : displayCourses.length === 0 ? (
          <p style={{textAlign: 'center', color: '#64748b'}}>Chưa có khóa học nào. Hãy thêm trong Admin!</p>
        ) : (
          displayCourses.map((course, index) => (
          <React.Fragment key={course.id}>
            <div 
              id={`course-${course.id}`}
              className={`course-row-card reveal-on-scroll ${index % 2 !== 0 ? 'row-reverse' : ''}`}
            >

            {/* Ticket Card Visual Block */}
            <div className={`course-ticket-card theme-${course.color}`}>
              {/* Header Bar */}
              <div className="ticket-header">
                <div className="ticket-header-left">
                  <span className={`ticket-dot bg-${course.color}-solid`}></span>
                  <span className="ticket-brand">LATIO ACADEMY</span>
                </div>
                <i className={`ph ${course.icon} ticket-header-icon`}></i>
              </div>

              {/* Body */}
              <div className="ticket-body">
                <div className="ticket-tags">
                  <span className={`tag-type bg-${course.color}-solid`}>{course.tagType}</span>
                  <span className="tag-name">{course.tagName}</span>
                  {course.parentCourse && (
                    <span className="tag-parent-course">
                      <i className="ph ph-arrow-circle-up-right"></i> {course.parentCourse}
                    </span>
                  )}
                </div>

                <h2 className="ticket-title-main">
                  {course.titlePrefix} <span className={`text-${course.color}`}>{course.titleSuffix}</span>
                </h2>

                <div className="ticket-meta">
                  <span><i className="ph ph-clock"></i> {course.duration}</span>
                  <span className="meta-separator">•</span>
                  <span><i className="ph ph-desktop"></i> {course.format}</span>
                </div>

                <div className="ticket-divider-line"></div>

                <div className="ticket-pricing">
                  <div className="price-label">HỌC PHÍ ĐẦU TƯ</div>
                  <div className="price-old">{course.oldPrice}</div>
                  <div className="price-current">
                    {course.price}<span className="currency-symbol">đ</span>
                  </div>
                </div>

                <div className={`ticket-discount-box border-${course.color} bg-${course.color}-light-soft`}>
                  {course.discount}
                </div>

                <div className={`ticket-urgency-banner bg-${course.color}-light text-${course.color}`}>
                  <span className={`urgency-dot bg-${course.color}-solid`}></span>
                  <span>{course.urgencyText}</span>
                </div>
              </div>

              {/* Footer Bar */}
              <div className="ticket-footer">
                {course.footerBenefits.map((benefit, idx) => (
                  <span key={idx} className="footer-benefit-item">
                    <i className={`ph ph-check text-${course.color}`}></i> {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Block */}
            <div className={`course-row-content theme-${course.color}`}>
              {course.parentCourse && (
                <div className="parent-course-banner">
                  <i className={`ph ph-sparkles text-${course.color === 'rose' ? 'purple' : course.color === 'teal' ? 'green' : 'orange'}`}></i>
                  <span>Khóa nâng cao tiếp nối sau khóa <strong>{
                    course.color === 'rose' ? 'Designer 2D Chuyên Nghiệp' : 
                    course.color === 'teal' ? 'Facebook & TikTok Ads Chuyên Nghiệp' : 
                    'Edit CapCut'
                  }</strong></span>
                </div>
              )}
              <div className="content-overhead-tag">
                <span className={`overhead-line bg-${course.color}-solid`}></span>
                <span className="overhead-text">{course.overheadTag}</span>
              </div>

              <h2 className="content-title-main">
                {course.contentTitlePrefix}
                <span className={`content-title-underline underline-${course.color}`}>
                  {course.contentTitleHighlight}
                </span>
              </h2>

              <div className="content-meta-row">
                <div className="content-meta-badge">
                  <i className={`ph ph-clock text-${course.color}`}></i>
                  <span>{course.duration}</span>
                </div>
                <div className="content-meta-badge">
                  <i className={`ph ph-desktop text-${course.color}`}></i>
                  <span>{course.format}</span>
                </div>
              </div>

              <div className="content-features-header-wrapper">
                <h4 className="content-features-header">NỘI DUNG CỐT LÕI</h4>
                <span className="content-features-header-line"></span>
              </div>

              <div className="content-features-row">
                <ul>
                  {course.features.map((feat, idx) => (
                    <li key={idx} className="content-feature-item">
                      <span className="content-feature-number">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="content-feature-text">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="content-action-row">
                <div className="content-buttons-group">
                  <button className="btn-content-enroll" onClick={() => navigate('/contact')}>
                  ĐĂNG KÝ NGAY
                  </button>
                  {/* <button className="btn-content-schedule">
                    XEM LỊCH KHAI GIẢNG
                  </button> */}
                </div>
                <div className={`content-spots-left text-${course.color}`}>
                  <i className="ph ph-fire-simple"></i> Còn {course.spotsLeft} chỗ
                </div>
              </div>
            </div>

            </div>
            
            {course.connectorLabel && (
              <div className={`course-connector-arrow theme-${course.color}`}>
                <svg viewBox="0 0 1000 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="connector-svg">
                  <path d="M 200 10 C 250 70, 750 70, 800 130" stroke={getHexColor(course.color)} strokeWidth="3.5" strokeDasharray="8 6" strokeLinecap="round"/>
                  <path d="M 800 130 L 786 125 M 800 130 L 802 116" stroke={getHexColor(course.color)} strokeWidth="3.5" strokeLinecap="round"/>
                </svg>
                <div className="connector-label">
                  <i className="ph ph-sparkles"></i> {course.connectorLabel}
                </div>
              </div>
            )}
          </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
