'use client'
import { commentContinuationFetcher, commentFetcher, infiniteScroller } from '@/context/FetchingFunctions';
import { bestMatchLocator } from '@/context/MultiContentRender';
import { Check, ExpandMoreOutlined, ThumbDownAltOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { Avatar, CircularProgress, Tooltip } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

export default function ShortsComments({
    shortsId,
    setError
}) {

    const [comments, setComments] = useState([]);
    const [continuationComments, setContinuationComments] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const endref = useRef(null);

    const [moreRequest, setMoreRequest] = useState(false);

    const hasFetched = useRef(false);


    useEffect(() => {
        const fetchComments = async () => {
            try {
                if (shortsId !== undefined && shortsId !== null && !hasFetched.current) {
                    hasFetched.current = true;
                    await commentFetcher({
                        videoId: shortsId,
                        setComments,
                        setContinuationComments,
                        setLoadingMore,
                        setError
                    })
                }
            } catch (error) {
                setError(error);
            } finally {
                setMoreRequest(true);
            }
        }
        fetchComments();
    }, [shortsId])

    const fetchMoreComments = async () => {
        try {
            if (shortsId === undefined || shortsId === null) {
                return;
            } else if (isEnd && moreRequest) {
                commentContinuationFetcher({
                    videoId: shortsId,
                    setComments,
                    continuationComments,
                    setContinuationComments,
                    setLoadingMore,
                    setError
                })
                setMoreRequest(false);
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoadingMore(false);
            setMoreRequest(true)
        }
    }

    infiniteScroller(endref, setIsEnd, fetchMoreComments);

    return (
        <section className='w-full flex flex-col'>
            {comments
                ?.sort((a, b) => (b.authorIsChannelOwner ? 1 : 0) - (a.authorIsChannelOwner ? 1 : 0))
                .map((comment, index) => (
                    <span key={index} className='relative flex gap-2 w-full p-4 '>
                        <Link href={`/channel/${comment?.authorChannelId}`} passHref>
                            <Avatar
                                src={bestMatchLocator(comment.authorThumbnail, 'url')}
                                alt={comment?.authorName}
                                className='w-8 h-8'
                            />
                        </Link>

                        <span className='w-full flex flex-col'>
                            <span className='text-sm font-semibold items-center flex gap-2'>
                                <Link href={`/channel/${comment?.authorChannelId}`} passHref>
                                    <Tooltip placement="top-start" title={comment?.authorText}>
                                        <font className={`${comment?.isCreator ? 'bg-gray-500 p-[5px] rounded-full' : ''}`}>
                                            {comment?.authorText}
                                        </font>
                                    </Tooltip>
                                </Link>

                                {`  `}
                                {comment?.isVerified ? <Check className='w-4 h-4' /> : ''}
                                <font className='text-xs text-gray-500'>
                                    {comment?.publishedTimeText ? comment?.publishedTimeText : comment?.publishDate}
                                </font>
                            </span>

                            <div
                                className='text-xs text-gray-400 mt-1 ml-2'
                                dangerouslySetInnerHTML={{
                                    __html: comment?.textDisplay
                                        .replace(/(https?:\/\/[^\s]+)/g, (match) => {
                                            return `<a href="${match}" target="_blank" class="text-blue-500 hover:underline" rel="noopener noreferrer">${match}</a>`;
                                        })
                                        .replace(/(?:\r\n|\r|\n)/g, '<br>')
                                        .replace(/\[([0-9:]+)\]/g, '<br>[$1]')
                                        .replace(/<sub>(.*?)<\/sub>/g, '<br><sub>$1</sub>')
                                }}
                            />

                            <p className='text-xs mt-2 ml-2 flex gap-2 items-center'>
                                <ThumbUpOutlined className='w-6 h-6 cursor-pointer' />
                                {comment?.likesCount}
                                <ThumbDownAltOutlined className='w-6 h-6 ml-4 cursor-pointer' />
                            </p>

                            <button
                                // onClick={() => toggleShowReplies(comment?.commentId)}
                                className='text-xs mt-2 ml-2 flex gap-2 items-center text-blue-500'>
                                <ExpandMoreOutlined className='w-6 h-6 cursor-pointer' />
                                {comment?.replyCount} replies
                            </button>
                        </span>

                        <span className='absolute bottom-1 right-0 left-0 h-[1px] bg-gray-500 ' />
                    </span>
                ))}
            {
                !loadingMore && continuationComments !== '' &&
                <span className='flex justify-center items-center gap-2 w-full p-4 text-gray-500'>
                    <CircularProgress /> Loading more comments
                </span>
            }

            <span ref={endref} className='w-full h-10' />
        </section>
    )
}
