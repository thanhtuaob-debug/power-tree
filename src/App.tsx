import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  Layers,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Sliders,
  ShieldAlert,
  BarChart3,
  Search,
  Power,
  Cpu,
  Factory,
  Home,
  Sun,
  BatteryCharging,
  Info,
  HelpCircle
} from 'lucide-react';

interface PowerNode {
  id: string;
  name: string;
  code: string;
  type: 'substation' | 'transformer' | 'renewable' | 'storage' | 'industrial' | 'residential';
  level: number;
  parentId?: string;
  voltage: string;
  powerKw: number;
  maxPowerKw: number;
  currentAmp: number;
  status: 'online' | 'warning' | 'offline';
  temperatureC: number;
  breakerClosed: boolean;
  children?: string[];
}

const INITIAL_NODES: PowerNode[] = [
  {
    id: 'node-root',
    name: 'Trạm Trung Tâm 110kV/22kV',
    code: 'TBA-CENTRAL-01',
    type: 'substation',
    level: 0,
    voltage: '110 kV',
    powerKw: 2450.0,
    maxPowerKw: 3000.0,
    currentAmp: 12.8,
    status: 'online',
    temperatureC: 48,
    breakerClosed: true,
    children: ['node-dist-a', 'node-dist-b', 'node-dist-c'],
  },
  {
    id: 'node-dist-a',
    name: 'Nhánh Phân Phối A - Khu Công Nghiệp',
    code: 'FEEDER-22KV-IND',
    type: 'transformer',
    level: 1,
    parentId: 'node-root',
    voltage: '22 kV',
    powerKw: 1180.5,
    maxPowerKw: 1500.0,
    currentAmp: 31.0,
    status: 'online',
    temperatureC: 52,
    breakerClosed: true,
    children: ['node-ind-1', 'node-ind-2'],
  },
  {
    id: 'node-dist-b',
    name: 'Nhánh Phân Phối B - Đô Thị & Dân Cư',
    code: 'FEEDER-22KV-RES',
    type: 'transformer',
    level: 1,
    parentId: 'node-root',
    voltage: '22 kV',
    powerKw: 680.0,
    maxPowerKw: 1000.0,
    currentAmp: 17.8,
    status: 'online',
    temperatureC: 44,
    breakerClosed: true,
    children: ['node-res-1', 'node-ev-1'],
  },
  {
    id: 'node-dist-c',
    name: 'Nhánh Năng Lượng Tái Tạo & BESS',
    code: 'FEEDER-22KV-GREEN',
    type: 'renewable',
    level: 1,
    parentId: 'node-root',
    voltage: '22 kV',
    powerKw: 589.5,
    maxPowerKw: 800.0,
    currentAmp: 15.5,
    status: 'online',
    temperatureC: 39,
    breakerClosed: true,
    children: ['node-solar-1', 'node-bess-1'],
  },
  {
    id: 'node-ind-1',
    name: 'Nhà Máy Luyện Kim & Chế Tạo',
    code: 'LOAD-IND-01',
    type: 'industrial',
    level: 2,
    parentId: 'node-dist-a',
    voltage: '0.4 kV',
    powerKw: 720.0,
    maxPowerKw: 850.0,
    currentAmp: 1040,
    status: 'warning',
    temperatureC: 62,
    breakerClosed: true,
  },
  {
    id: 'node-ind-2',
    name: 'Khu Chế Xuất & Kho Lạnh Logistic',
    code: 'LOAD-IND-02',
    type: 'industrial',
    level: 2,
    parentId: 'node-dist-a',
    voltage: '0.4 kV',
    powerKw: 460.5,
    maxPowerKw: 650.0,
    currentAmp: 665,
    status: 'online',
    temperatureC: 46,
    breakerClosed: true,
  },
  {
    id: 'node-res-1',
    name: 'Khu Đô Thị Smart City & Chung Cư',
    code: 'LOAD-RES-01',
    type: 'residential',
    level: 2,
    parentId: 'node-dist-b',
    voltage: '0.4 kV',
    powerKw: 420.0,
    maxPowerKw: 600.0,
    currentAmp: 607,
    status: 'online',
    temperatureC: 41,
    breakerClosed: true,
  },
  {
    id: 'node-ev-1',
    name: 'Trạm Sạc Siêu Nhanh EV Hub 180kW',
    code: 'LOAD-EV-01',
    type: 'industrial',
    level: 2,
    parentId: 'node-dist-b',
    voltage: '0.4 kV',
    powerKw: 260.0,
    maxPowerKw: 400.0,
    currentAmp: 375,
    status: 'online',
    temperatureC: 47,
    breakerClosed: true,
  },
  {
    id: 'node-solar-1',
    name: 'Trang Trại Điện Mặt Trời Solar Farm',
    code: 'GEN-SOLAR-01',
    type: 'renewable',
    level: 2,
    parentId: 'node-dist-c',
    voltage: '0.4 kV',
    powerKw: 380.0,
    maxPowerKw: 450.0,
    currentAmp: 548,
    status: 'online',
    temperatureC: 38,
    breakerClosed: true,
  },
  {
    id: 'node-bess-1',
    name: 'Hệ Thống Pin Lưu Trữ BESS 500kWh',
    code: 'STOR-BESS-01',
    type: 'storage',
    level: 2,
    parentId: 'node-dist-c',
    voltage: '0.4 kV',
    powerKw: 209.5,
    maxPowerKw: 350.0,
    currentAmp: 302,
    status: 'online',
    temperatureC: 35,
    breakerClosed: true,
  },
];

