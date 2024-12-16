'use client';
import { useDataContext } from '@/context/DataProvider';
import { CommunityLoader } from '@/context/Loader';
import { PostCard } from '@/context/MultiContentRender';
import { SentimentSatisfiedAlt } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';

export default function ChannelCommunity({ channelId }) {

    const { post, setPath, setContinuationPath, continuation, setEndRef, loadingInitial, loadingMore, error } = useDataContext();

    useEffect(() => {
        setPath(`/channel/community?id=${channelId}`);
        setContinuationPath(`/channel/community?id=${channelId}&token=${continuation}`);
    }, [continuation, channelId, setPath, setContinuationPath]);

    useEffect(() => {
        setEndRef(endRef);
    }, [setEndRef]);

    const endRef = useRef(null);

    const [selectedOptions, setSelectedOptions] = useState({});
    const [isScrolledLeft, setIsScrolledLeft] = useState(false);
    const [isScrolledRight, setIsScrolledRight] = useState(false);



    const handleSelection = (id, postId) => {
        setSelectedOptions((prevState) => ({
            ...prevState,
            [postId]: id,
        }));
    };




    useEffect(() => {
        const container = document.querySelector('.overflow-x-auto');
        if (container) {
            const handleScrollPosition = () => {
                const scrollLeft = container.scrollLeft;
                const scrollWidth = container.scrollWidth;
                const clientWidth = container.clientWidth;


                setIsScrolledLeft(scrollLeft > 0);
                setIsScrolledRight(scrollLeft < scrollWidth - clientWidth);
            };

            container.addEventListener('scroll', handleScrollPosition);

            handleScrollPosition();

            return () => {
                container.removeEventListener('scroll', handleScrollPosition);
            };
        }
    }, []);



    if (loadingInitial) return <CommunityLoader />
    if (error) console.log(error)

    return (
        <section
            className="p-2 items-center mx-auto gap-4 flex flex-col w-full lg:w-[40%]" >
            {post && post.map((item, index) => (
                <PostCard
                    key={index}
                    item={item}
                    endRef={endRef}
                    selectedOptions={selectedOptions}
                    handleSelection={handleSelection}
                    isScrolledLeft={isScrolledLeft}
                    isScrolledRight={isScrolledRight}
                />
            ))}
            <span ref={endRef} />
            {loadingMore && <CommunityLoader />}

            {continuation === '' && <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Community list! <SentimentSatisfiedAlt /></font>}
        </section>

    );
}
