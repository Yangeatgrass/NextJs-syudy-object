// 导入全局样式
import '@/app/ui/global.css';
// 导入全局字体
import { inter } from '@/app/ui/fonts';
// 元数据
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '哈哈哈哈哈哈哈',
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
