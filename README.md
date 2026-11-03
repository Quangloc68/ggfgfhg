# MEDTECH MANAGER - Phần mềm Quản lý Trang thiết bị Y tế & Đấu thầu Bệnh viện

## 🎯 Xem ứng dụng ngay

Sau khi build thành công, ứng dụng đã được serve tự động. Bạn có thể xem trực tiếp qua **link preview** được cung cấp bởi hệ thống.

---

## 📱 Cách chia sẻ cho mọi người xem

### Cách 1: Chia sẻ link Preview (Đơn giản nhất)

Nếu bạn đang sử dụng môi trường development này, chỉ cần **copy link preview** và gửi cho người khác. Họ có thể truy cập trực tiếp mà không cần cài đặt gì.

### Cách 2: Deploy lên GitHub Pages (Miễn phí, Vĩnh viễn)

**Bước 1:** Tạo repository trên GitHub
```bash
# Khởi tạo git
git init
git add .
git commit -m "Initial commit: MEDTECH Manager"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/medtech-manager.git
git push -u origin main
```

**Bước 2:** Cấu hình GitHub Pages
1. Vào repository trên GitHub
2. Chọn **Settings** → **Pages**
3. Trong phần **Source**, chọn **GitHub Actions**
4. Tạo workflow file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Bước 3:** Push code lên GitHub
```bash
git add .
git commit -m "Add GitHub Pages workflow"
git push
```

Sau 2-3 phút, ứng dụng sẽ có tại: `https://YOUR_USERNAME.github.io/medtech-manager/`

**Lưu ý:** Cần thêm `base: '/medtech-manager/'` vào `vite.config.js`:
```javascript
export default defineConfig({
  base: '/medtech-manager/',
  plugins: [react(), tailwindcss()],
  // ...
});
```

### Cách 3: Deploy lên Vercel (Miễn phí, Chuyên nghiệp)

**Bước 1:** Cài đặt Vercel CLI
```bash
npm install -g vercel
```

**Bước 2:** Deploy
```bash
vercel
```

Làm theo hướng dẫn, Vercel sẽ tự động build và deploy. Bạn sẽ nhận được link dạng: `https://medtech-manager.vercel.app`

**Ưu điểm:**
- Tự động HTTPS
- CDN toàn cầu
- Deploy tự động khi push code
- Miễn phí cho dự án cá nhân

### Cách 4: Deploy lên Netlify (Miễn phí, Dễ dùng)

**Cách A: Drag & Drop**
1. Truy cập https://app.netlify.com/drop
2. Kéo thả thư mục `dist` vào
3. Nhận link ngay lập tức

**Cách B: Kết nối GitHub**
1. Push code lên GitHub
2. Vào https://app.netlify.com
3. Chọn **New site from Git**
4. Chọn repository
5. Build command: `npm run build`
6. Publish directory: `dist`

### Cách 5: Chạy Local trên máy tính

**Yêu cầu:** Node.js 18+

**Bước 1:** Clone hoặc tải code về
```bash
git clone https://github.com/YOUR_USERNAME/medtech-manager.git
cd medtech-manager
```

**Bước 2:** Cài đặt dependencies
```bash
npm install
```

**Bước 3:** Chạy development server
```bash
npm run dev
```

Mở trình duyệt: `http://localhost:3000`

**Bước 4:** Build production (tùy chọn)
```bash
npm run build
npm run preview
```

---

## 🌐 Truy cập từ xa (Không cần Deploy)

Nếu muốn người khác truy cập qua mạng nội bộ:

**Bước 1:** Chạy server với host 0.0.0.0
```bash
npm run dev -- --host 0.0.0.0
```

**Bước 2:** Tìm IP máy tính
- Windows: `ipconfig` → xem IPv4 Address
- Mac/Linux: `ifconfig` hoặc `ip addr`

**Bước 3:** Chia sẻ link
```
http://YOUR_IP:3000
```

Ví dụ: `http://192.168.1.100:3000`

---

## 💾 Lưu ý về Dữ liệu

Ứng dụng sử dụng **localStorage** để lưu dữ liệu trên trình duyệt. Điều này có nghĩa:

✅ **Ưu điểm:**
- Không cần database
- Không cần server backend
- Dữ liệu lưu ngay trên máy người dùng
- Hoạt động offline

❌ **Hạn chế:**
- Mỗi người dùng có dữ liệu riêng
- Không đồng bộ giữa các thiết bị
- Mất dữ liệu nếu xóa cache/trình duyệt

**Giải pháp:**
- Sử dụng chức năng **Sao lưu/Khôi phục** trong phần Cài đặt
- Export dữ liệu ra file JSON để backup
- Import dữ liệu từ file JSON khi cần

---

## 📊 Tính năng chính

✅ Dashboard với biểu đồ thống kê trực quan  
✅ Quản lý trang thiết bị y tế (CRUD, QR Code, in ấn)  
✅ Quản lý khoa/phòng  
✅ Quản lý mua sắm & đấu thầu  
✅ Quản lý nhà cung cấp & hợp đồng  
✅ Tiếp nhận & nghiệm thu thiết bị  
✅ Quản lý bảo trì & bảo dưỡng (cảnh báo tự động)  
✅ Quản lý sửa chữa & sự cố  
✅ Quản lý đào tạo  
✅ Điều chuyển & thanh lý  
✅ Báo cáo & thống kê (Excel, CSV, PDF)  
✅ Phân quyền 7 vai trò  
✅ Sao lưu & khôi phục dữ liệu  

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Charts:** Recharts
- **Export:** SheetJS (Excel), FileSaver.js
- **QR Code:** qrcode library
- **Build tool:** Vite

---

## 📞 Hỗ trợ

Nếu gặp vấn đề khi deploy, vui lòng:
1. Kiểm tra console trình duyệt (F12) để xem lỗi
2. Đảm bảo Node.js phiên bản 18+
3. Xóa node_modules và cài lại: `rm -rf node_modules && npm install`

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập và phi thương mại.

---

**Chúc bạn triển khai thành công!** 🚀
