import React from 'react';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import PageManager from './page';
import DataProvider from '@/context/DataProvider';
import ChannelProvider from '@/context/ChannelProvider';
import ShortsPlayerProvider from '@/context/shorts/ShortsPlayerProvider';
import ShortsControlProvider from '@/context/shorts/ShortsControlsProvider';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gradient-to-tl from-[#10101d] via-[#0a0a14] to-[#10101d] text-[#f3f2ed]`}>
        <DataProvider>
          <ChannelProvider>
            <ShortsPlayerProvider>
              <ShortsControlProvider>
                <PageManager>
                  <Header />
                  {children}
                  <Footer />
                </PageManager>
              </ShortsControlProvider>
            </ShortsPlayerProvider>
          </ChannelProvider>
        </DataProvider>
      </body>
    </html>
  );
}
