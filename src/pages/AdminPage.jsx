import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import AdminInstructors from './AdminInstructors';
import AdminContacts from './AdminContacts';

const defaultForm = {
  price: '',
  titlePrefix: '', titleSuffix: '', duration: '8 buổi × 90 phút', format: 'Online',
  oldPrice: '', connectorLabel: '',
  overheadTag: 'SAU 8 BUỔI HỌC', contentTitlePrefix: 'Trở thành chuyên gia ', contentTitleHighlight: '',
  features: 'Kiến thức cốt lõi và bài bản từ số 0\nThực hành trực tiếp trên dự án thực tế\nHỗ trợ giải đáp thắc mắc 1-1\nTặng bộ tài liệu template độc quyền\nXây dựng Portfolio chất lượng cao',
  spotsLeft: 5
};

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'instructors'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  // Lấy dữ liệu khi trang tải
  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const formatCourseForPreview = (courseData, index = 0) => {
    const colors = ['orange', 'blue', 'purple', 'rose', 'green', 'teal'];
    const icons = ['ph-video-camera', 'ph-monitor-play', 'ph-pen-nib', 'ph-paint-brush-broad', 'ph-megaphone', 'ph-chart-line-up'];
    
    const color = colors[index % colors.length];
    const icon = icons[index % icons.length];
    
    const priceNum = Number(courseData.price) || 0;

    return {
      title: (courseData.titlePrefix || "Tên Tiền Tố") + " " + (courseData.titleSuffix || "Hậu Tố"),
      titlePrefix: courseData.titlePrefix || "Tên Tiền Tố",
      titleSuffix: courseData.titleSuffix || "Hậu Tố",
      parentCourse: "",
      connectorLabel: courseData.connectorLabel || "",
      tagType: "KHÓA HỌC CHUYÊN MÔN",
      tagName: "LATIO ACADEMY",
      overheadTag: courseData.overheadTag || "OVERHEAD TAG",
      contentTitlePrefix: courseData.contentTitlePrefix || "Trở thành chuyên gia ",
      contentTitleHighlight: courseData.contentTitleHighlight || "Khóa Học",
      subtitle: typeof courseData.features === 'string' ? courseData.features.split('\n')[0] : "Khóa học thực chiến",
      duration: courseData.duration || "8 buổi × 90 phút",
      format: courseData.format || "Online",
      oldPrice: courseData.oldPrice || (priceNum > 0 ? (priceNum * 1.5).toLocaleString('vi-VN') + "đ" : "0đ"),
      price: priceNum > 0 ? priceNum.toLocaleString('vi-VN') : "0",
      discount: "Tặng kèm tài liệu trọn đời",
      urgencyText: "Đăng ký ngay!",
      spotsLeft: 5,
      footerBenefits: ["Giảng viên: Latio Academy", "Thực hành 100%"],
      icon: icon,
      color: color,
      features: typeof courseData.features === 'string' ? courseData.features.split('\n').filter(Boolean) : (courseData.features || [])
    };
  };

  // Determine the index for the preview (to get correct color/icon)
  const currentPreviewIndex = editingId 
    ? courses.findIndex(c => c._id === editingId) !== -1 ? courses.findIndex(c => c._id === editingId) : 0
    : courses.length;

  const previewCourse = formatCourseForPreview(formData, currentPreviewIndex);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi form (Thêm/Sửa khóa học)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `http://localhost:5000/api/courses/${editingId}` 
        : 'http://localhost:5000/api/courses';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        title: (formData.titlePrefix || "") + " " + (formData.titleSuffix || ""),
        description: formData.features.split('\n').map(s => s.trim()).filter(Boolean)[0] || "Khóa học thực chiến",
        instructor: "Latio Academy",
        parentCourse: "",
        spotsLeft: 5,
        price: Number(formData.price),
        features: formData.features.split('\n').map(s => s.trim()).filter(Boolean)
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingId ? "Cập nhật khóa học thành công!" : "Thêm khóa học thành công!");
        setFormData(defaultForm);
        setEditingId(null);
        fetchCourses(); // Cập nhật lại bảng
      } else {
        const errData = await res.json();
        alert("Lỗi: " + errData.message);
      }
    } catch (err) {
      console.error("Lỗi khi lưu khóa học:", err);
      alert("Lỗi kết nối Server!");
    }
  };

  // Nạp dữ liệu vào form để sửa
  const handleEditClick = (course) => {
    setEditingId(course._id);
    setFormData({
      price: course.price || '',
      titlePrefix: course.titlePrefix || '',
      titleSuffix: course.titleSuffix || '',
      connectorLabel: course.connectorLabel || '',
      duration: course.duration || '',
      format: course.format || '',
      oldPrice: course.oldPrice || '',
      overheadTag: course.overheadTag || '',
      contentTitlePrefix: course.contentTitlePrefix || '',
      contentTitleHighlight: course.contentTitleHighlight || '',
      features: (course.features || []).join('\n'),
    });
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  // Xử lý xóa khóa học
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert("Xóa thành công!");
        fetchCourses(); // Cập nhật lại bảng
      } else {
        const errData = await res.json();
        alert("Lỗi: " + errData.message);
      }
    } catch (err) {
      console.error("Lỗi khi xóa khóa học:", err);
      alert("Lỗi kết nối Server!");
    }
  };

  // Xử lý đổi thứ tự
  const handleMove = async (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === courses.length - 1) return;

    const newCourses = [...courses];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Hoán đổi vị trí
    const temp = newCourses[index];
    newCourses[index] = newCourses[targetIndex];
    newCourses[targetIndex] = temp;

    // Cập nhật giá trị order mới
    newCourses.forEach((c, i) => { c.order = i; });
    setCourses(newCourses); // Cập nhật UI ngay lập tức

    // Gửi yêu cầu cập nhật lên server
    const updates = newCourses.map((c, i) => ({ id: c._id, order: i }));
    try {
      const res = await fetch('http://localhost:5000/api/courses/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      });
      if (!res.ok) {
        alert("Có lỗi khi lưu thứ tự!");
        fetchCourses(); // Phục hồi dữ liệu nếu lỗi
      }
    } catch (err) {
      console.error("Lỗi khi đổi thứ tự:", err);
      fetchCourses(); // Phục hồi dữ liệu nếu lỗi
    }
  };

  return (
    <div className="admin-container">
      {/* Header */}
      <div className="admin-header" style={{
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px', 
        background: 'white', 
        padding: '20px', 
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0', color: '#0f172a', fontSize: '28px' }}>LatioAcademy Admin Panel</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => setActiveTab('courses')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: activeTab === 'courses' ? '#0ea5e9' : '#f1f5f9',
                color: activeTab === 'courses' ? 'white' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              Quản lý Khóa học
            </button>
            <button 
              onClick={() => setActiveTab('instructors')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: activeTab === 'instructors' ? '#0ea5e9' : '#f1f5f9',
                color: activeTab === 'instructors' ? 'white' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              Quản lý Giảng viên
            </button>
            <button 
              onClick={() => setActiveTab('contacts')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: activeTab === 'contacts' ? '#0ea5e9' : '#f1f5f9',
                color: activeTab === 'contacts' ? 'white' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              Quản lý Liên hệ
            </button>
          </div>
        </div>
        <div>
          <a href="/" style={{color: '#0ea5e9', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <i className="ph ph-arrow-left"></i> Quay lại Website
          </a>
        </div>
      </div>

      {activeTab === 'instructors' ? (
        <AdminInstructors />
      ) : activeTab === 'contacts' ? (
        <AdminContacts />
      ) : (
      <div className="admin-content">
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên Khóa Học</th>
                <th>Giảng Viên</th>
                <th>Học Phí</th>
                <th>Thứ Tự</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>Không có khóa học nào.</td>
                </tr>
              ) : (
                courses.map((course, index) => (
                  <tr key={course._id}>
                    <td style={{fontWeight: '500'}}>{course.title}</td>
                    <td>{course.instructor}</td>
                    <td className="course-price">{(course.price || 0).toLocaleString('vi-VN')}đ</td>
                    <td style={{ textAlign: 'center', width: '90px' }}>
                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          style={{
                            background: index === 0 ? '#f1f5f9' : '#e2e8f0',
                            color: index === 0 ? '#cbd5e1' : '#475569',
                            border: 'none', padding: '4px 8px', borderRadius: '4px',
                            cursor: index === 0 ? 'not-allowed' : 'pointer'
                          }}
                          title="Di chuyển lên"
                        >
                          <i className="ph ph-arrow-up"></i>
                        </button>
                        <button 
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === courses.length - 1}
                          style={{
                            background: index === courses.length - 1 ? '#f1f5f9' : '#e2e8f0',
                            color: index === courses.length - 1 ? '#cbd5e1' : '#475569',
                            border: 'none', padding: '4px 8px', borderRadius: '4px',
                            cursor: index === courses.length - 1 ? 'not-allowed' : 'pointer'
                          }}
                          title="Di chuyển xuống"
                        >
                          <i className="ph ph-arrow-down"></i>
                        </button>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditClick(course)}
                        style={{ marginRight: '8px', background: '#eab308', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Sửa
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(course._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-bottom-section">
          {/* Cột 1: Form thêm dữ liệu */}
          <div className="admin-form-wrapper" style={{ maxHeight: '800px', overflowY: 'auto' }}>
            <h2>{editingId ? "Sửa Khóa Học" : "Thêm Khóa Học Mới"}</h2>
          <form onSubmit={handleSubmit}>
            
            <fieldset style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '20px'}}>
              <legend style={{fontWeight: 'bold', color: '#0ea5e9', padding: '0 5px'}}>Cấu hình thẻ hiển thị (Ticket Card)</legend>
              <div style={{display: 'flex', gap: '10px'}}>
                <div className="form-group" style={{flex: 1}}><label>Tên hiển thị - Tiền tố</label><input type="text" name="titlePrefix" value={formData.titlePrefix} onChange={handleChange} placeholder="Edit Video CapCut" required /></div>
                <div className="form-group" style={{flex: 1}}><label>Tên hiển thị - Hậu tố (Có màu)</label><input type="text" name="titleSuffix" value={formData.titleSuffix} onChange={handleChange} placeholder="Thực Chiến"/></div>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <div className="form-group" style={{flex: 1}}><label>Học Phí (Số, VD: 2500000)</label><input type="number" name="price" value={formData.price} onChange={handleChange} required /></div>
                <div className="form-group" style={{flex: 1}}><label>Giá Cũ (Chữ, VD: 3.750.000đ)</label><input type="text" name="oldPrice" value={formData.oldPrice} onChange={handleChange} /></div>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <div className="form-group" style={{flex: 1}}><label>Thời lượng (VD: 8 buổi × 90 phút)</label><input type="text" name="duration" value={formData.duration} onChange={handleChange} /></div>
                <div className="form-group" style={{flex: 1}}><label>Hình thức (VD: Online)</label><input type="text" name="format" value={formData.format} onChange={handleChange} /></div>
              </div>
              <div className="form-group"><label>Nhãn mũi tên liên kết (Nếu có, sẽ vẽ mũi tên chỉ xuống khóa học tiếp theo)</label><input type="text" name="connectorLabel" value={formData.connectorLabel} onChange={handleChange} placeholder="VD: LỘ TRÌNH LÊN CẤP AI CREATIVE" /></div>
            </fieldset>

            <fieldset style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', marginBottom: '20px'}}>
              <legend style={{fontWeight: 'bold', color: '#0ea5e9', padding: '0 5px'}}>Nội Dung Cốt Lõi (Cột Phải)</legend>
              <div className="form-group"><label>Tag Đầu Mục (VD: SAU 8 BUỔI HỌC)</label><input type="text" name="overheadTag" value={formData.overheadTag} onChange={handleChange} /></div>
              <div style={{display: 'flex', gap: '10px'}}>
                <div className="form-group" style={{flex: 1}}><label>Tiêu đề chính - Tiền tố</label><input type="text" name="contentTitlePrefix" value={formData.contentTitlePrefix} onChange={handleChange} placeholder="Trở thành chuyên gia "/></div>
                <div className="form-group" style={{flex: 1}}><label>Tiêu đề chính - Nổi bật (Gạch chân)</label><input type="text" name="contentTitleHighlight" value={formData.contentTitleHighlight} onChange={handleChange} placeholder="Edit Video CapCut Thực Chiến"/></div>
              </div>
              <div className="form-group"><label>Nội dung cốt lõi (Mỗi dòng 1 nội dung - Tối đa 5 dòng)</label><textarea name="features" value={formData.features} onChange={handleChange} style={{height: '120px'}}></textarea></div>
            </fieldset>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-submit" style={{ flex: 1 }}>
                {editingId ? "Lưu Thay Đổi" : "+ Tạo Khóa Học"}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} style={{ flex: 1, background: '#cbd5e1', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Cột 2: Live Preview */}
        <div className="admin-preview-wrapper" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', height: 'fit-content' }}>
          <h2 style={{ fontSize: '20px', marginTop: '0', marginBottom: '20px', color: '#0f172a' }}>Live Preview</h2>
          <div className="courses-zigzag-list" style={{ marginTop: '0', pointerEvents: 'none', zoom: 0.8 }}>
            <div className={`course-row-card theme-${previewCourse.color}`}>
              
              <div className={`course-ticket-card theme-${previewCourse.color}`}>
                <div className="ticket-header">
                  <div className="ticket-header-left">
                    <span className={`ticket-dot bg-${previewCourse.color}-solid`}></span>
                    <span className="ticket-brand">LATIO ACADEMY</span>
                  </div>
                  <i className={`ph ${previewCourse.icon} ticket-header-icon`}></i>
                </div>

                <div className="ticket-body">
                  <div className="ticket-tags">
                    <span className={`tag-type bg-${previewCourse.color}-solid`}>{previewCourse.tagType}</span>
                    <span className="tag-name">{previewCourse.tagName}</span>
                  </div>

                  <h2 className="ticket-title-main">
                    {previewCourse.titlePrefix} <span className={`text-${previewCourse.color}`}>{previewCourse.titleSuffix}</span>
                  </h2>

                  <div className="ticket-meta">
                    <span><i className="ph ph-clock"></i> {previewCourse.duration}</span>
                    <span className="meta-separator">•</span>
                    <span><i className="ph ph-desktop"></i> {previewCourse.format}</span>
                  </div>

                  <div className="ticket-divider-line"></div>

                  <div className="ticket-pricing">
                    <div className="price-label">HỌC PHÍ ĐẦU TƯ</div>
                    <div className="price-old">{previewCourse.oldPrice}</div>
                    <div className="price-current">
                      {previewCourse.price}<span className="currency-symbol">đ</span>
                    </div>
                  </div>

                  <div className={`ticket-discount-box border-${previewCourse.color} bg-${previewCourse.color}-light-soft`}>
                    {previewCourse.discount}
                  </div>

                  <div className={`ticket-urgency-banner bg-${previewCourse.color}-light text-${previewCourse.color}`}>
                    <span className={`urgency-dot bg-${previewCourse.color}-solid`}></span>
                    <span>{previewCourse.urgencyText}</span>
                  </div>
                </div>

                <div className="ticket-footer">
                  {previewCourse.footerBenefits.map((benefit, idx) => (
                    <span key={idx} className="footer-benefit-item">
                      <i className={`ph ph-check text-${previewCourse.color}`}></i> {benefit}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`course-row-content theme-${previewCourse.color}`}>
                {previewCourse.parentCourse && (
                  <div className="parent-course-banner" style={{marginBottom: '15px'}}>
                    <i className={`ph ph-sparkles text-${previewCourse.color}`}></i>
                    <span>Khóa nâng cao tiếp nối sau khóa <strong>{previewCourse.parentCourse}</strong></span>
                  </div>
                )}
                
                <div className="content-overhead-tag">
                  <span className={`overhead-line bg-${previewCourse.color}-solid`}></span>
                  <span className="overhead-text">{previewCourse.overheadTag}</span>
                </div>

                <h2 className="content-title-main">
                  {previewCourse.contentTitlePrefix}
                  <span className={`content-title-underline underline-${previewCourse.color}`}>
                    {previewCourse.contentTitleHighlight}
                  </span>
                </h2>

                <div className="content-meta-row">
                  <div className="content-meta-badge">
                    <i className={`ph ph-clock text-${previewCourse.color}`}></i>
                    <span>{previewCourse.duration}</span>
                  </div>
                  <div className="content-meta-badge">
                    <i className={`ph ph-desktop text-${previewCourse.color}`}></i>
                    <span>{previewCourse.format}</span>
                  </div>
                </div>

                <div className="content-features-header-wrapper">
                  <h4 className="content-features-header">NỘI DUNG CỐT LÕI</h4>
                  <span className="content-features-header-line"></span>
                </div>

                <div className="content-features-row">
                  <ul>
                    {previewCourse.features.map((feat, idx) => (
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
                    <button className="btn-content-enroll">
                      GIỮ CHỖ NGAY <i className="ph ph-arrow-right"></i>
                    </button>
                    <button className="btn-content-schedule">
                      XEM LỊCH KHAI GIẢNG
                    </button>
                  </div>
                  <div className={`content-spots-left text-${previewCourse.color}`}>
                    <i className="ph ph-fire-simple"></i> Còn {previewCourse.spotsLeft} chỗ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AdminPage;
