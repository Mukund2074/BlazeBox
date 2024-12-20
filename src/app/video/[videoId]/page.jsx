'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/context/Api';
import '@/app/globals.css';
import { commentContinuationFetcher, commentFetcher, continuationFetcher, infiniteScroller, mainFetcher } from '@/context/FetchingFunctions';
import VideoDisplay from '@/components/custom/VideoDisplay';
import VideoDetails from './VideoDetails';
import VideoControler from './VideoControler';
import VideoComments from './VideoComments';
import { bestMatchLocator } from '@/context/MultiContentRender';
import { MainVideoLoader } from '@/context/Loader';
import { Facebook, Instagram, LinkedIn, LinkRounded, Mail, Pinterest, Reddit, Telegram, Twitter, WhatsApp } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const VideoPage = () => {
  const { videoId } = useParams();
  const [playlistId, setPlaylistId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const playlistId = urlParams.get('playlistId');
      setPlaylistId(playlistId ? playlistId : null);
    }
  }, [videoId]);

  const [videoData, setVideoData] = useState(null);
  const [initialType, setInitialType] = useState();
  const [currentTime, setCurrentTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [channel, setChannel] = useState([]);
  const [selectedVideoQuality, setSelectedVideoQuality] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // api required states
  const [mainVideos, setMainVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [extraVideos, setExtraVideos] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [continuation, setContinuation] = useState('');
  const endRef = useRef(null);
  const containerRef = useRef(null);

  const [openShare, setOpenShare] = useState(false);


  const [fullscreen, setFullscreen] = useState(false);


  // Refs for video and audio elements
  const videoRef = useRef(null);
  const audioRef = useRef(null);


  const [videoReady, setVideoReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        mainFetcher({
          setMainVideos,
          setExtraVideos,
          setShorts,
          setContinuation,
          setError,
          setCountryCode,
          path: `related?id=${videoId}&`,
          setLoadingInitial
        });
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  const fetchMoreData = async () => {
    continuationFetcher({
      setMainVideos,
      setContinuation,
      setIsEnd,
      setLoadingMore,
      countryCode,
      continuation,
      path: `related?id=${videoId}&`,
      isEnd,
      loadingMore
    });
  };

  infiniteScroller(endRef, setIsEnd, fetchMoreData);


  const toggleShare = () => {
    setOpenShare(!openShare);
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await api.get(`dl?id=${videoId}`);
        setVideoData(response.data);
        setInitialType(response.data.formats);
        setLoading(false);

        if (response?.data?.channelId) {
          const allChannelData = await api.get(`channel/home?id=${response?.data?.channelId}`);
          setChannel(allChannelData.data);

        }
      } catch (err) {
        setError('Failed to load video data');
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [videoId]);


  const handleLoadedMetadata = () => {
    setMaxTime(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const videoOptions = videoData?.adaptiveFormats?.filter((format) =>
    format?.mimeType?.includes('avc1')
  );
  const audioOptions = videoData?.adaptiveFormats?.filter((format) =>
    format?.mimeType?.includes('audio/mp4')
  );

  const selectedAudioStream = audioOptions?.find((format) => format.audioOptions?.id === selectedLanguage);


  const videoUrl = videoOptions?.find((format) => format.itag === selectedVideoQuality)?.url;
  const audioUrl = selectedAudioStream?.url;




  if (loading) return <MainVideoLoader />
  if (error) console.log(error)

    const socialMediaShare = [
      {name : 'whatsapp' , url : `whatsapp://send?text=${window.location.href}` , icon : <WhatsApp className='w-6 h-6' />},
      {name : 'instagram' , url : `https://www.instagram.com/?url=${window.location.href}` , icon : <Instagram className='w-6 h-6' />},
      {name : 'twitter' , url : `https://twitter.com/intent/tweet?url=${window.location.href}` , icon : <Twitter className='w-6 h-6' />},
      {name : 'facebook' , url : `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}` , icon : <Facebook className='w-6 h-6' />},
      {name : 'linkedin' , url : `https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}` , icon : <LinkedIn className='w-6 h-6' />},
      {name : 'telegram' , url : `https://t.me/share/url?url=${window.location.href}` , icon : <Telegram className='w-6 h-6' />},
      {name : 'pinterest' , url : `https://pinterest.com/pin/create/button/?url=${window.location.href}` , icon : <Pinterest className='w-6 h-6' />},
      {name : 'reddit' , url : `https://www.reddit.com/submit?url=${window.location.href}` , icon : <Reddit className='w-6 h-6' />},
      {name : 'email' , url : `mailto:?body=${window.location.href}` , icon : <Mail className='w-6 h-6' />},
      
    ]


  return (
    <section className='pt-4 md:pt-20 w-full flex flex-col lg:flex-row gap-2'>


      <aside className="relative w-full lg:w-[80%] px-0 md:px-4">

        <div ref={containerRef} className='w-full relative rounded-xl overflow-hidden'>
          <video
            ref={videoRef}
            className={` ${fullscreen ? 'fullscreen min-h-screen' : ''}
             z-[1] w-[640px] sm:w-[720px] md:w-[1080px] lg:w-[1280px] xl:w-[1440px] 2xl:w-[1920px] rounded-xl`}
            poster={bestMatchLocator(videoData?.thumbnail, 'url')}
            controls={false}
            height={`${fullscreen ? '100vh' : 'auto'} `}
            muted={initialType ? true : false}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setError('Error occurred during playback')}
          >
            <source
              src={videoUrl ? videoUrl : initialType[0]?.url}
              type={'video/mp4'} />
            Your browser does not support the video element.
          </video>

          <VideoControler
            videoRef={videoRef}
            audioRef={audioRef}
            containerRef={containerRef}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            maxTime={maxTime}
            videoOptions={videoOptions}
            audioOptions={audioOptions}
            initialType={initialType}
            setIsVideoLoading={setIsVideoLoading}
            videoReady={videoReady}
            setVideoReady={setVideoReady}
            audioReady={audioReady}
            setAudioReady={setAudioReady}
            selectedVideoQuality={selectedVideoQuality}
            setSelectedVideoQuality={setSelectedVideoQuality}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            fullscreen={fullscreen}
            setFullscreen={setFullscreen}
          />


          <audio
            ref={audioRef}
            controls={false}
            onCanPlay={() => setAudioReady(true)}
            onError={() => setError('Error occurred during playback')}
          >
            <source
              src={audioUrl ? audioUrl : initialType[0]?.url}
              type={selectedAudioStream?.mimeType ? selectedAudioStream.mimeType : initialType[0]?.mimeType} />
            Your browser does not support the audio element.


          </audio>

          {isVideoLoading && (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
              <div className="w-16 h-16 border-4 border-t-4 border-t-[#FF8A00] border-transparent rounded-full animate-spin "></div>
              loading..
            </div>
          )}



        </div>
        <VideoDetails
          videoData={videoData}
          channel={channel}
          toggleShare={toggleShare}
          initialType={initialType}
        />

        <section className='p-4'>
          <VideoComments
            videoId={videoId}
          />
        </section>

      </aside>

      {openShare &&
        <section className='fixed top-0 left-0 right-0 bottom-0 w-full z-40 backdrop-blur bg-[#191a1a]/40 rounded-lg border-[#ff8a00] p-4 flex gap-4 items-center justify-center'>

          <span className='transition-all duration-500 ease-in-out p-4 relative z-30 flex flex-col items-center left-0 right-0 mx-auto my-auto bg-gradient-to-tl from-[#191a1a] via-[#040408] to-[#48484e] rounded-2xl w-full md:w-[60%] h-[20%] ' >

            <span className='flex items-center gap-4 w-full'>
              <h1 className='responsive-text font-semibold mr-auto text-white'>Share Video</h1>
              <button onClick={toggleShare} className='text-white text-sm font-bold p-4 rounded-full'>X</button>
            </span>

            <span className='flex items-center gap-4 max-w-full overflow-hidden overflow-x-scroll scrollbar-hidden '>

              <Tooltip title='Copy Link'>
                <button className='flex items-center p-2 border-[1px] border-slate-500 rounded-lg bg-[#191a1a] hover:bg-[#48484e]'
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                  }}>
                  <LinkRounded className='w-6 h-6 text-white' />
                </button>
              </Tooltip>

              {socialMediaShare.map((item , index) => (
                <Tooltip key={index} title={`Share on ${item.name}`}>
                  <a href={item.url} target='_blank' rel='noreferrer'>
                    <button className='flex items-center p-2 border-[1px] border-slate-500 rounded-lg bg-[#191a1a] hover:bg-[#48484e]'>
                      {item.icon}
                    </button>
                  </a>
                </Tooltip>
              ))}

            </span>
          </span>

        </section>}

      <section className='w-full lg:w-[20%] p-4'>
        <VideoDisplay
          videoId={videoId}
          mainVideos={mainVideos}
          extraVideos={extraVideos}
          shorts={shorts}
          loadingInitial={loadingInitial}
          loadingMore={loadingMore}
          error={error}
          endRef={endRef}
          cols={4}
          playlistId={playlistId}
        />
      </section>

    </section>
  );
};

export default VideoPage;
