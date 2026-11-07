# Kế Hoạch Triển Khai: POWER TREE Smart Dashboard (STEM Lớp 3)

Xây dựng bảng điều khiển thông minh **POWER TREE** trực quan, thân thiện dành cho học sinh tiểu học (lớp 3) để khám phá năng lượng tái tạo (Mặt trời & Rung động Piezo) cùng hệ thống tuần hoàn nước tự động điều khiển bởi Arduino, kèm cơ chế an toàn và chế độ mô phỏng (Demo Mode) chuẩn khoa học STEM.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Cam kết tính trung thực & Quy tắc an toàn bắt buộc (Safety Interlock)**:
> 1. **Nhãn dữ liệu minh bạch**: Toàn bộ số đo khi chưa cắm cáp Arduino sẽ hiển thị rõ ràng `[MÔ PHỎNG / SIMULATED DATA]`. Trạng thái Arduino hiển thị trung thực `Chưa kết nối phần cứng - Đang chạy chế độ mô phỏng`.
> 2. **Bảo vệ chống cháy bơm (Dry-Run Protection)**: Khi phao mức thấp (Phao 1) ở trạng thái CẠN (OFF), hệ thống cưỡng bức KHÓA BƠM và phát cảnh báo "Bể hết nước - Tự động ngắt để bảo vệ máy bơm!".
> 3. **Bảo vệ pin (Low Battery Protection)**: Khi pin dưới 15%, hệ thống cảnh báo và ngắt bơm để duy trì tuổi thọ cell pin.
> 4. **Giao tiếp Web Serial API**: Trình duyệt có thể kết nối trực tiếp với Arduino Uno/Nano/ESP32 qua cáp USB chỉ với 1 cú click mà không cần cài phần mềm trung gian.

---

### 1. Tổng Quan & Ý Tưởng Cốt Lõi (Overview & Core Concept)

- **Mô hình "Cây Năng Lượng" (Power Tree)**:
  - **Tán cây (Lá mặt trời)**: Thu ánh sáng mặt trời tạo ra dòng điện sạch (Solar Energy).
  - **Cành cây (Bộ thu Piezo rung động)**: Khi có giọt mưa rơi hoặc gió lay cành, các đĩa áp điện (Piezoelectric sensor) biến rung động cơ học thành các xung điện.
  - **Thân cây (Bình ắc quy/Pin lưu trữ)**: Tích lũy năng lượng chung từ cả Mặt trời và Piezo.
  - **Gốc rễ (Hệ thống nước & Tưới cây thông minh)**: Bể chứa nước tuần hoàn với 3 công tắc phao (Mực Nước Thấp - Trung Bình - Cao) và một máy bơm mini 5V DC tưới cây tự động khi đủ nước và pin còn điện.
- **Đối tượng sử dụng**: Học sinh lớp 3 (8–9 tuổi), giáo viên STEM và phụ huynh hướng dẫn.
- **Ngôn ngữ truyền đạt**: Hình ảnh hóa trực quan sinh động, ví von dễ hiểu ("Cục pin đang ăn no", "Mưa rơi gõ nhịp tạo điện", "Chiếc phao cứu sinh bảo vệ máy bơm"), kết hợp số liệu khoa học chính xác có đơn vị (V, mA, %, ml/s).

---

### 2. Trải Nghiệm Người Dùng & Thiết Kế Giao Diện (UX & Visual Design)

#### A. Kiến Trúc Màn Hình (Screen Layout)
Giao diện chia làm 4 khu vực mạch lạc, dễ thao tác trên màn hình máy tính hoặc máy tính bảng lớp học:

1. **Thanh tiêu đề (Header STEM Top Bar)**:
   - Tên thương hiệu: **POWER TREE · Smart Eco Dashboard**
   - Bộ chọn chế độ: Chuyển đổi giữa `Mô phỏng lớp học (Demo Mode)` và `Kết nối Arduino USB (Web Serial)`
   - Trạng thái an toàn hệ thống (Interlock OK / Cảnh báo bảo vệ)
2. **Khu vực trung tâm: Cây Năng Lượng Tương Tác (Interactive Power Tree Stage)**:
   - Hình minh họa Cây sinh thái SVG tương tác với các dòng hạt năng lượng (Energy Flow Particles) chuyển động từ Lá Mặt Trời & Cành Piezo về Trái Tim Thân Cây (Pin lưu trữ).
   - Thao tác tương tác nhanh: Kéo thanh trượt "Độ sáng mặt trời", bấm nút "Mưa rơi tí tách vào đĩa Piezo" để thấy năng lượng nạp vào pin ngay lập tức.
