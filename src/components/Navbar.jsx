import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false); // Reset dropdown state when toggling main menu
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const [navCourses, setNavCourses] = useState([]);

  useEffect(() => {
    fetch('https://latioacademyserver-production.up.railway.app/api/courses')
      .then(res => res.json())
      .then(data => {
        const visibleCourses = data.filter(c => c.showInNavbar);
        setNavCourses(visibleCourses);
      })
      .catch(err => console.error("Error fetching courses for navbar:", err));
  }, []);

  const toggleDropdown = (e) => {
    // Only toggle dropdown behavior on mobile view (width <= 768px)
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  // Auto-close menu on location changes
  useEffect(() => {
    closeMobileMenu();
  }, [location]);

  return (
    <nav className={`navbar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <Link to="/" className="nav-brand font-brand" style={{ textDecoration: 'none', color: 'inherit' }} onClick={closeMobileMenu}>
        LATIO <span className="brand-accent">ACADEMY</span>
      </Link>
      
      <div className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={closeMobileMenu}>Trang chủ</Link>
        
        {/* Dropdown Menu for Khóa học */}
        <div className={`nav-dropdown ${isDropdownOpen ? 'dropdown-open' : ''}`}>
          <Link to="/courses" className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`} onClick={toggleDropdown}>
            Khóa học <i className={`ph ph-caret-down nav-caret ${isDropdownOpen ? 'rotated' : ''}`}></i>
          </Link>
          <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
            {navCourses.length > 0 ? (
              navCourses.map(course => (
                <Link key={course._id} to="/courses" className={`dropdown-item ${course.color || 'orange'}`} onClick={closeMobileMenu}>
                  <div className="dropdown-icon-wrapper">
                    <i className={`ph ${course.icon || 'ph-video-camera'}`}></i>
                  </div>
                  <div className="dropdown-info">
                    <span className="dropdown-title">{course.titlePrefix || course.title}</span>
                    <span className="dropdown-desc">{course.titleSuffix || ''}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{padding: '10px 20px', color: '#64748b'}}>Đang cập nhật...</div>
            )}
          </div>
        </div>

        <Link to="/instructors" className={`nav-link ${location.pathname === '/instructors' ? 'active' : ''}`} onClick={closeMobileMenu}>Giảng viên</Link>
        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} onClick={closeMobileMenu}>Liên hệ</Link>
      </div>

      <div className="nav-actions">
        <Link to="/contact" className="btn-signup" style={{ textDecoration: 'none' }}>
          Đăng ký ngay <i className="ph ph-arrow-right"></i>
        </Link>
        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <i className={`ph ${isMobileMenuOpen ? 'ph-x' : 'ph-list'}`}></i>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

