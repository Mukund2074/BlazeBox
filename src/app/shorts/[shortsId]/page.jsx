'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '@/context/Api';
import '@/app/globals.css';
import { bestMatchLocator } from '@/context/MultiContentRender';
import ShortsController from './ShortsController';
import ShortsDetail from './details/ShortsDetail';
import { useShortsPlayer } from '@/context/shorts/ShortsPlayerProvider';
import { useShortsControls } from '@/context/shorts/ShortsControlsProvider';
import { SentimentDissatisfied } from '@mui/icons-material';
import { ShortsLoader } from '@/context/Loader';


const ShortsPage = () => {
  const { shortsId } = useParams();

  const {
    videoOptions,
    audioOptions,

    videoUrl,
    audioUrl,

    videoRef,
    audioRef,
    containerRef,

    setFirstId,
    shortsData,
    poster,

    loading, isVideoLoading,
    error, setError,
    sequence, setSequence,

    setPlayerRefresher,
  } = useShortsPlayer();

  const {
    fullscreen,
    setMaxTime,
    setCurrentTime,

    videoReady, setVideoReady,
    audioReady, setAudioReady,
    isEnd, setIsEnd,

    setControlRefresher
  } = useShortsControls();

  const [shortIds, setShortIds] = useState([shortsId]);


  useEffect(() => {
    if (shortsId) {
      setFirstId(shortsId);
    }
  }, []);


  useEffect(() => {
    setControlRefresher(true)
    setPlayerRefresher(true)
  }, [setControlRefresher, setPlayerRefresher])

  useEffect(() => {
    if (shortsId !== undefined && shortsId !== null && sequence) {
      setShortIds((prevShortIds) => {
        const newShortIds = [...prevShortIds, ...sequence];
        return [...new Set(newShortIds)];
      });
    }
  }, [sequence]);

  useEffect(() => {
  }, [shortIds])

  const handleLoadedMetadata = () => {
    setMaxTime(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  if (videoOptions === undefined || videoOptions.length === 0) return <ShortsLoader count={1} singleMain={true} />
  if (loading) return <ShortsLoader count={1} singleMain={true} />
  if (error) console.log(error)

    

  return (
    <main className='py-4 w-full flex flex-col items-center justify-center gap-2 '>
      <section id='main-section' ref={containerRef} className='flex flex-col items-center max-h-screen snap-y snap-mandatory overflow-y-scroll scrollbar-hidden'>
        <section id='video-container' className={`relative mx-auto max-w-[500px] w-full snap-always overflow-hidden rounded-xl ${fullscreen ? 'h-[100dvh] ' : 'h-[90dvh] '}' `}>
          <video
            ref={videoRef}
            className={`w-full h-full`}
            poster={poster ? poster : bestMatchLocator(shortsData?.thumbnail, 'url')}
            controls={false}
            onCanPlay={() => setVideoReady(true)}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onError={() => setError('Something went wrong with the video player')}
          >
            <source
              src={videoUrl ? videoUrl : videoOptions[0].url}
              type='video/mp4' />
            Your browser does not support the video element.
          </video>

          <audio
            ref={audioRef}
            controls={false}
            onCanPlay={() => setAudioReady(true)}
            onError={() => setError('Error occurred during playback of audio')}
          >
            <source
              src={audioUrl ? audioUrl : audioOptions[0].url}
              type={'audio/mp4'} />
            Your browser does not support the audio element.
          </audio>

          {isVideoLoading && (
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
              <div className="w-16 h-16 border-4 border-t-4 border-t-[#FF8A00] border-transparent rounded-full animate-spin "></div>
              loading..
            </div>
          )}


          <ShortsController />

          <ShortsDetail shortsId={shortsId} /></section>
      </section>


    </main>
  );
};

export default ShortsPage;
