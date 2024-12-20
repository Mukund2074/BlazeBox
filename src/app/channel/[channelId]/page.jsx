'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ChannelHome from './ChannelHome';
import { Avatar } from '@mui/material';
import ChannelVideos from './ChannelVideos';
import ChannelLive from './ChannelLive';
import ChannelPlaylist from './ChannelPlaylist';
import ChannelCommunity from './ChannelCommunity';
import ChannelShorts from './ChannelShorts';
import ChannelSearch from './ChannelSearch';
import { ChannelLoader } from '@/context/Loader';
import { CalendarMonth, ChevronRight, Circle, Facebook, LinkRounded, PeopleAltRounded, Public, Search, VideocamRounded, Visibility } from '@mui/icons-material';
import { bestMatchLocator, formatViewCount } from '@/context/MultiContentRender';
import { useChannel } from '@/context/ChannelProvider';

export default function Channel() {

  const { channelId } = useParams();
  const [hostname, setHostname] = useState('');

  useEffect(() => {
    if(typeof window !== 'undefined') { 
      setHostname(window.location.host);
      
    }
  });
  

  const { channel, about, loading, setChannelId, activeTab, setActiveTab, channelTabs } = useChannel();

  useEffect(() => {
    setChannelId(decodeURIComponent(channelId));
  }, [channelId]);

  const [subscribed, setSubscribed] = useState(false);
  const [searchedText, setSearchedText] = useState('');
  const [showAbout, setShowAbout] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <ChannelLoader />

  return (

    <main className='flex flex-col gap-2 p-2 rounded-lg'>

      {showAbout &&
        <section className='fixed top-0 left-0 right-0 bottom-0 w-full z-40 backdrop-blur bg-[#191a1a]/40 rounded-lg border-[#ff8a00] p-4 flex gap-4 items-center justify-center'>

          <span className='transition-all duration-500 ease-in-out p-4 pt-10 relative z-30 flex flex-col items-center left-0 right-0 mx-auto my-auto bg-gradient-to-tl from-[#191a1a] via-[#040408] to-[#48484e] rounded-2xl w-full md:w-[60%] h-[80%] ' >

            <span className='absolute top-0 left-0 right-0 flex items-center mx-auto gap-4 w-[90%]'>
              <font className='responsive-text font-semibold text-white mr-auto '>About</font>
              <button onClick={() => setShowAbout(false)} className='text-white text-sm font-bold p-4 rounded-full'>X</button>
            </span>


            <section className='max-h-full overflow-hidden overflow-y-scroll flex flex-col gap-2 scrollbar-hidden w-full'>

              <p
                className='w-full mt-2 responsive-paragraph'
                dangerouslySetInnerHTML={{
                  __html: about?.description
                    .replace(/(https?:\/\/[^\s]+)/g, (match) => {
                      return `<a href="${match}" target="_blank" class="text-blue-500 hover:underline" rel="noopener noreferrer">${match}</a>`;
                    })

                    .replace(/#([A-Za-z0-9_]+)/g, (match) => {
                      return `<a href="/hashtag/${match.slice(1).toLowerCase()}" class="text-blue-500 hover:underline">${match}</a>`;
                    })
                    .replace(/(?:\r\n|\r|\n)/g, '<br>')
                    .replace(/\[([0-9:]+)\]/g, '<br>[$1]')
                    .replace(/<sub>(.*?)<\/sub>/g, '<br><sub>$1</sub>')
                    .replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, (match) => {
                      return `<a href="mailto:${match}" class="text-blue-500 hover:underline">${match}</a>`;
                    })
                }}
              />

              <font className='responsive-text font-semibold text-white mr-auto my-4'>Links </font>
              <span className='flex flex-col gap-2 w-full'>
                {about?.links?.map((link, index) => (
                  <span key={index} className='flex items-center gap-2'>
                    <img src={link.favicon[2].url} className='text-white' />
                    <span className='flex flex-col gap-1'>
                      <font className='text-white font-semibold responsive-paragraph '>{link.title}</font>
                      <a href={`https://${link.link}`} className='text-blue-500 responsive-paragraph hover:underline'>{link.link}</a>
                    </span>
                  </span>
                ))}
              </span>

              <font className='responsive-text font-semibold text-white mr-auto my-4'>Channel Details </font>
              <span className='flex flex-col gap-2 w-full'>
              <span className='flex items-center gap-4'>
                  <LinkRounded />
                  <Link href={`https://${hostname}/${about.channelHandle}`} className='text-white font-semibold responsive-paragraph '>{`${hostname}/${about.channelHandle}`}</Link>
                </span>
                <span className='flex items-center gap-4'>
                  <PeopleAltRounded />
                  <font className='text-white font-semibold responsive-paragraph '>{about.subscriberCountText ? about.subscriberCountText : about.subscriberCount ? about.subscriberCount : 'Not Available'} Subscribers</font>
                </span>
                <span className='flex items-center gap-4'>
                  <VideocamRounded />
                  <font className='text-white font-semibold responsive-paragraph '>{about.videosCountText ? about.videosCountText : about.videosCount ? about.videosCount : 'Not Available'}</font>
                </span>
                <span className='flex items-center gap-4'>
                  <Visibility />
                  <font className='text-white font-semibold responsive-paragraph '>{about?.viewCountText ? about?.viewCountText : about?.viewCount ? about?.viewCount : 'Not Available'}</font>
                </span>
                <font className='text-white font-semibold responsive-paragraph flex items-center gap-4'> <Public /> {about?.country ? about?.country : ''}</font>
                <font className='text-white font-semibold responsive-paragraph flex items-center gap-4'> <CalendarMonth /> {about?.joinedDateText ? about?.joinedDateText : about?.joinedDate ? about?.joinedDate : ''}</font>
              </span>

            </section>
          </span>

        </section>
      }

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
              <button onClick={() => setShowAbout(!showAbout)} >more</button>
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

            <button onClick={() => setShowAbout(!showAbout)}>...more</button>
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

