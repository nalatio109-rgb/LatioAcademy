import React, { useState, useEffect } from 'react';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('https://latioacademyserver-production.up.railway.app/api/contacts');
      const data = await response.json();
      setContacts(data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải danh sách liên hệ:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`https://latioacademyserver-production.up.railway.app/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        // Update local state to reflect change without refetching immediately
        setContacts(contacts.map(c => c._id === id ? { ...c, status: newStatus } : c));
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Lỗi cập nhật:', error);
      alert('Lỗi kết nối Server');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tin nhắn liên hệ này?')) {
      try {
        const response = await fetch(`https://latioacademyserver-production.up.railway.app/api/contacts/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setContacts(contacts.filter(c => c._id !== id));
        } else {
          alert('Có lỗi xảy ra khi xóa');
        }
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', month: '2-digit', day: '2-digit', 
      hour: '2-digit', minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Mới': return { bg: '#fee2e2', text: '#ef4444' }; // Red
      case 'Đang tư vấn': return { bg: '#fef3c7', text: '#f59e0b' }; // Yellow
      case 'Đã chốt': return { bg: '#dcfce7', text: '#10b981' }; // Green
      case 'Hủy': return { bg: '#f1f5f9', text: '#64748b' }; // Gray
      default: return { bg: '#f1f5f9', text: '#64748b' };
    }
  };

  return (
    <div className="admin-grid" style={{ display: 'block' }}>
      <div className="admin-table-wrapper" style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{marginTop: 0, color: '#0f172a', marginBottom: '20px'}}>Quản lý Form Liên Hệ</h2>
        
        {loading ? (
          <p style={{textAlign: 'center', color: '#64748b', padding: '20px'}}>Đang tải dữ liệu...</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 8px' }}>Thời gian</th>
                  <th style={{ padding: '12px 8px' }}>Khách hàng</th>
                  <th style={{ padding: '12px 8px' }}>Liên hệ</th>
                  <th style={{ padding: '12px 8px' }}>Khóa học quan tâm</th>
                  <th style={{ padding: '12px 8px' }}>Lời nhắn</th>
                  <th style={{ padding: '12px 8px' }}>Trạng thái</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      Chưa có tin nhắn liên hệ nào.
                    </td>
                  </tr>
                ) : (
                  contacts.map(contact => {
                    const statusStyle = getStatusColor(contact.status);
                    
                    return (
                      <tr key={contact._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 8px', color: '#64748b', fontSize: '13px' }}>
                          {formatDate(contact.createdAt)}
                        </td>
                        <td style={{ padding: '12px 8px', fontWeight: 'bold', color: '#0f172a' }}>
                          {contact.name}
                        </td>
                        <td style={{ padding: '12px 8px', fontSize: '14px' }}>
                          <div style={{marginBottom: '4px'}}><i className="ph ph-phone text-blue-500"></i> {contact.phone}</div>
                          <div><i className="ph ph-envelope text-purple-500"></i> {contact.email}</div>
                        </td>
                        <td style={{ padding: '12px 8px', color: '#334155', fontSize: '14px' }}>
                          {contact.course === 'video-editing' ? 'Edit Video CapCut' :
                           contact.course === '2d-design' ? 'Design 2D' :
                           contact.course === 'ads-marketing' ? 'Ads Marketing' :
                           contact.course === 'other' ? 'Khác' :
                           <span style={{color: '#94a3b8'}}>- Không chọn -</span>}
                        </td>
                        <td style={{ padding: '12px 8px', fontSize: '14px', maxWidth: '250px' }}>
                          <div style={{
                            background: '#f8fafc', padding: '8px', borderRadius: '6px', 
                            border: '1px solid #e2e8f0', color: '#475569',
                            whiteSpace: 'pre-wrap', maxHeight: '80px', overflowY: 'auto'
                          }}>
                            {contact.message}
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <select 
                            value={contact.status || 'Mới'}
                            onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                            style={{ 
                              padding: '6px 10px', 
                              borderRadius: '20px', 
                              border: `1px solid ${statusStyle.text}`,
                              background: statusStyle.bg,
                              color: statusStyle.text,
                              fontWeight: 'bold',
                              outline: 'none',
                              cursor: 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            <option value="Mới" style={{background: 'white', color: 'black'}}>Mới</option>
                            <option value="Đang tư vấn" style={{background: 'white', color: 'black'}}>Đang tư vấn</option>
                            <option value="Đã chốt" style={{background: 'white', color: 'black'}}>Đã chốt</option>
                            <option value="Hủy" style={{background: 'white', color: 'black'}}>Hủy</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <button 
                            onClick={() => handleDelete(contact._id)}
                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
