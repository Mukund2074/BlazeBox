// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800  text-gray-400 py-6">
      <div className="container mx-auto text-center">
        <div className="mb-4">
          <Link href="/home" className="px-4">
            Home
          </Link>
          <Link href="/trending" className="px-4">
            Trending Videos
          </Link>
          
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} My Website. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
