import Image from 'next/image';

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-6"
      style={{ backgroundColor: '#FFE7EF' }}
    >
      <Image
        src="/img/divine-jewel-logo.png"
        alt="Logo"
        width={400}
        height={400}
        className="mb-4"
      />
      <h1 className="text-4xl font-bold">Welcome!</h1>
      <p className="mt-4 text-lg">
        This page is under maintenance
      </p>
    </main>
  );
}