3. **Ba Khối Điều Khiển & Giám Sát Chi Tiết (3 Main Monitoring Cards)**:
   - **Khu vực 1: Tán Cây Năng Lượng Mặt Trời (Solar Power)**
     - Điện áp ($0 - 6.0\text{V}$), Dòng điện ($0 - 300\text{mA}$), Công suất ($\text{mW}$).
     - Trạng thái trời: Nắng gắt / Nắng nhẹ / Trời râm / Ban đêm.
   - **Khu vực 2: Cành Cây Thu Nhịp Rung (Piezo Rain & Motion)**
     - Số xung nhịp rung (Pulses/min), Điện áp đỉnh tích lũy ($0 - 5.0\text{V}$).
     - Nút gõ thử nghiệm: Học sinh click chuột hoặc bấm phím để giả lập giọt mưa rơi.
   - **Khu vực 3: Bể Nước Tuần Hoàn & Máy Bơm Mini (Water Management)**
     - Bình chứa nước mặt cắt trực quan với 3 vạch công tắc phao (Phao 1: Đáy/Cạn, Phao 2: Vừa, Phao 3: Đầy).
     - Máy bơm mini 5V với cánh quạt xoay khi bơm chạy và đường ống nước tưới ngược về rễ cây.
     - Nút bật/tắt bơm thủ công & Chế độ tự động (Auto Irrigation Mode).
4. **Bảng Trạng Thái Pin & Trung Tâm Điều Khiển Arduino (Battery & Controller)**:
   - Mức pin trực quan ($0 - 100\%$, $3.2\text{V} - 4.2\text{V}$), thời gian sử dụng ước tính.
   - Cửa sổ truyền thông Arduino: Nút "Kết nối Arduino qua cổng USB", bảng log nhận dữ liệu Serial JSON thời gian thực, sơ đồ chân nối pinout (Pin D2, D3, D4 cho 3 phao; Pin D8 cho Relay bơm; A0 cho Solar; A1 cho Piezo).
5. **Góc Khoa Học & Thử Thách Vui Cho Học Sinh Lớp 3 (STEM Explorer)**:
   - 3 kịch bản thí nghiệm tương tác:
     - *Thử thách 1*: "Mùa hè chói chang" - Tối đa hóa năng lượng mặt trời.
     - *Thử thách 2*: "Cơn mưa rào rực rỡ" - Khám phá nguyên lý áp điện piezo từ hạt mưa.
     - *Thử thách 3*: "Giải cứu máy bơm" - Thử rút cạn nước xem hệ thống an toàn tự ngắt bơm như thế nào!

#### B. Màu Sắc & Kiểu Chữ (Design System)
- **Bảng màu STEM 60-30-10**:
  - 60% Nền: Trắng ngà thân thiện (`#F8FAFC` / Slate 50), không gây mỏi mắt cho học sinh.
  - 30% Khung thẻ: Xanh lá cây sinh thái (`#059669` / Emerald) đại diện cho cây xanh, Xanh da trời (`#0284C7` / Sky) cho nước, Vàng cam rực rỡ (`#F59E0B` / Amber) cho ánh mặt trời.
  - 10% Điểm nhấn: Nút bấm tương tác màu sắc rõ rệt, huy hiệu trạng thái có cả chữ lẫn biểu tượng.
- **Phông chữ**: `Plus Jakarta Sans` tròn trịa, hiện đại, kích thước chữ lớn $\ge 16\text{px}$, tiêu đề rõ ràng, các con số hiển thị font Monospace Tabular (`tabular-nums`) để không bị nhảy giật số khi cập nhật.

---

### 3. Nguyên Tắc An Toàn & Quyết Định Kỹ Thuật

