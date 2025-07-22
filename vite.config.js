import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    //outDir: 'dist', // หรือเปลี่ยนชื่อโฟลเดอร์ output ตามต้องการ
    outDir: 'C:\\inetpub\\wwwroot\\LabDevsc.dev.local\\Assets\\FormAIAs\\', // หรือเปลี่ยนชื่อโฟลเดอร์ output ตามต้องการ
    assetsDir: '',  // เก็บ assets (เช่น .css) ไว้ที่ root เดียวกัน
    rollupOptions: {
      output: {
        entryFileNames: 'bundle.js',     // ✅ ได้ชื่อ .js แบบไม่ hash
        chunkFileNames: 'chunk-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';          // ✅ ได้ชื่อ .css แบบไม่ hash
          }
          return assetInfo.name || 'asset.[ext]';
        },
      },
    },
  },
});
