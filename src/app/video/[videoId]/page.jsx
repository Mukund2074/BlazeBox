'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams} from 'next/navigation';
import api from '@/context/Api';
import '@/app/globals.css';
import { commentContinuationFetcher, commentFetcher, continuationFetcher, infiniteScroller, mainFetcher } from '@/context/FetchingFunctions';
import VideoDisplay from '@/components/custom/VideoDisplay';
import VideoDetails from './VideoDetails';
import VideoControler from './VideoControler';
import VideoComments from './VideoComments';
import { bestMatchLocator } from '@/context/MultiContentRender';
import { MainVideoLoader } from '@/context/Loader';


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

  const selectedVideoStream = videoOptions?.find((format) => format.itag === selectedVideoQuality);
  const selectedAudioStream = audioOptions?.find((format) => format.audioOptions?.id === selectedLanguage);

  const videoUrl = selectedVideoStream?.url;
  const audioUrl = selectedAudioStream?.url;



  if (loading) return <MainVideoLoader />
  if (error) console.log(error)



  return (
    <section className='pt-4 md:pt-20 w-full flex flex-col lg:flex-row gap-2'>


      <aside className="relative w-full lg:w-[80%] px-0 md:px-4">
        <div ref={containerRef} className='w-full relative rounded-xl overflow-hidden'>
          <video
            ref={videoRef}
            className={` ${fullscreen ? 'fullscreen' : ''}
             z-[1] w-[640px] sm:w-[720px] md:w-[1080px] lg:w-[1280px] xl:w-[1440px] 2xl:w-[1920px] rounded-xl`}
            poster={bestMatchLocator(videoData?.thumbnail, 'url')}
            controls={false}
            height='auto'
            muted={initialType ? true : false}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={() => setVideoReady(true)}
            onError={() => setError('Error occurred during playback')}
          >
            <source
              src={videoUrl ? videoUrl : initialType[0]?.url}
              type={selectedVideoStream?.mimeType ? selectedVideoStream.mimeType : initialType[0]?.mimeType} />
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
            selectedVideoStream={selectedVideoStream}
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
          bestMatchLocator={bestMatchLocator}
        />

       <section className='p-4'> 
       <VideoComments
        videoId={videoId}
        />
       </section>

      </aside>

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