export default function App() {
  const [nodes, setNodes] = useState<PowerNode[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-root');
  const [activeTab, setActiveTab] = useState<'tree' | 'deploy' | 'analytics'>('deploy');
  const [showDeployModal, setShowDeployModal] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [gridFrequency, setGridFrequency] = useState<number>(50.02);

  // Live minor fluctuations to simulate real power grid
  useEffect(() => {
    const timer = setInterval(() => {
      setGridFrequency(Number((50.0 + (Math.random() * 0.08 - 0.04)).toFixed(2)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const handleToggleBreaker = (id: string) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          const nextState = !node.breakerClosed;
          return {
            ...node,
            breakerClosed: nextState,
            status: nextState ? (node.powerKw > node.maxPowerKw * 0.85 ? 'warning' : 'online') : 'offline',
          };
        }
        return node;
      })
    );
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredNodes = nodes.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCapacity = nodes
    .filter((n) => n.level === 1)
    .reduce((acc, curr) => acc + curr.powerKw, 0);

  const totalMax = nodes
    .filter((n) => n.level === 1)
    .reduce((acc, curr) => acc + curr.maxPowerKw, 0);

  const getNodeIcon = (type: PowerNode['type']) => {
    switch (type) {
      case 'substation':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'transformer':
        return <Layers className="w-5 h-5 text-blue-500" />;
      case 'renewable':
        return <Sun className="w-5 h-5 text-emerald-500" />;
      case 'storage':
        return <BatteryCharging className="w-5 h-5 text-cyan-500" />;
      case 'industrial':
        return <Factory className="w-5 h-5 text-purple-500" />;
      case 'residential':
        return <Home className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Notification Bar for Vercel Error & Redeploy */}
      <div className="bg-gradient-to-r from-amber-900/80 via-red-950/80 to-amber-950/80 border-b border-amber-600/40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <span className="font-semibold text-amber-300">Giải đáp lỗi Vercel & Màn hình trắng:</span>
            <span className="text-amber-100/90 hidden sm:inline">
              Lỗi xung đột esbuild đã được fix trong mã nguồn. Nhấn xem vị trí Redeploy trên Vercel.
            </span>
          </div>
          <button
            onClick={() => {
              setActiveTab('deploy');
              setShowDeployModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-md shadow-md transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Xem cách Redeploy Vercel ngay
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">POWER TREE 2</h1>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  v2.4.0 Online
                </span>
              </div>
              <p className="text-xs text-slate-400">Hệ thống Giám sát & Phân phối Lưới điện Cây Thông minh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4 bg-slate-800/80 px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-400">Tần số lưới:</span>
                <span className="font-mono font-semibold text-emerald-300">{gridFrequency} Hz</span>
              </div>
              <div className="h-3 w-px bg-slate-700"></div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-400">Tải trung tâm:</span>
                <span className="font-mono font-semibold text-cyan-300">
                  {((totalCapacity / totalMax) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('deploy')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                activeTab === 'deploy'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              <ExternalLink className="w-4 h-4" />
              <span>Hướng Dẫn Vercel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-850 bg-slate-900/40 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex gap-2">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition cursor-pointer ${
              activeTab === 'deploy'
                ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Nơi Bấm Redeploy & Khắc Phục Lỗi</span>
            <span className="bg-red-500/20 text-red-300 text-[10px] px-1.5 py-0.5 rounded-full border border-red-500/30">
              Quan trọng
            </span>
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition cursor-pointer ${
              activeTab === 'tree'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            <span>Sơ Đồ Cây Nguồn Điện (Power Tree)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-cyan-500 text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Chỉ Số Tải & Trạm Biến Áp</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 1: VERCEL REDEPLOY GUIDE & WHITE SCREEN EXPLANATION */}
        {activeTab === 'deploy' && (
          <div className="space-y-6">
            {/* White Screen Explanation Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    1. Vì sao trước đó bạn mở app lại bị "Màn hình trắng"?
                  </h2>
                  <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
                    Có 2 lý do kết hợp dẫn đến màn hình trắng:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                      <div className="font-semibold text-amber-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Lý do 1: File App.tsx rỗng
                      </div>
                      <p className="text-xs text-slate-300">
                        File gốc <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">src/App.tsx</code> ban đầu chỉ trả về <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">&lt;div&gt;&lt;/div&gt;</code> trống trơn, hoàn toàn không có bất kỳ nội dung hay giao diện nào để render ra màn hình.
                      </p>
                    </div>

                    <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                      <div className="font-semibold text-rose-400 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Lý do 2: Bản build Vercel bị fail (Crash)
                      </div>
                      <p className="text-xs text-slate-300">
                        Trên Vercel, lệnh <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">npm install</code> bị crash do xung đột giữa <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">esbuild@0.25</code> và <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">vite@8.3.6</code>. Khi build thất bại, Vercel không có file bundle để hiển thị.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Where to Redeploy Guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-blue-400" />
                  2. "REDEPLOY Ở ĐÂU?" - Hướng dẫn chi tiết từng bước
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Bạn có 2 cách để Redeploy lại dự án <strong className="text-white">POWER-TREE-2</strong>:
                </p>
              </div>

              {/* Way 1: Push to GitHub */}
              <div className="bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-900/40 rounded-xl p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center">
                    A
                  </span>
                  <h3 className="font-bold text-white text-base">
                    Cách 1 (Chuẩn nhất): Đẩy commit mới lên GitHub → Vercel tự động Redeploy
                  </h3>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded border border-emerald-500/30">
                    Khuyên dùng
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Vì Vercel lấy code trực tiếp từ GitHub repo <code className="text-cyan-300">thanhtuaob-debug/POWER-TREE-2</code>, nếu bạn chỉ bấm redeploy trên Vercel mà không cập nhật code thì nó vẫn sẽ lấy lại commit cũ bị lỗi (<code className="text-slate-400">b71e6ed</code>). Hãy chạy lệnh sau trên máy tính của bạn:
                </p>

                <div className="bg-slate-950 p-4 rounded-lg font-mono text-xs text-slate-200 border border-slate-800 relative group">
                  <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
{`# 1. Cập nhật mã nguồn đã sửa (xóa esbuild xung đột trong package.json)
git add .

# 2. Tạo commit sửa lỗi
git commit -m "fix: resolve esbuild peer dependency conflict and update App"

# 3. Đẩy lên nhánh main
git push origin main`}
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'git add .\ngit commit -m "fix: resolve esbuild peer dependency conflict and update App"\ngit push origin main',
                        1
                      )
                    }
                    className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition cursor-pointer"
                    title="Sao chép lệnh"
                  >
                    {copiedIndex === 1 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Ngay sau khi lệnh <code className="text-slate-200">git push</code> hoàn tất, Vercel sẽ tự động phát hiện và tiến hành build lại ngay lập tức (không cần bấm gì thêm).
                </p>
              </div>

              {/* Way 2: Redeploy on Vercel Dashboard */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-700">
                    B
                  </span>
                  <h3 className="font-bold text-white text-base">
                    Cách 2: Nút bấm Redeploy trực tiếp trên giao diện Vercel
                  </h3>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Nếu bạn muốn thao tác trực tiếp trên trang web Vercel:
                </p>

                <div className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                    <span className="font-bold text-blue-400 min-w-5">Bước 1:</span>
                    <div>
                      Truy cập vào <a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer" className="text-blue-400 underline font-semibold">Vercel Dashboard</a> và bấm vào tên dự án của bạn: <strong className="text-white">POWER-TREE-2</strong>.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                    <span className="font-bold text-blue-400 min-w-5">Bước 2:</span>
                    <div>
                      Ở thanh menu trên cùng của dự án, nhấp vào tab <strong className="text-white">Deployments</strong>.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                    <span className="font-bold text-blue-400 min-w-5">Bước 3:</span>
                    <div>
                      Bạn sẽ thấy bản build bị đỏ (<span className="text-rose-400 font-semibold">Error / Failed</span>). Hãy nhìn sang bên phải cùng của dòng đó, click vào biểu tượng <strong className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded">··· (dấu ba chấm)</strong>.
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800/80">
                    <span className="font-bold text-blue-400 min-w-5">Bước 4:</span>
                    <div>
                      Trong menu thả xuống, click chọn <strong className="text-emerald-400 font-semibold">Redeploy</strong>.
                      <div className="text-xs text-slate-400 mt-1">
                        (Mẹo: Bạn có thể bỏ tích ô <em>"Use existing Build Cache"</em> để Vercel tải sạch lại toàn bộ thư viện mới).
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Way 3: Override Install Command in Vercel */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-200 font-bold text-xs flex items-center justify-center border border-slate-700">
                    C
                  </span>
                  <h3 className="font-bold text-white text-base">
                    Cách dự phòng: Cấu hình Install Command trên Vercel nếu npm vẫn báo lỗi
                  </h3>
                </div>
                <p className="text-slate-300 text-sm mb-3">
                  Nếu bạn không muốn thay đổi mã nguồn mà muốn Vercel bỏ qua kiểm tra xung đột:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 pl-2">
                  <li>Vào <strong>Settings</strong> của dự án trên Vercel.</li>
                  <li>Chọn <strong>Build & Development Settings</strong>.</li>
                  <li>Ở dòng <strong>Install Command</strong>, gạt nút <strong>Override</strong> sang bật.</li>
                  <li>Điền lệnh: <code className="bg-slate-900 text-amber-300 px-2 py-0.5 rounded font-mono">npm install --legacy-peer-deps</code></li>
                  <li>Bấm <strong>Save</strong>, sau đó vào lại tab <strong>Deployments</strong> và bấm <strong>Redeploy</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE POWER TREE */}
        {activeTab === 'tree' && (
          <div className="space-y-6">
            {/* Quick Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Tổng công suất tải</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  {totalCapacity.toFixed(1)} <span className="text-xs font-normal text-slate-400">kW</span>
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  Định mức trạm: {totalMax} kW ({((totalCapacity / totalMax) * 100).toFixed(1)}%)
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Năng lượng Xanh (Solar/BESS)</span>
                  <Sun className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                  589.5 <span className="text-xs font-normal text-slate-400">kW</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Đóng góp 24.1% tổng sản lượng
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Trạng thái trạm</span>
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  {nodes.filter((n) => n.status === 'online').length} / {nodes.length}
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">1 cảnh báo tải cao (IND-01)</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Hệ số công suất cosφ</span>
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  0.97
                </div>
                <div className="text-[11px] text-emerald-400 mt-1">Đạt tiêu chuẩn lưới điện</div>
              </div>
            </div>

            {/* Tree Navigation & Node Details */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column: Tree Node List */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-emerald-400" />
                      Sơ đồ phân nhánh Cây Nguồn Điện (Power Tree Nodes)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Bấm vào từng trạm hoặc phụ tải để xem chi tiết thông số và điều khiển aptomat
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm nút..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-48"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  {filteredNodes.map((node) => {
                    const isSelected = node.id === selectedNodeId;
                    const percent = Math.min(100, Math.round((node.powerKw / node.maxPowerKw) * 100));

                    return (
                      <div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-emerald-950/30 border-emerald-500 shadow-md shadow-emerald-500/10'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                        style={{ marginLeft: `${node.level * 16}px` }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`p-2 rounded-lg ${
                              node.status === 'offline'
                                ? 'bg-slate-800 text-slate-500'
                                : node.status === 'warning'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-800/80 text-emerald-400 border border-slate-700'
                            }`}
                          >
                            {getNodeIcon(node.type)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm text-white truncate">{node.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {node.code}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                              <span>Cấp áp: <strong className="text-slate-200">{node.voltage}</strong></span>
                              <span>•</span>
                              <span>Dòng: <strong className="text-slate-200">{node.currentAmp} A</strong></span>
                              <span>•</span>
                              <span>Nhiệt độ: <strong className="text-slate-200">{node.temperatureC}°C</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <div className="font-mono font-bold text-sm text-slate-100">
                              {node.breakerClosed ? `${node.powerKw} kW` : 'CẮT ĐIỆN'}
                            </div>
                            <div className="flex items-center gap-1.5 justify-end text-[11px] text-slate-400">
                              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    !node.breakerClosed
                                      ? 'bg-slate-600'
                                      : percent > 85
                                      ? 'bg-rose-500'
                                      : percent > 70
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${node.breakerClosed ? percent : 0}%` }}
                                ></div>
                              </div>
                              <span>{percent}%</span>
                            </div>
                          </div>

                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              isSelected ? 'text-emerald-400 rotate-90' : 'text-slate-600'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Node Details & Breaker Control */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-cyan-400" />
                      Chi tiết thiết bị & Điều khiển
                    </h3>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border ${
                        selectedNode.status === 'online'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : selectedNode.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {selectedNode.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-semibold">Tên Nút Hệ Thống</div>
                      <div className="text-lg font-bold text-white mt-0.5">{selectedNode.name}</div>
                      <div className="text-xs font-mono text-cyan-400">{selectedNode.code}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Điện áp vận hành</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">
                          {selectedNode.voltage}
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Dòng điện pha I</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">
                          {selectedNode.currentAmp} A
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Công suất P (kW)</div>
                        <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                          {selectedNode.powerKw} kW
                        </div>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Nhiệt độ cuộn dây</div>
                        <div className="text-base font-bold font-mono text-slate-200 mt-0.5">
                          {selectedNode.temperatureC} °C
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                        <span>Mức tải hiện tại so với định mức:</span>
                        <span className="font-bold text-white">
                          {((selectedNode.powerKw / selectedNode.maxPowerKw) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              (selectedNode.powerKw / selectedNode.maxPowerKw) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>0 kW</span>
                        <span>Định mức: {selectedNode.maxPowerKw} kW</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breaker control action */}
                <div className="pt-6 border-t border-slate-800 mt-6">
                  <div className="text-xs text-slate-400 mb-2">Thao tác Đóng/Cắt Máy Cắt (Circuit Breaker):</div>
                  <button
                    onClick={() => handleToggleBreaker(selectedNode.id)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
                      selectedNode.breakerClosed
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{selectedNode.breakerClosed ? 'CẮT MÁY CẮT (TRIP BREAKER)' : 'ĐÓNG MÁY CẮT (CLOSE)'}</span>
                  </button>
                  <p className="text-[11px] text-slate-500 text-center mt-2">
                    Mô phỏng đóng cắt phụ tải an toàn trong môi trường SCADA
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & LOGS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-white text-base flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Biểu đồ phân bổ công suất theo khu vực
              </h3>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Phụ tải Công Nghiệp</div>
                  <div className="text-xl font-bold font-mono text-purple-400 mt-1">1,180.5 kW</div>
                  <div className="text-xs text-slate-500 mt-1">Chiếm 48.2% toàn hệ thống</div>
                  <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500" style={{ width: '48.2%' }}></div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Phụ tải Đô thị Dân Cư & EV</div>
                  <div className="text-xl font-bold font-mono text-teal-400 mt-1">680.0 kW</div>
                  <div className="text-xs text-slate-500 mt-1">Chiếm 27.7% toàn hệ thống</div>
                  <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: '27.7%' }}></div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Nguồn Tái Tạo & BESS</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">589.5 kW</div>
                  <div className="text-xs text-slate-500 mt-1">Chiếm 24.1% toàn hệ thống</div>
                  <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: '24.1%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-white text-base flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Nhật ký vận hành & Sự kiện gần nhất
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-slate-300 font-semibold">[AUTO] Tần số lưới ổn định tại 50.02 Hz</span>
                  </div>
                  <span className="text-slate-500 font-mono">Vừa xong</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-slate-300 font-semibold">[WARN] Nút LOAD-IND-01 tải chạm ngưỡng 84.7%</span>
                  </div>
                  <span className="text-slate-500 font-mono">10 phút trước</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-slate-300 font-semibold">[INFO] BESS Battery nạp đầy 92% dung lượng từ Solar</span>
                  </div>
                  <span className="text-slate-500 font-mono">25 phút trước</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        POWER-TREE-2 • Hệ thống Giám sát & Quản trị Lưới điện • Tương thích Vite 8 & Vercel
      </footer>
    </div>
  );
}
