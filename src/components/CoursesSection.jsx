import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';



const CoursesSection = () => {
  const [dbCourses, setDbCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('https://latioacademyserver-production.up.railway.app/api/courses')
      .then(res => res.json())
      .then(data => {
        setDbCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err);
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
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.courses-section .reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loading]); // Re-run observer when loading finishes

  const formatCourseForGrid = (dbCourse, index) => {
    const colors = ['orange', 'blue', 'purple', 'rose', 'green', 'teal'];
    const icons = ['ph-video-camera', 'ph-monitor-play', 'ph-pen-nib', 'ph-paint-brush-broad', 'ph-megaphone', 'ph-chart-line-up'];
    
    const color = colors[index % colors.length];
    const icon = icons[index % icons.length];
    
    const priceNum = Number(dbCourse.price) || 0;

    return {
      id: dbCourse._id,
      title: dbCourse.title || "",
      subtitle: dbCourse.description || "",
      parentCourse: dbCourse.parentCourse || "",
      duration: dbCourse.duration || "8 buổi × 90 phút",
      format: dbCourse.format || "Online",
      oldPrice: dbCourse.oldPrice || (priceNum > 0 ? (priceNum * 1.5).toLocaleString('vi-VN') + "đ" : "0đ"),
      price: priceNum > 0 ? priceNum.toLocaleString('vi-VN') + "đ" : "0đ",
      discount: "Tặng kèm tài liệu trọn đời",
      icon: icon,
      color: color
    };
  };

  const displayCourses = dbCourses
    .slice(0, showAll ? dbCourses.length : 6)
    .map((c, i) => formatCourseForGrid(c, i));

  return (
    <section className="courses-section" id="courses">
      <div className="courses-header reveal-on-scroll">
        <div className="courses-tag-badge">LỘ TRÌNH ĐÀO TẠO THỰC CHIẾN</div>
        <h2 className="section-title">
          Khám Phá Các Khóa Học <span className="brand-accent">Tại LATIO</span>
        </h2>
        <p className="section-subtitle">Nâng cấp kỹ năng thiết kế và chỉnh sửa video của bạn với lộ trình học chuẩn Agency.</p>
      </div>
      
      <div className="courses-grid">
        {loading ? (
          <p style={{textAlign: 'center', width: '100%', color: '#64748b'}}>Đang tải dữ liệu từ máy chủ...</p>
        ) : displayCourses.length === 0 ? (
          <p style={{textAlign: 'center', width: '100%', color: '#64748b'}}>Chưa có khóa học nào. Hãy thêm trong Admin!</p>
        ) : (
          displayCourses.map(course => (
          <div key={course.id} className={`course-card card-${course.color} reveal-on-scroll`}>
            {/* Ambient card background glow */}
            <div className="card-ambient-glow"></div>

            <div className="course-icon-wrapper">
              <i className={`ph ${course.icon} course-icon`}></i>
            </div>
            
            <div className="course-content">
              {course.parentCourse && (
                <span className="course-parent-badge">
                  <i className="ph ph-sparkles"></i> {course.parentCourse}
                </span>
              )}
              <h3 className="course-title">{course.title}</h3>
              <p className="course-subtitle">{course.subtitle}</p>
              
              <div className="course-meta">
                <div className="meta-item">
                  <i className="ph ph-clock"></i>
                  <span>{course.duration}</span>
                </div>
                <div className="meta-item">
                  <i className="ph ph-chalkboard-teacher"></i>
                  <span>{course.format}</span>
                </div>
              </div>
            </div>
            
            <div className="course-footer">
              <div className="course-pricing">
                <div className="price-old">{course.oldPrice}</div>
                <div className="price-current">
                  {course.price}
                  <span className="price-discount">{course.discount}</span>
                </div>
              </div>
              <Link to={`/courses#course-${course.id}`} className="btn-course">
                Xem chi tiết <i className="ph ph-arrow-right"></i>
              </Link>
            </div>
          </div>
          ))
        )}
      </div>

      {!loading && dbCourses.length > 6 && !showAll && (
        <div style={{ textAlign: 'center', marginTop: '40px' }} className="reveal-on-scroll">
          <button 
            onClick={() => setShowAll(true)}
            style={{
              padding: '12px 30px',
              background: 'transparent',
              border: '2px solid var(--color-primary-blue)',
              color: 'var(--color-primary-blue)',
              borderRadius: '30px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'var(--color-primary-blue)';
              e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--color-primary-blue)';
            }}
          >
            Xem tất cả {dbCourses.length} khóa học <i className="ph ph-caret-down" style={{marginLeft: '5px'}}></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default CoursesSection;