```
                    ┌────────────────────────────┐
                    │    AN TOÀN HỆ THỐNG NƯỚC   │
                    └─────────────┬──────────────┘
                                  │
                 ┌────────────────┴────────────────┐
                 ▼                                 ▼
       Phao 1 (Mức Thấp) = OFF            Phao 3 (Mức Cao) = ON
      ┌─────────────────────────┐        ┌─────────────────────────┐
      │  BỂ CẠN NƯỚC:           │        │  BỂ ĐẦY NƯỚC:           │
      │  - CẤM BẬT MÁY BƠM      │        │  - Báo động chống tràn  │
      │  - Tự động ngắt Relay   │        │  - Cho phép tưới xả bớt │
      │  - Đèn cảnh báo ĐỎ      │        └─────────────────────────┘
      └─────────────────────────┘
```

- **Quyết định 1: Giao thức Web Serial API trực tiếp**:
  - *Lựa chọn*: Sử dụng `navigator.serial` trên trình duyệt Chrome/Edge/Opera để kết nối trực tiếp với cổng COM của Arduino Uno qua cáp USB.
  - *Lợi ích*: Học sinh và giáo viên không cần cài đặt phần mềm server hay Node.js phức tạp; cắm cáp USB vào máy tính là web nhận ngay.
  - *Phương án dự phòng*: Khi chưa kết nối hoặc trình duyệt không hỗ trợ Web Serial, hệ thống tự động chạy trình mô phỏng tương tác (Simulation Engine) với đầy đủ thanh điều khiển.
- **Quyết định 2: Định dạng dữ liệu Serial JSON**:
  - Dữ liệu gửi từ Arduino lên web:
    `{"solar_mv":4800,"piezo_mv":1200,"batt_pct":85,"float_low":1,"float_mid":1,"float_high":0,"pump_state":0}`
  - Lệnh gửi từ Web xuống Arduino:
    `{"cmd":"SET_PUMP","val":1}` hoặc `{"cmd":"SET_MODE","val":"AUTO"}`.
- **Quyết định 3: Minh bạch thông số linh kiện thực tế**:
  - Pin mặt trời: $5\text{V} - 6\text{V}$, dòng định mức tối đa $200\text{mA} - 300\text{mA}$.
  - Đĩa Piezo: $27\text{mm}$ hoặc $35\text{mm}$, phát xung $0 - 5\text{V}$ qua mạch chỉnh lưu diode cầu + tụ lọc.
  - Pin lưu trữ chung: Khối pin Lithium 1S $3.7\text{V} - 4.2\text{V}$ dung lượng $2000\text{mAh}$ qua mạch sạc TP4056.
  - 3 Công tắc phao: Loại tiếp điểm từ (Reed switch float switch) gắn ở 3 độ cao $20\%$, $50\%$, $90\%$ đáy bình.
  - Máy bơm mini: $5\text{V}$ DC chìm, tiêu thụ dòng khoảng $150\text{mA} - 250\text{mA}$, điều khiển qua module Relay hoặc Mosfet.

---

### 4. Kiến Trúc Phần Mềm & Sơ Đồ Khối

```
┌────────────────────────────────────────────────────────────────────────┐
│                        POWER TREE WEB APP (React)                      │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     Application State (React)                  │   │
│   │  - SystemMode: 'SIMULATION' | 'ARDUINO_SERIAL'                 │   │
│   │  - SensorData: Solar(V,mA), Piezo(V,pulses), Battery(%), Water │   │
│   │  - SafetyInterlock: isDryRun, isBatteryLow, canPumpRun         │   │
│   │  - DemoScenario: 'SUNNY' | 'RAINY' | 'DROUGHT' | 'BALANCED'    │   │
│   └───────────────▲────────────────────────────────▲───────────────┘   │
│                   │                                │                   │
│   ┌───────────────┴───────────────┐ ┌──────────────┴───────────────┐   │
│   │     Simulation Engine         │ │    Web Serial Controller     │   │
│   │  - Thanh trượt ánh sáng       │ │  - navigator.serial reader   │   │
│   │  - Giả lập mưa rơi Piezo      │ │  - LineBreakTransformer      │   │
│   │  - Tính toán nạp xả pin       │ │  - Parse JSON telemetry      │   │
│   │  - Mô phỏng bơm hút cạn nước  │ │  - Gửi lệnh bật/tắt bơm      │   │
│   └───────────────────────────────┘ └──────────────┬───────────────┘   │
└────────────────────────────────────────────────────┼───────────────────┘
                                                     │ Cáp USB
                                                     ▼
                                    ┌─────────────────────────────────┐
                                    │      ARDUINO HARDWARE           │
                                    │  - A0: Solar ADC qua cầu phân áp│
                                    │  - A1: Piezo ADC qua chỉnh lưu  │
                                    │  - D2, D3, D4: 3 Công tắc phao  │
                                    │  - D8: Điều khiển Relay bơm mini│
                                    └─────────────────────────────────┘
```

