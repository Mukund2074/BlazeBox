'use client';
import { useDataContext } from '@/context/DataProvider';
import SkeletonLoader from '@/context/Loader';
import { PlaylistCard } from '@/context/MultiContentRender';
import { SentimentSatisfiedAlt } from '@mui/icons-material';
import React, { useEffect, useRef } from 'react'

export default function ChannelPlaylist({ channelId }) {

    const { playlists, loadingInitial, loadingMore, continuation, error, setPath, setContinuationPath, setEndRef } = useDataContext();

    const endRef = useRef(null);
    useEffect(() => {
        let decodeID = decodeURIComponent(channelId);

        if (decodeID.startsWith('@')) {
            setPath(`channel/playlists?forUsername=${decodeID}`);
            setContinuationPath(`channel/playlists?forUsername=${decodeID}&token=${continuation}`);
        } else {
            setPath(`channel/playlists?id=${decodeID}`);
            setContinuationPath(`channel/playlists?id=${decodeID}&token=${continuation}`);
        }
    }, [continuation, channelId, setPath, setContinuationPath]);

    useEffect(() => {
        setEndRef(endRef);
    }, [setEndRef]);


    if (loadingInitial) {
        return (
            <span className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonLoader key={i} />)}
            </span>
        )
    }

    if (error) console.log(error)

    return (

        <React.Fragment>
            <section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {playlists && playlists.map((item, index) => (
                    <PlaylistCard key={index} item={item} />
                ))}
                <span ref={endRef} />
            </section>
            {loadingMore && <SkeletonLoader count={10} noGrid={true} />}

            {continuation === '' && <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Playlists! <SentimentSatisfiedAlt /></font>}
        </React.Fragment>
    )
}
