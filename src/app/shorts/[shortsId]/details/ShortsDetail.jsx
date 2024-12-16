'use client'
import { ShortsFetcher } from '@/context/FetchingFunctions';
import { CommentSharp, PlayArrow, Reply, ThumbUp } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import DescriptionPopUp from './popups/DescriptionPopUp';
import CommentsPopUp from './popups/CommentsPopUp';
import { formatViewCount } from '@/context/MultiContentRender';
import { useShortsPlayer } from '@/context/shorts/ShortsPlayerProvider';

export default function ShortsDetail({ shortsId }) {

  const {
    setPoster,
    videoRef,
  } = useShortsPlayer();

  const [ShortsDetails, setShortsDetails] = useState();
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  const hasFetched = useRef(false);

  function handleShowDescription() {
    setShowDescription(!showDescription);
  }

  function handleShowComments() {
    setShowComments(!showComments);
  }


  useEffect(() => {
    const fetchShortsDetails = async () => {
      try {
        if (shortsId !== undefined && shortsId !== null && !hasFetched.current) {
          hasFetched.current = true;
          await ShortsFetcher({
            shortsId,
            setShortsDetails,
            setError,
          });
        }
      } catch (error) {
        setError(error);
      }
    };

    if (shortsId !== null && !hasFetched.current) {
      fetchShortsDetails();
    }
  }, [shortsId]);



  useEffect(() => {
    if (ShortsDetails) {
      setPoster(ShortsDetails?.thumbnail ? ShortsDetails?.thumbnail[0]?.url : '/not-found-shorts.png');
    }
  }, [ShortsDetails])


  if (error) console.log("error", error);


  return (
    <React.Fragment>

      <section id='detail-controlers' className='absolute  text-white flex flex-col gap-2 bottom-4 md:bottom-16 right-0 md:right-2 w-[15%] h-[300px] '>

        <button className='flex flex-col rounded-full  items-center justify-center cursor-pointer '>
          <span className=' rounded-full p-3 bg-[#2a282882] flex items-center justify-center '>
            <ThumbUp className='w-4 h-4 md:w-6 md:h-6' />
          </span>
          <font className={`text-xs text-center font-bold`}> {ShortsDetails?.likeCountText || 'Like'}</font>
        </button>

        <button className='flex flex-col rounded-full  items-center justify-center cursor-pointer '>
          <span className=' rounded-full p-3 bg-[#2a282882] flex items-center justify-center '>
            <ThumbUp className='rotate-180 w-4 h-4 md:w-6 md:h-6' />
          </span>
          <font className={`text-xs text-center  font-bold`}> Dislike</font>
        </button>

        <button onClick={handleShowComments} className='flex flex-col rounded-full items-center justify-center cursor-pointer '>
          <span className=' rounded-full p-3 backdrop-blur-xl bg-[#2a282882] flex items-center justify-center '>
            <CommentSharp className='w-4 h-4 md:w-6 md:h-6' />
          </span>
          <font className={`text-xs text-center font-bold`}> {formatViewCount(ShortsDetails?.commentCount) || 'Comments'}</font>
        </button>

        <button className='flex flex-col rounded-full  items-center justify-center cursor-pointer '>
          <span className=' rounded-full p-3 bg-[#2a282882] flex items-center justify-center '>
            <Reply className='transform scale-x-[-1] w-4 h-4 md:w-6 md:h-6' />
          </span>
          <font className={`text-xs text-center font-bold`}> Share</font>
        </button>

      </section>


      <section id='detail-summary' className='absolute bottom-2 left-0 z-0 text-white flex flex-col gap-2 w-[85%]  p-2'>

        <span className="flex items-center gap-2">

          {ShortsDetails?.channelThumbnail &&
            <Link href={`/channel/${ShortsDetails?.channelId}`}>
              <Avatar
                alt="NOT FOUND"
                src={ShortsDetails?.channelThumbnail[0]?.url}
                className='max-w-[35px] max-h-[35px]' />
            </Link>}

          {ShortsDetails?.channelTitle && ShortsDetails?.channelId &&
            <Link href={`/channel/${ShortsDetails?.channelId}`}>
              <font className="text-sm cursor-pointer font-bold">{ShortsDetails?.channelTitle}</font>
            </Link>}



        </span>

        {ShortsDetails?.multiFormatLink &&
          <Link href={`/video/${ShortsDetails?.multiFormatLink?.videoId}`} >
            <font className="text-sm flex items-center gap-2 hover:underline">
              <PlayArrow /> <p className='line-clamp-1 font-semibold'> {ShortsDetails?.multiFormatLink?.title}</p>
            </font>
          </Link>}


        <h2 onClick={handleShowDescription} className="text-sm font-semibold line-clamp-2 cursor-pointer">
          {ShortsDetails?.title}
        </h2>


      </section>


      <CommentsPopUp
        videoRef={videoRef}
        showComments={showComments}
        handleShowComments={handleShowComments}
        ShortsDetails={ShortsDetails}
        shortsId={shortsId}
        setError={setError} />


      <DescriptionPopUp
        videoRef={videoRef}
        showDescription={showDescription}
        handleShowDescription={handleShowDescription}
        ShortsDetails={ShortsDetails} />


    </React.Fragment>
  )
}
