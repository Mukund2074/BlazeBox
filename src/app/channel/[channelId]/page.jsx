'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/context/Api';
import ChannelHome from './ChannelHome';
import { Avatar } from '@mui/material';
import ChannelVideos from './ChannelVideos';
import ChannelLive from './ChannelLive';
import ChannelPlaylist from './ChannelPlaylist';
import ChannelCommunity from './ChannelCommunity';
import ChannelShorts from './ChannelShorts';
import ChannelSearch from './ChannelSearch';
import { ChannelLoader } from '@/context/Loader';
import { ChevronRight, Circle, Facebook, Search } from '@mui/icons-material';
import { bestMatchLocator, formatViewCount } from '@/context/MultiContentRender';
import { useChannel } from '@/context/ChannelProvider';

export default function Channel() {

  const { channelId } = useParams();

  const { channel, loading, setChannelId, activeTab, setActiveTab, channelTabs } = useChannel();

  useEffect(() => {
    setChannelId(channelId);
  }, [channelId]);

  
  const [subscribed, setSubscribed] = useState(false);
  const [searchedText, setSearchedText] = useState('');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <ChannelLoader />

  return (

    <main className='flex flex-col gap-2 p-2 rounded-lg'>

      <section className='flex flex-col gap-4 md:p-10 items-center'>
        {channel?.meta?.banner &&
          <img
            src={bestMatchLocator(channel?.meta?.banner, 'url')}
            className={`md:min-h-${bestMatchLocator(channel?.meta?.banner, 'height')}
        min-h-[180px] w-[${channel?.meta?.banner?.[0]?.width}]
        md:w-full object-cover rounded-lg border-[1px] `}
          />
        }

        <section className='flex flex-col md:flex-row items-center gap-4 md:gap-10 pt-4'>
          {channel?.meta?.avatar &&
            <Avatar
              src={bestMatchLocator(channel?.meta?.avatar, 'url')}
              className="w-[176px] h-[176px] shadow-custom-dark object-cover rounded-full hover:shadow-custom-dark-up"
            />
          }
          <div className='flex flex-col gap-1 md:gap-4 items-center md:items-start'>
            <h1 className='line-clamp-1 text-3xl font-bold'>{channel?.meta?.title}</h1>
            <p className='text-sm flex items-center gap-2 text-gray-400'>
              {channel?.meta?.channelHandle}
              <Circle className='text-sm text-gray-400' />
              {channel?.meta?.subscriberCountText} Subscribers
              <Circle className='text-sm text-gray-400' />
              {channel?.meta?.videosCount} Videos</p>


            <span className='flex items-center'>
              <font className='line-clamp-1 text-gray-400'> {channel?.meta?.description}</font>
              <button >more</button>
            </span>

          </div>
        </section>

        {channel?.meta?.facebookProfileId &&
          <span className='flex items-center gap-2 pl-2 pt-2 '>
            <Facebook />
            Facebook:
            <Link
              href={`https://www.facebook.com/${channel?.meta?.facebookProfileId}`}
              className='text-blue-500'
            >
              {channel?.meta?.facebookProfileId}
            </Link>

            <button>...more</button>
          </span>}

        <button
          className={`${subscribed ? `bg-[#ff8a00]/80 hover:bg-[#ff8a00]` : `bg-transparent border-[1px] border-[#ff8a00] hover:bg-[#ff880058]`}
          rounded-full w-full mt-2  p-2 `}
          onClick={() => setSubscribed(!subscribed)}
        >
          {subscribed ? 'Subscribed' : 'Subscribe'}
        </button>

      </section>

      <section className='sticky z-20 top-20 px-6 py-1 md:p-4 backdrop-blur-lg bg-[#282727f7] rounded-lg border-t-[1px] border-[#ff8a00]  backdrop-opacity-15 md:px-14 flex gap-8 items-center overflow-y-scroll scrollbar-hidden'>
        {channelTabs && channelTabs.map((tab, i) => {
          if (tab === 'Search') {
            return (
              <span key={i} className={`text-sm md:text-lg font-bold cursor-pointer z-10 py-2 ${activeTab === tab ? 'text-[#ff8a00] border-b-4 border-[#ff8a00]' : ''}`} onClick={() => handleTabClick(tab)} >
                <Search />
              </span>
            )
          }
          if (tab === 'Podcasts') return null;

          return (
            <span key={i} className={`text-sm md:text-lg font-bold cursor-pointer z-10 py-2 ${activeTab === tab ? 'text-[#ff8a00] border-b-4 border-[#ff8a00]' : ''}`} onClick={() => handleTabClick(tab)} >
              {tab}
            </span>
          )
        })}

        <input
          type="text"
          name='searching'
          id='searching'
          placeholder='Search'
          value={searchedText}
          className={`${activeTab === 'Search' ? 'block' : 'hidden'} w-[300px] md:w-[500px] bg-transparent border-b-[1px] border-[#ff8a00] rounded-full py-2 px-4 focus:outline-none focus:shadow-custom-dark`}
          onChange={(e) => {
            setSearchedText(e.target.value)
          }}
        />

        <button onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
            duration: 1000
          });

        }} className='ml-auto flex items-center justify-center border-[1px] p-2 transition-all duration-300 ease-in-out behavior-smooth rounded-full border-[#ff8a00]'>
          <ChevronRight className='h-6 w-6 text-xl font-bold -rotate-90' />
        </button>
      </section>


      <span className='border-[1px] border-[#717171] translate-y-[-10px] z-0 ' />

      {channel?.meta && channel?.data &&

        activeTab === 'Home' ?

        <ChannelHome
          channel={channel}
          formatViewCount={formatViewCount}
          subscribed={subscribed}
          setSubscribed={setSubscribed}
        />
        :

        activeTab === 'Videos' ?

          <ChannelVideos
            channelId={channelId} />
          :

          activeTab === 'Live' ?

            <ChannelLive channelId={channelId} />

            :

            activeTab === 'Playlists' ?

              <ChannelPlaylist
                channelId={channelId}
                bestMatchLocator={bestMatchLocator}
              />

              :

              activeTab === 'Posts' || activeTab === 'Community' ?

                <ChannelCommunity
                  channelId={channelId}
                  bestMatchLocator={bestMatchLocator}
                  formatViewCount={formatViewCount} />
                :

                activeTab === 'Shorts' ?

                  <ChannelShorts
                    channelId={channelId}
                    bestMatchLocator={bestMatchLocator}
                    formatViewCount={formatViewCount}
                  />
                  :
                  activeTab === 'Search' ?

                    <ChannelSearch
                      channelId={channelId}
                      bestMatchLocator={bestMatchLocator}
                      formatViewCount={formatViewCount}
                      searchedText={searchedText}
                      setSearchedText={setSearchedText}
                    />
                    :
                    null
      }
    </main>
  );

}

