'use client';
import { useDataContext } from '@/context/DataProvider';
import { CommunityLoader } from '@/context/Loader';
import { PostCard } from '@/context/MultiContentRender';
import { SentimentSatisfiedAlt } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import Masonry from '@mui/lab/Masonry'; // Correct import for Masonry

export default function ChannelCommunity({ channelId }) {

    const { post, setPath, setContinuationPath, continuation, setEndRef, loadingInitial, loadingMore, error } = useDataContext();

    useEffect(() => {
        let decodeID = decodeURIComponent(channelId);

        if(decodeID.startsWith('@')){
            setPath(`channel/community?forUsername=${decodeID}`);
            setContinuationPath(`channel/community?forUsername=${decodeID}&token=${continuation}`);
        } else {
            setPath(`channel/community?id=${decodeID}`);
            setContinuationPath(`channel/community?id=${decodeID}&token=${continuation}`);
        }
    }, [continuation , channelId , setPath , setContinuationPath ]);

    useEffect(() => {
        setEndRef(endRef);
    }, [setEndRef]);

    const endRef = useRef(null);

    const [selectedOptions, setSelectedOptions] = useState({});

    const handleSelection = (id, postId) => {
        setSelectedOptions((prevState) => ({
            ...prevState,
            [postId]: id,
        }));
    };

    if (loadingInitial) return <CommunityLoader />;
    if (error) console.log(error);

    return (
        <section className="p-2 items-center mx-auto gap-4 flex flex-col w-full ">
            {/* MUI Masonry to display the items in a 2-column layout */}
            <Masonry columns={{ xs: 1, sm: 2  , md: 3 , lg: 4 , xl: 5 }} spacing={2}>
                {post && post.map((item, index) => (
                    <PostCard
                        key={index}
                        item={item}
                        endRef={endRef}
                        selectedOptions={selectedOptions}
                        handleSelection={handleSelection}
                    />
                ))}
            </Masonry>
            
            <span ref={endRef} />
            {loadingMore && <CommunityLoader />}

            {continuation === '' && (
                <font className="font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2">
                    End of The Community list! <SentimentSatisfiedAlt />
                </font>
            )}
        </section>
    );
}
