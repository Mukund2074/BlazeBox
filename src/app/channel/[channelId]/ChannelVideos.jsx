'use client';
import VideoDisplay from '@/components/custom/VideoDisplay';
import { useDataContext } from '@/context/DataProvider';
import { SentimentSatisfiedAlt } from '@mui/icons-material';
import React, { useEffect, useRef } from 'react'

export default function ChannelVideos({ channelId }) {

  const { mainVideos, shorts, extraVideos, loadingInitial, continuation, loadingMore, error, setPath, setContinuationPath, setEndRef } = useDataContext();
  const endRef = useRef(null);


  useEffect(() => {
    let decodeID = decodeURIComponent(channelId);

    if (decodeID.startsWith('@')) {
      setPath(`channel/videos?forUsername=${decodeID}`);
      setContinuationPath(`channel/videos?forUsername=${decodeID}&token=${continuation}`);
    } else {
      setPath(`channel/videos?id=${decodeID}`);
      setContinuationPath(`channel/videos?id=${decodeID}&token=${continuation}`);
    }
  }, [continuation, channelId, setPath, setContinuationPath]);


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
