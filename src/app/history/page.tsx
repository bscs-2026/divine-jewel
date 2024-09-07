'use client';
import Image from 'next/image';
import LeftSidebar from '../../components/layout/LeftSidebar';

export default function Home() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#FFE7EF' }}>
      <div style={{ flex: '0 0 50px' }}>
        <LeftSidebar />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          backgroundColor: '#FFE7EF',
        }}
      >
        <Image
          src="/img/divine-jewel-logo.png"
          alt="Logo"
          width={400}
          height={400}
          className="mb-4"
        />
        <p style={{ fontSize: '1.5rem', textAlign: 'center' }}>
          This page is under maintenance
        </p>
      </div>
    </div>
  );
}
