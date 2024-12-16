'use client';
import VideoDisplay from '@/components/custom/VideoDisplay';
import { useDataContext } from '@/context/DataProvider';
import { SentimentSatisfiedAlt } from '@mui/icons-material';
import React, { useEffect, useRef } from 'react'

export default function ChannelLive({ channelId }) {

    const { mainVideos , shorts , extraVideos , loadingInitial ,loadingMore , isEnd , setEndRef , setPath , setContinuationPath , error , continuation  }  = useDataContext();
    const endRef = useRef(null);

    useEffect(() => { 
        setEndRef(endRef);
    } , [setEndRef]);

    useEffect(() => { 
        setPath(`/channel/liveStreams?id=${channelId}`)
        setContinuationPath(`/channel/liveStreams?id=${channelId}&token=${continuation}`)
    } , [continuation , channelId , setPath , setContinuationPath ]);

    if (error) console.log(error)



    return (
        <section className='w-full p-4'>
            <VideoDisplay
                mainVideos={mainVideos}
                extraVideos={extraVideos}
                shorts={shorts}
                loadingInitial={loadingInitial}
                loadingMore={loadingMore}
                isEnd={isEnd}
                endRef={endRef}
                noAvatar={true}
            />

            {continuation === '' && <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Live Streams! <SentimentSatisfiedAlt /></font>}
        </section>
    )
}
