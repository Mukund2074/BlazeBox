'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, TrendingUp } from '@mui/icons-material';

export default function PageManager({ children }) {



  const InfoCard = () => {
    return (
      <div className="flex justify-center items-center h-screen  py-4 bg-gradient-to-r from-gray-900 via-gray-700 to-black">
        <div className="max-w-lg w-full backdrop-blur-xl bg-[#00000080] rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-600">
          <div className="text-center text-white">
            <h2 className="text-4xl font-semibold mb-4">Welcome to BlazeBox</h2>
            <p className="text-lg opacity-80">Your Ultimate Video Streaming Platform</p>
          </div>
          <div className="space-y-4">
            <p className="text-white font-semibold text-sm opacity-90">
              <span className=" font-bold text-orange-400">BlazeBox</span> is a cutting-edge video streaming platform, bringing you all the features you need in one place. Watch, discover, and interact with a world of content.
            </p>
            <ul className=" text-white opacity-90 flex flex-wrap gap-4 items-center">
              <li className='border-[1px] px-2 py-1 rounded-md shadow-custom-dark text-xs font-semibold'>Videos</li>
              <li className='border-[1px] px-2 py-1 rounded-md shadow-custom-dark text-xs font-semibold'>Description</li>
              <li className='border-[1px] px-2 py-1 rounded-md shadow-custom-dark text-xs font-semibold'>Comments</li>
              <li className='border-[1px] px-2 py-1 rounded-md shadow-custom-dark text-xs font-semibold'>Channels</li>
              <li className='border-[1px] px-2 py-1 rounded-md shadow-custom-dark text-xs font-semibold'>Shorts</li>
              <li className='border-[1px] px-2 py-1 rounded-md shadow-custom-dark text-xs font-semibold'>Playlists</li>
              <li className='border-[1px] px-2 py-1 rounded-md shadow-custom-dark text-xs font-semibold'>Search</li>
              <li className='border-[1px] px-2 py-1 rounded-md shadow-custom-dark text-xs font-semibold'>Community Posts and more...</li>
            </ul>
            <p className="text-white opacity-90">
              <strong>Important:</strong> This is a <span className="italic font-bold text-orange-500">test version</span>, so only a limited number of videos are available.
            </p>
            <p className="text-white opacity-90">
              Please allow location access for personalized suggestions based on your country!
            </p>
          </div>

          <div className="text-center text-white opacity-80 space-y-4 border-t-[1px] pt-4">
            <div className="flex justify-center gap-6">
              <h1 className='responsive-text font-semibold text-center' > Quick Links : </h1>
              <Link href={'/home'} className="flex text-sm items-center gap-3 2text-white py-1 px-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:scale-105 transform rounded-md border-[1px] shadow-custom-dark transition-all duration-300">
                <Home fontSize="medium" /> Home
              </Link>
              <Link href={'/trending'} className="flex text-sm items-center gap-3 2text-white py-1 px-2 bg-gradient-to-r from-teal-500 via-green-500 to-blue-500 hover:scale-105 transform rounded-md border-[1px] shadow-custom-dark transition-all duration-300">
                <TrendingUp fontSize="medium" /> Trending
              </Link>
            </div>
            <div className="text-sm mt-4">
              <p>For more inquiries, contact us at:
                <a href="mailto:hadiyamukund16@gmail.com" className="text-blue-400 hover:text-blue-600">hadiyamukund16@gmail.com</a>
              </p>
              <p>Visit our portfolio:
                <a href="https://portfolio-mukund-hadiya.netlify.app/" className="text-blue-400 hover:text-blue-600">https://portfolio-mukund-hadiya.netlify.app/</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };



  return (
    <React.Fragment>
      <main className={`pt-20`}>
        {children}
      </main>
    </React.Fragment>
  );

}
