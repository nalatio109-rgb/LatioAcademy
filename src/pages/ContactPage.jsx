import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Vui lòng nhập họ và tên';
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/[\s.-]/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10-11 chữ số)';
    }
    if (!formData.message.trim()) newErrors.message = 'Vui lòng nhập lời nhắn';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          course: '',
          message: ''
        });
      } else {
        const errData = await res.json();
        alert('Lỗi: ' + errData.message);
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Lỗi khi gửi liên hệ:', err);
      alert('Lỗi kết nối Server!');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section-wrapper">
      {/* Background Ambient Glow */}
      <div className="contact-glow-under"></div>

      <div className="contact-container-inner">
        <div className="contact-header">
          <span className="contact-badge-pill">
            <i className="ph ph-chat-centered-text"></i> LIÊN HỆ TRỰC TIẾP
          </span>
          <h1 className="brand-accent">Hỗ Trợ & Hợp Tác</h1>
          <p>
            Bạn có câu hỏi về khóa học hoặc muốn đồng hành cùng LATIO Academy? 
            Hãy để lại tin nhắn, chúng tôi luôn sẵn sàng hỗ trợ bạn.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Premium Form Card */}
          <div className="contact-form-card">
            {!isSuccess ? (
              <>
                <h2>Gửi thắc mắc cho chúng tôi</h2>
                <p>Điền thông tin của bạn vào biểu mẫu bên dưới để nhận tư vấn sớm nhất.</p>
                
                <form onSubmit={handleSubmit} className="contact-form" noValidate>
                  {/* Name field */}
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên *</label>
                    <div className="form-input-wrapper">
                      <i className="ph ph-user"></i>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.name && (
                      <span className="error-text-span">
                        <i className="ph ph-warning-circle"></i> {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-row">
                    {/* Email field */}
                    <div className="form-group">
                      <label htmlFor="email">Địa chỉ Email *</label>
                      <div className="form-input-wrapper">
                        <i className="ph ph-envelope-simple"></i>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-input"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.email && (
                        <span className="error-text-span">
                          <i className="ph ph-warning-circle"></i> {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Phone field */}
                    <div className="form-group">
                      <label htmlFor="phone">Số điện thoại *</label>
                      <div className="form-input-wrapper">
                        <i className="ph ph-phone"></i>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-input"
                          placeholder="0868xxxxxx"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.phone && (
                        <span className="error-text-span">
                          <i className="ph ph-warning-circle"></i> {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Course selection dropdown */}
                  <div className="form-group">
                    <label htmlFor="course">Khóa học cần tư vấn (Tùy chọn)</label>
                    <div className="form-input-wrapper">
                      <i className="ph ph-graduation-cap"></i>
                      <select
                        id="course"
                        name="course"
                        className="form-select"
                        value={formData.course}
                        onChange={handleInputChange}
                      >
                        <option value="">-- Chọn khóa học bạn muốn tư vấn --</option>
                        <option value="video-editing">Khóa học Edit Video (CapCut & TikTok)</option>
                        <option value="2d-design">Khóa học Thiết kế Design 2D Chuyên Nghiệp</option>
                        <option value="ads-marketing">Khóa học Ads Marketing (Facebook & TikTok Ads)</option>
                        <option value="other">Tư vấn lộ trình học khác</option>
                      </select>
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="form-group">
                    <label htmlFor="message">Lời nhắn của bạn *</label>
                    <div className="form-input-wrapper form-textarea-wrapper">
                      <i className="ph ph-chat-centered-text"></i>
                      <textarea
                        id="message"
                        name="message"
                        className="form-textarea"
                        placeholder="Nhập nội dung bạn cần hỗ trợ hoặc câu hỏi dành cho học viện..."
                        value={formData.message}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    {errors.message && (
                      <span className="error-text-span">
                        <i className="ph ph-warning-circle"></i> {errors.message}
                      </span>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className={`btn-submit ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Đang gửi yêu cầu...</>
                    ) : (
                      <>
                        Gửi tin nhắn ngay <i className="ph ph-paper-plane-tilt"></i>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="contact-success-card">
                <div className="success-icon-wrapper">
                  <i className="ph ph-check-circle"></i>
                </div>
                <h2>Gửi tin nhắn thành công!</h2>
                <p>
                  Cảm ơn bạn đã liên hệ với LATIO Academy. Lời nhắn của bạn đã được tiếp nhận. Đội ngũ tư vấn sẽ phản hồi bạn qua Email hoặc Số điện thoại sớm nhất!
                </p>
                <button className="btn-secondary" onClick={() => setIsSuccess(false)}>
                  Gửi thêm lời nhắn mới
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Cohesive Info Dashboard */}
          <div className="contact-info-dashboard">
            {/* Map embedded directly inside the dashboard */}
            <div className="contact-map-holder">
              <iframe 
                src="https://maps.google.com/maps?q=86%20%C4%90o%C3%A0n%20V%C4%83n%20C%E1%BB%AB,%20H%C3%B2a%20An,%20C%E1%BA%A9m%20L%E1%BB%87,%20%C4%90%C3%A0%20N%E1%BA%B5ng&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                className="contact-map-iframe"
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="LATIO Academy Location Map"
              ></iframe>
            </div>

            <div className="contact-info-list">
              {/* Phone item */}
              <div className="contact-info-item-row">
                <div className="contact-info-icon-wrapper blue">
                  <i className="ph ph-phone"></i>
                </div>
                <div className="contact-info-text-box">
                  <h3>Hotline Hỗ Trợ</h3>
                  <p><a href="tel:0868651224">0868 651 224</a></p>
                </div>
              </div>

              {/* Email item */}
              <div className="contact-info-item-row">
                <div className="contact-info-icon-wrapper purple">
                  <i className="ph ph-envelope"></i>
                </div>
                <div className="contact-info-text-box">
                  <h3>Email Hợp Tác</h3>
                  <p><a href="mailto:latiodigital@gmail.com">latiodigital@gmail.com</a></p>
                </div>
              </div>

              {/* Address item */}
              <div className="contact-info-item-row">
                <div className="contact-info-icon-wrapper orange">
                  <i className="ph ph-map-pin"></i>
                </div>
                <div className="contact-info-text-box">
                  <h3>Địa Chỉ Học Viện</h3>
                  <p>86 Đoàn Văn Cừ, Hoà An, Cẩm Lệ, Đà Nẵng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
