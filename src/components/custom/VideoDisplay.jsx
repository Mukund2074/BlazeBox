'use client'
import api from '@/context/Api';
import SkeletonLoader from '@/context/Loader';
import { bestMatchLocator, formatViewCount, handleThumbnailHover, PlaylistCard, VideoCard } from '@/context/MultiContentRender';
import { useShortsPlayer } from '@/context/shorts/ShortsPlayerProvider';
import { ChevronLeftTwoTone, CloseRounded, PlayArrow, PlaylistPlay } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VideoDisplay({
  videoId,
  cols,
  mainVideos,
  extraVideos,
  shorts,
  channel,
  playlists,
  loadingInitial,
  loadingMore,
  error,
  endRef,
  noAvatar = false,
  playlistId
}) {

  const [playlistData, setPlaylistData] = useState([]);
  const [collapsePlaylist, setCollapsePlaylist] = useState(false);
  const [closePlaylist, setClosePlaylist] = useState(false);

  const { setFirstId } = useShortsPlayer();

  useEffect(() => {
    if (playlistId) {
      const fetchChannel = async () => {
        try {
          const response = await api.get(`/playlist?id=${playlistId}`);
          setPlaylistData(response.data);
        } catch (error) {

        }
      };
      fetchChannel();
    }
  }, [playlistId]);




  let last8thVideo = mainVideos.length - 8;
  let lastVideo = mainVideos.length - 1;


  const renderFirst8Videos = (videos) => {
    return videos.slice(0, 8).map((item, index) => (
      <VideoCard key={index} currentIndex={index} item={item} noAvatar={noAvatar} />
    ));
  };


  const renderRemainingVideos = (videos) => {
    return videos.slice(8).map((item, index) => (
      <VideoCard key={index + 8} currentIndex={index + 8} item={item} last8thVideo={last8thVideo} endRef={endRef} lastvideo={lastVideo} />
    ));
  };

  if (error) console.log(error)

  return (
    <main>

      {loadingInitial &&
        <span className={`grid ${cols ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 '} gap-4`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </span>
      }


      {channel &&
        <section className={`w-full grid ${cols ? 'grid-cols-1 ' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 '} gap-4`}>
          {
            channel.map((item, index) => (
              <Link ref={channel.length - 1 === index ? endRef : null} href={`/channel/${item.channelTitle ? `@${item.channelTitle.replace(/ /g, '')}` : `${item.channelId}`}`} key={index}>
                <section className='flex items-center justify-center w-full border-[1px] border-[#ff8a00] overflow-hidden rounded-xl gap-4 px-4 py-2 h-[300px]' >
                  <section key={index} className=" py-8 flex flex-col items-center rounded-xl gap-4 md:gap-4 ">
                    <Avatar
                      src={bestMatchLocator(item?.thumbnail, 'url')}
                      onError={(e) => (e.target.src = item?.thumbnail[0]?.url)}
                      alt="abs"
                      className="w-[120px] h-[120px] shadow-custom-dark object-cover rounded-full hover:shadow-custom-dark-up" />
                    <span className="flex flex-col w-full justify-center gap-1">
                      <p className="font-semibold responsive-text text-center line-clamp-1 ">{item?.title}</p>
                      <p className="responsive-paragraph text-center line-clamp-1">{item?.subscriberCount ? `${item?.subscriberCount} Subscribers` : '0 Subscribers'} </p>
                      <p className="responsive-paragraph text-center line-clamp-1">{item?.videoCount}</p>

                      <p className="responsive-paragraph line-clamp-1 text-center">{item?.description}</p>
                    </span>
                  </section>
                </section>
              </Link>
            ))}
          <span ref={endRef}></span>
        </section>
      }



      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-2 gap-4'>
        {playlists && playlists.map((item, index) => (
          <PlaylistCard endRef={playlists.length - 1 === index ? endRef : null} key={index} item={item} />
        ))}
        <span ref={endRef} />
      </section>

      {playlistId &&
        <section className={`${closePlaylist ? 'hidden' : ''} flex flex-col gap-4 border-[1px] border-[#ff8a00] rounded-xl`}>


          <section className='flex gap-2 items-center w-full bg-[#454548] p-2 rounded-xl '>
            <font>
              <h1 className="font-semibold responsive-text  "><PlaylistPlay className=' w-6 h-6' /> {playlistData?.meta?.title}</h1>
              <font className="responsive-paragraph" >{playlistData?.meta?.channelTitle} -  {playlistData?.meta?.videoCount} Videos</font>
            </font>
            <span className='flex flex-col md:w-[60px] ml-auto gap-2'>
              <button
                onClick={() => { setClosePlaylist(true) }}
                className=' max-h-[40px] max-w-[40px] border-[1px] border-[#ff8a00]  p-2 md:p-0 rounded-full '>
                <CloseRounded className=' w-6 h-6' />
              </button>


              <button
                onClick={() => { setCollapsePlaylist(!collapsePlaylist) }}
                className='max-h-[40px] max-w-[40px] border-[1px] border-[#ff8a00] p-2 md:p-0 rounded-full '>
                {collapsePlaylist ? <ChevronLeftTwoTone className=' w-6 h-6 rotate-[270deg]' /> : <ChevronLeftTwoTone className=' w-6 h-6 rotate-90' />}
              </button>
            </span>
          </section>

          <section
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4 p-2 overflow-y-scroll transition-all duration-300 ease-in-out ${collapsePlaylist ? 'max-h-0 opacity-0' : 'max-h-[600px] opacity-100 overflow-y-scroll'
              }`}
          >
            {playlistData && playlistData?.data?.map((videos, index) => {

              return (
                <Link
                  href={`/video/${videos?.videoId}?playlistId=${playlistId}`}
                  key={index}

                  className={`${videos?.videoId === videoId ? 'bg-[#454548]' : ''} w-full border-[1px] border-[#ff8a00] flex flex-col gap-2 rounded-xl`}
                >
                  {videos?.videoId === videoId && (
                    <font className="font-semibold text-center">
                      <PlayArrow className="w-6 h-6" /> Currently Playing
                    </font>
                  )}

                  <img
                    src={bestMatchLocator(videos?.thumbnail, 'url')}
                    onError={(e) => (e.target.src = bestMatchLocator(videos?.thumbnail, 'url'))}
                    className="w-full max-h-[200px] object-cover rounded-xl hover:shadow-custom-dark-up"
                  />

                  <span className="flex flex-col gap-1 p-2">
                    <font className="font-semibold text-lg md:text-xl line-clamp-1">{videos?.title}</font>
                  </span>
                </Link>
              );
            })}
          </section>


        </section>}




      {mainVideos && mainVideos.length > 0 &&
        <section className="mt-8">
          <span className={cols === null || cols === undefined || cols === 0 ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 text-[0.75rem]" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4"}>
            {
              renderFirst8Videos(mainVideos)
            }
          </span>
        </section>
      }


      {shorts && shorts.length > 0 &&
        <section className="mt-8 shadow-custom-dark-up border-l-[1px] border-t-[1px] rounded-xl p-4 border-[#ff8a00]">
          <h2 className="responsive-text font-bold mb-4">Shorts you may like</h2>
          <span className="flex overflow-x-scroll scrollbar-hidden gap-4 pb-4">
            {
              shorts?.map((item, index) => {
                let url = '';
                if (item?.videoId) {
                  const titleLower = item?.title.toLowerCase();
                  if (titleLower.includes('#short') || titleLower.includes('#shorts') || item?.type === 'shorts') {
                    url = `/shorts/${item?.videoId}`;
                  } else {
                    url = `/video/${item?.videoId}`;
                  }
                }

                return (
                  <Link key={index} href={url}
                    onClick={() => setFirstId(item?.videoId)} className="p-2">
                    <section className="cursor-pointer overflow-hidden relative flex flex-col transition-all duration-300 ease-in-out hover:scale-105">
                      <img
                        src={bestMatchLocator(item?.thumbnail, 'url')}
                        onError={(e) => (e.target.src = item?.thumbnail[0]?.url)}
                        onMouseEnter={(e) => handleThumbnailHover(e, item, "thumbnail")}
                        onMouseLeave={(e) => handleThumbnailHover(e, item, "thumbnail")}
                        alt={'Thumbnail of ' + item?.title}
                        className="w-[200px] max-w-[200px] h-[380px] object-cover rounded-xl"
                      />
                      <section className="p-2 flex gap-2 bottom-0 w-full h-[60px] absolute bg-[#000000ae] overflow-hidden">
                        <span className="flex flex-col">
                          <p className="responsive-paragraph font-bold line-clamp-2">{item?.title}</p>
                        </span>
                      </section>
                    </section>
                  </Link>
                );
              })
            }
          </span>
        </section>
      }


      {extraVideos && extraVideos.length > 0 &&
        <section className="mt-8  shadow-custom-dark-up border-l-[1px] border-t-[1px] rounded-xl p-4 border-[#ff8a00] ">
          <h2 className="responsive-text font-bold">Recommended For You</h2>
          <span className="flex overflow-x-auto scrollbar-hidden gap-4 py-2 px-4">
            {
              extraVideos?.map((item, index) => (
                <Link key={index} href={`/video/${item?.videoId}`} className="p-4 max-w-[250px]  " >
                  <section className="cursor-pointer overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:scale-105 border-b-[2px] border-l-[1px] border-[#ff8a00] rounded-tl-3xl rounded-br-3xl shadow-custom-dark">
                    <img
                      src={bestMatchLocator(item?.thumbnail, 'url')}
                      onError={(e) => (e.target.src = '/not-found.png')}
                      alt={'Thumbnail of ' + item?.title}
                      className={`h-[180px] min-w-[200px] rounded-tl-3xl rounded-br-3xl shadow-custom-dark border-b-[1px] border-[#423f3c]`}
                    />
                    <span className={`text-xs translate-y-[-28px] px-2 py-1 rounded self-end mr-2 items-center justify-center ${item.lengthText === 'Live' || item.lengthText === 'LIVE' ? 'bg-[#e93232e6] text-white px-3' : 'bg-[#000000ae]'}`}>
                      {item.lengthText === 'Live' ? 'LIVE' : item.lengthText}
                    </span>
                    <section className="p-2 flex gap-2 mt-2 min-h-[130px]">
                      {noAvatar ? null :
                        item?.lengthText === 'SHORTS' ? null :
                          <span className="min-w-[50px] min-h-[50px]">
                            <Avatar
                              className="rounded-full"
                              src={bestMatchLocator(item?.channelThumbnail, 'url') || '/not-found.png'}
                              onError={(e) => (e.target.src = item?.channelThumbnail[0]?.url) || '/not-found.png'}
                              onMouseEnter={(e) => handleThumbnailHover(e, item, "channelThumbnail")}
                              onMouseLeave={(e) => handleThumbnailHover(e, item, "channelThumbnail")}
                              alt={'Channel Thumbnail of ' + item?.channelTitle}
                              width={'80px'}
                              height={'80px'} />
                          </span>}
                      <span className="flex flex-col">
                        <p className="responsive-paragraph font-bold line-clamp-2">{item?.title}</p>
                        <p className="responsive-paragraph text-gray-300 mt-2 line-clamp-1">{item?.channelTitle}</p>
                        <p className="responsive-paragraph text-gray-300 line-clamp-1">{formatViewCount(item?.viewCount)} views  {item?.publishedTimeText}</p>
                      </span>
                    </section>
                  </section>
                </Link>
              )
              )}
          </span>
        </section>
      }

      {mainVideos && mainVideos.length > 0 &&
        <section className="mt-8">
          <span className={cols === null || cols === undefined || cols === 0 ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 text-[0.75rem]" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4"}>
            {renderRemainingVideos(mainVideos)}
            {
              loadingMore ? (
                (() => {
                  const lastRowItems = mainVideos.length % (cols || 5);
                  switch (lastRowItems) {
                    case 1:
                      return Array.from({ length: 3 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                      ));
                    case 2:
                      return Array.from({ length: 2 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                      ));
                    case 3:
                      return Array.from({ length: 1 }).map((_, index) => (
                        <SkeletonLoader key={index} />
                      ));
                    default:
                      return null;
                  }
                })()
              ) : null
            }
          </span>
        </section>
      }

      <span ref={endRef} className='h-6 w-6 p-4' />

      <section className={cols === null || cols === undefined || cols === 0 ? "mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4"}>
        {
          loadingMore ? (
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          ) : null
        }
      </section>

    </main>
  );
}
