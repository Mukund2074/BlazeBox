'use client';
import VideoDisplay from '@/components/custom/VideoDisplay';
import { useDataContext } from '@/context/DataProvider';
import { SentimentSatisfiedAlt } from '@mui/icons-material';
import React, { useEffect, useRef } from 'react'

export default function ChannelVideos({ channelId }) {

  const { mainVideos , shorts , extraVideos , loadingInitial ,continuation , loadingMore , error  , setPath , setContinuationPath , setEndRef } = useDataContext();
  const endRef = useRef(null);

  useEffect(() => {
    setPath(`/channel/videos?id=${channelId}`)
    setContinuationPath(`/channel/videos?id=${channelId}&token=${continuation}`)
  }, [continuation , channelId , setPath , setContinuationPath ]);

  useEffect(() => {
    setEndRef(endRef);
  }, [setEndRef]);


  if (error) console.log(error)


  return (
    <section>

      <VideoDisplay
        mainVideos={mainVideos}
        extraVideos={extraVideos}
        shorts={shorts}
        loadingInitial={loadingInitial}
        loadingMore={loadingMore}
        endRef={endRef}
        noAvatar={true}
      />

      {continuation === '' && <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Videos! <SentimentSatisfiedAlt /></font>}
    </section>
  )
}
