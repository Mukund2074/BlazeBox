'use client';
import { useDataContext } from '@/context/DataProvider';
import { ShortsLoader } from '@/context/Loader';
import { bestMatchLocator, formatViewCount, ShortsDisplay } from '@/context/MultiContentRender';
import { SentimentSatisfiedAlt, Visibility } from '@mui/icons-material';
import React, { useEffect, useRef } from 'react'

export default function ChannelShorts({ channelId }) {

    const { shorts , loadingInitial ,continuation , loadingMore , error  , setPath , setContinuationPath , setEndRef } = useDataContext();
    const endRef = useRef(null);

    useEffect(() => {
        let decodeID = decodeURIComponent(channelId);

        if(decodeID.startsWith('@')){
            setPath(`channel/shorts?forUsername=${decodeID}`);
            setContinuationPath(`channel/shorts?forUsername=${decodeID}&token=${continuation}`);
        } else {
            setPath(`channel/shorts?id=${decodeID}`);
            setContinuationPath(`channel/shorts?id=${decodeID}&token=${continuation}`);
        }
    }, [continuation , channelId , setPath , setContinuationPath ]);

    

    useEffect(() => {
        setEndRef(endRef);
    } , [setEndRef]);

    if (loadingInitial) return <ShortsLoader />

    if (error) console.log(error)


    return (
        <React.Fragment>
            <main className='p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6'>
                {shorts && shorts.map((item, index) => <ShortsDisplay key={index} data={item} index={index} />)}
                <span ref={endRef} />
            </main>
            {loadingMore && <ShortsLoader />}

            {continuation === '' && <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Shorts list! <SentimentSatisfiedAlt /></font>}
        </React.Fragment>
    )
}
