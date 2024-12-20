'use client';
import { continuationFetcher, infiniteScroller, mainFetcher } from '@/context/FetchingFunctions';
import SkeletonLoader from '@/context/Loader';
import { PlaylistCard, VideoCard } from '@/context/MultiContentRender';
import { AccessTime, AutoGraph, FilterList, HistoryToggleOff, SentimentSatisfiedAlt } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react'

export default function ChannelSearch({
    channelId,
    searchedText,
}) {

    useEffect(() => {
        if (searchedText === '') {
            setSearchResults([]);
        }
    }, [searchedText])

    const [searchResults, setSearchResults] = useState([]);
    const [continuation, setContinuation] = useState('');
    const [isEnd, setIsEnd] = useState(false);
    const [error, setError] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [countryCode, setCountryCode] = useState('');
    const endRef = useRef(null);

    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState('newest');

    let decodedId = decodeURIComponent(channelId);
    let url;

    if (decodedId.startsWith('@')) {
        url = `channel/search?forUsername=${decodedId}`;
    } else {
        url = `channel/search?id=${decodedId}`;
    }


    useEffect(() => {
        const fetchData = async () => {
            if (searchedText.length >= 2) {
                mainFetcher({
                    setResponce: setSearchResults,
                    setContinuation,
                    setError,
                    setCountryCode,
                    path: `${url}/&query=${searchedText}`,
                    setLoadingInitial,
                    noGeo: true
                })
            }
        };
        fetchData();
    }, [searchedText]);



    const fetchMoreData = async () => {
        continuationFetcher({
            setResponce: setSearchResults,
            setContinuation,
            setIsEnd,
            setLoadingMore,
            countryCode,
            continuation,
            path: `${url}/&query=${searchedText}&token=${continuation}`,
            isEnd,
            loadingMore
        })
    };

    infiniteScroller(endRef, setIsEnd, fetchMoreData);

    const fileterTypes = [
        { name: "Newest", path: 'newest', icon: <AccessTime /> },
        { name: "Oldest", path: 'oldest', icon: <HistoryToggleOff /> },
        { name: "Popular", path: 'popular', icon: <AutoGraph /> }
    ]


    if (loadingInitial) return <SkeletonLoader count={10} noGrid={true} />

    return (
        <main className='relative' >

            <button
                onClick={() => setShowFilters(!showFilters)}
                className='ml-auto p-2 flex items-center gap-2 text-sm font-semibold border-[1px] border-[#ff8a00] rounded-xl '  >
                <FilterList />Filter
            </button>

            {showFilters && (
                <div className='absolute top-12 right-2 bg-[#1f1f1f] w-2/3 md:w-1/4 z-30 p-4 px-8 rounded-xl flex flex-col gap-4'>
                    {fileterTypes.map((item, index) => (
                        <button  key={index} onClick={() => {
                            setLoadingInitial(true);
                            setActiveFilter(item.path);
                            setSearchResults([]);
                            setContinuation('');
                            mainFetcher({
                                setResponce: setSearchResults,
                                setContinuation,
                                setError,
                                setCountryCode,
                                path: `${url}/&query=${searchedText}&sort_by=${item.path}`,
                                setLoadingInitial,
                                noGeo: true
                            })
                            setShowFilters(false);
                            setLoadingInitial(false);
                        }} className={`flex items-center ${activeFilter === item.path ? ' bg-[#ff880070]' : ''} hover:text-[#ff8a00] gap-2 justify-center border-[1px] border-[#ff8a00] rounded-lg p-2 `} >
                            {item.icon} {item.name}
                        </button>
                    ))}
                </div>
            )}


            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
                {searchResults && searchResults.data && searchResults.data.length > 0 && searchResults.data.map((item, index) => {
                    let last8thVideo = searchResults.data.length - 8;
                    let lastvideo = searchResults.data.length - 1;
                    if (item.type === 'video') {
                        return <VideoCard key={index} item={item} noAvatar={true} lastvideo={lastvideo} endRef={endRef} last8thVideo={last8thVideo} />;
                    } else if (item.type === 'playlist') {
                        return <PlaylistCard key={index} item={item} />;
                    }
                    return null;
                })}

            </section>
            <span ref={endRef} />
            {continuation === '' && <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Videos! <SentimentSatisfiedAlt /></font>}
        </main>
    )
}
