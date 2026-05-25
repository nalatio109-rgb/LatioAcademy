import React from 'react';

const TrustedBy = () => {
  return (
    <div className="tools-section">
      <div className="tools-title">CÔNG CỤ THỰC HÀNH CHUYÊN NGHIỆP</div>
      <div className="tools-grid-row">
        <div className="tool-badge badge-ps" data-tooltip="Phần mềm chỉnh sửa ảnh & thiết kế đồ họa số 1 thế giới">
          <div className="tool-icon-box">Ps</div>
          <span className="tool-name">Adobe Photoshop</span>
        </div>
        <div className="tool-badge badge-cc" data-tooltip="Công cụ Edit Video chuyên nghiệp, thao tác cực nhanh">
          <div className="tool-icon-box">
            <svg viewBox="0 0 512 509.659" style={{ width: '18px', height: '18px' }}>
              <path fill="#fff" fillRule="nonzero" d="M109.095 181.505c-.123 8.897 0 17.813 0 26.71a5.41 5.41 0 003.225 4.917 23898.407 23898.407 0 0084.108 41.646c-27.832 13.672-55.563 27.526-83.353 41.259a5.938 5.938 0 00-4.081 4.876v26.771c1.854 18.195 15.823 32.817 33.913 35.503 3.509.326 7.02.266 10.529.266l155.85.001a45.08 45.08 0 0011.224-.92 40.825 40.825 0 0026.137-20.015 63.699 63.699 0 004.288-11.226c15.997 8.325 32.341 16.079 48.462 24.179.385.291.857.447 1.343.447a2.266 2.266 0 002.265-2.265v-.016-27.669a4.695 4.695 0 00-3.143-4.079l-135.323-67.112c45.203-22.431 90.412-44.876 135.63-67.335a4.573 4.573 0 002.754-4.082v-27.628a2.183 2.183 0 00-3.142-1.673l-49.135 24.363a42.189 42.189 0 00-6.388-14.917 40.613 40.613 0 00-30.097-17.422l-167.133-.001c-19.615.91-35.688 15.918-37.933 35.424v-.002z"/>
              <path fill="#fff" fillRule="nonzero" d="M140.049 181.689a10.082 10.082 0 019.345-5.55h161.545l.106-.001c5.066 0 9.368 3.72 10.096 8.734.205 2.714.102 5.428 0 8.162l-90.597 44.891c-30.608-15.018-61.03-30.22-91.535-45.339.142-3.632-.633-7.53 1.04-10.897zM139.009 317.095a24846.007 24846.007 0 0191.351-45.319c30.322 14.773 60.521 29.954 90.802 44.89-.204 3.918.755 8.162-1.305 11.773a10.085 10.085 0 01-8.755 5.08h-.082l-161.605.002-.277.002a10.202 10.202 0 01-9.007-5.411c-1.796-3.386-.98-7.345-1.122-11.017z"/>
            </svg>
          </div>
          <span className="tool-name">CapCut PC</span>
        </div>
        <div className="tool-badge badge-mj" data-tooltip="Công cụ AI vẽ tranh và sáng tạo hình ảnh đỉnh cao">
          <div className="tool-icon-box">Mj</div>
          <span className="tool-name">AI Midjourney</span>
        </div>
        <div className="tool-badge badge-pr" data-tooltip="Dựng phim và xử lý video tiêu chuẩn Hollywood">
          <div className="tool-icon-box">Pr</div>
          <span className="tool-name">Premiere Pro</span>
        </div>
        <div className="tool-badge badge-ai" data-tooltip="Thiết kế vector, logo và ấn phẩm truyền thông">
          <div className="tool-icon-box">Ai</div>
          <span className="tool-name">Illustrator</span>
        </div>
      </div>
      
      <div className="partners-row">
        <span className="partners-label">Đối tác tuyển dụng học viên:</span>
        <div className="partner-tags">
          <span className="partner-tag">Latio Digital</span>
          <span className="partner-tag">Schannel Agency</span>
          <span className="partner-tag">VTV Production</span>
          <span className="partner-tag">Arena Studio</span>
        </div>
      </div>
    </div>
  );
};

export default TrustedBy;
