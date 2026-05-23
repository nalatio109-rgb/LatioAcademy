import React, { useState, useEffect } from 'react';

const defaultForm = {
  name: '',
  role: '',
  experience: '5+ Năm Kinh Nghiệm',
  bio: '',
  color: 'blue',
  image: '',
  skills: '',
  socials: {
    facebook: '',
    linkedin: '',
    behance: '',
    dribbble: ''
  },
  courses: '' // Trình bày dưới dạng JSON hoặc chuỗi ngăn cách bằng dấu phẩy
};

const AdminInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instructors');
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách giảng viên:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('socials.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialKey]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parse skills
    const skillsArray = typeof formData.skills === 'string' 
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : formData.skills;

    // Parse courses (assumes format "Name|Link, Name|Link" or just basic parsing)
    let coursesArray = [];
    if (typeof formData.courses === 'string' && formData.courses) {
        try {
            // Check if it's JSON
            coursesArray = JSON.parse(formData.courses);
        } catch(err) {
            // Otherwise parse "Name|Link, Name|Link"
            coursesArray = formData.courses.split(',').map(c => {
                const parts = c.split('|');
                return { name: parts[0]?.trim() || '', link: parts[1]?.trim() || '' };
            }).filter(c => c.name);
        }
    } else if (Array.isArray(formData.courses)) {
        coursesArray = formData.courses;
    }

    const payload = {
      ...formData,
      skills: skillsArray,
      courses: coursesArray
    };

    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/instructors/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch('http://localhost:5000/api/instructors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      setFormData(defaultForm);
      setEditingId(null);
      fetchInstructors();
    } catch (error) {
      console.error('Lỗi khi lưu giảng viên:', error);
      alert('Có lỗi xảy ra khi lưu giảng viên.');
    }
  };

  const handleEdit = (instructor) => {
    setEditingId(instructor._id);
    setFormData({
      ...instructor,
      skills: instructor.skills?.join(', ') || '',
      courses: JSON.stringify(instructor.courses || [])
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) {
      try {
        await fetch(`http://localhost:5000/api/instructors/${id}`, {
          method: 'DELETE'
        });
        fetchInstructors();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(defaultForm);
  };

  return (
    <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      <div className="admin-table-wrapper" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{marginTop: 0, color: '#0f172a'}}>Danh sách Giảng viên</h2>
        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px 8px' }}>Tên</th>
              <th style={{ padding: '12px 8px' }}>Chức danh</th>
              <th style={{ padding: '12px 8px', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map(instructor => (
              <tr key={instructor._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{instructor.name}</td>
                <td style={{ padding: '12px 8px', color: '#64748b' }}>{instructor.role}</td>
                <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                  <button 
                    onClick={() => handleEdit(instructor)}
                    style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}
                  >Sửa</button>
                  <button 
                    onClick={() => handleDelete(instructor._id)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >Xóa</button>
                </td>
              </tr>
            ))}
            {instructors.length === 0 && (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>Chưa có giảng viên nào.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-form-wrapper" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{marginTop: 0, color: '#0f172a'}}>{editingId ? 'Sửa Giảng viên' : 'Thêm Giảng viên Mới'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên Giảng viên *</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Chức danh / Vai trò *</label>
            <input type="text" name="role" value={formData.role} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Màu sắc Card</label>
                <select name="color" value={formData.color} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="blue">Xanh dương (Blue)</option>
                    <option value="purple">Tím (Purple)</option>
                    <option value="green">Xanh lá (Green)</option>
                    <option value="orange">Cam (Orange)</option>
                    <option value="red">Đỏ (Red)</option>
                </select>
            </div>
            <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kinh nghiệm</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Link Ảnh Chân dung (URL) *</label>
            <input type="text" name="image" value={formData.image} onChange={handleInputChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giới thiệu ngắn (Bio) *</label>
            <textarea name="bio" value={formData.bio} onChange={handleInputChange} required rows="3" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}></textarea>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kỹ năng cốt lõi (Cách nhau bằng dấu phẩy)</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="VD: Adobe Photoshop, UI/UX Design..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>
          <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px' }}>
            <legend style={{ fontWeight: 'bold', padding: '0 5px' }}>Liên kết Mạng xã hội</legend>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input type="text" name="socials.facebook" value={formData.socials.facebook} onChange={handleInputChange} placeholder="Facebook URL" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" name="socials.linkedin" value={formData.socials.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" name="socials.behance" value={formData.socials.behance} onChange={handleInputChange} placeholder="Behance URL" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                <input type="text" name="socials.dribbble" value={formData.socials.dribbble} onChange={handleInputChange} placeholder="Dribbble URL" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
          </fieldset>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Khóa học giảng dạy (Chuỗi JSON array)</label>
            <textarea name="courses" value={formData.courses} onChange={handleInputChange} rows="3" placeholder='[{"name":"Design", "link":"/courses#design"}]' style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '12px' }}></textarea>
            <small style={{ color: '#64748b' }}>VD: <code>[&#123;"name":"Tên","link":"/link"&#125;]</code></small>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" style={{ flex: 1, background: '#10b981', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              {editingId ? 'Cập nhật Giảng viên' : 'Thêm Giảng viên'}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} style={{ background: '#94a3b8', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminInstructors;