---

### 5. Kế Hoạch Triển Khai Từng Giai Đoạn

- **Giai đoạn 1: Khung sườn ứng dụng & Bộ mô phỏng (Simulation & Safety Engine)**
  - Thiết lập giao diện tổng thể chuẩn Tailwind CSS, hỗ trợ responsive.
  - Xây dựng state quản lý toàn diện: Pin, Solar, Piezo, 3 công tắc phao, máy bơm.
  - Cài đặt quy tắc an toàn bảo vệ chống cháy máy bơm (Dry-run interlock) và ngắt pin yếu.
  - Xây dựng 4 kịch bản Demo Mode nhanh cho lớp học.

- **Giai đoạn 2: Trực quan hóa tương tác (Interactive Visual Stage)**
  - Vẽ mô hình SVG động Cây Năng Lượng (Power Tree): Lá hấp thụ nắng, cành rung giọt mưa, dòng hạt điện tích chảy về pin.
  - Vẽ bình nước mặt cắt động với sóng nước, 3 phao hiển thị độ nổi/chìm thực tế và bơm mini phun nước.
  - 3 thẻ chi tiết thông số: Solar Card, Piezo Card, Water Card với giải thích trực quan phù hợp học sinh lớp 3.

- **Giai đoạn 3: Tích hợp Arduino Web Serial & Công cụ STEM**
  - Viết module Web Serial API kết nối cổng USB trình duyệt với nút kết nối 1-click.
  - Thiết kế tab "Kỹ sư nhí Arduino":
    - Sơ đồ chân cắm dây màu sắc rõ ràng (Pinout diagram).
    - Mã nguồn Arduino `.ino` hoàn chỉnh, có chú thích tiếng Việt từng dòng lệnh để giáo viên/học sinh chỉ cần copy vào Arduino IDE nạp vào mạch.
    - Cửa sổ Serial Monitor trực tiếp xem dữ liệu thô gửi nhận.

- **Giai đoạn 4: Góc học tập STEM, Kiểm thử an toàn & Hướng dẫn triển khai Vercel/GitHub**
  - Tích hợp mục "Khám phá khoa học": Giải thích nguyên lý Quang điện, Áp điện và Cơ chế tự động hóa bằng ngôn ngữ dễ thương.
  - Kiểm thử toàn diện logic: Bể cạn không thể bật bơm; Pin kiệt tự ngắt; Bão hòa pin khi đầy.
  - Hướng dẫn chi tiết cách đẩy mã nguồn lên GitHub và triển khai lên Vercel miễn phí.

---

### 6. Kế Hoạch Kiểm Thử (Verification Plan)

| Kịch bản kiểm thử | Hành động | Kết quả mong đợi |
|---|---|---|
| **Kiểm tra chống cháy bơm khi cạn nước** | Kéo mực nước xuống dưới Phao 1 (Low) | Nút bật bơm bị vô hiệu hóa, thông báo an toàn màu đỏ xuất hiện: "Nguy hiểm: Bể cạn nước, khóa bơm để bảo vệ!" |
| **Kiểm tra nạp năng lượng mặt trời** | Kéo thanh trượt nắng lên 100% | Điện áp Solar tăng lên ~5.8V, công suất tăng, hạt năng lượng màu vàng bay về pin, % pin tăng dần |
| **Kiểm tra thu nhịp rung Piezo** | Nhấp chuột liên tục vào nút "Tạo giọt mưa" | Xung Piezo nhảy vọt, điện áp đỉnh tăng, hạt năng lượng màu tím chuyển về pin |
| **Kiểm tra tự động ngắt khi pin yếu** | Giảm pin xuống dưới 15% | Cảnh báo pin yếu, máy bơm tự ngắt nếu đang chạy |
| **Kiểm tra kết nối Arduino Web Serial** | Bấm "Kết nối Arduino qua USB" | Trình duyệt mở hộp thoại chọn cổng COM, hiển thị log nhận dữ liệu khi kết nối thành công hoặc hướng dẫn khi chưa có mạch |
