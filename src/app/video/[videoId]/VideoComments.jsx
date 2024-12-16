import { commentContinuationFetcher, commentFetcher, infiniteScroller } from '@/context/FetchingFunctions';
import { bestMatchLocator } from '@/context/MultiContentRender';
import { Check, ExpandMoreOutlined, ThumbDownAltOutlined, ThumbUpOutlined } from '@mui/icons-material';
import { VisibilityOffOutlined, VisibilitySharp } from '@mui/icons-material';
import { Avatar, CircularProgress, Tooltip } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'

export default function VideoComments({ videoId, setError }) {


    const [comments, setComments] = useState([]);
    const [isEnd, setIsEnd] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [continuationComments, setContinuationComments] = useState('');
    const endCommentRef = useRef(null);
    const topRef = useRef(null);

    const [replies, setReplies] = useState();
    const [hideComments, setHideComments] = useState(false);

    useEffect(() => {
        const commentFetch = async () => {
            try {
                await commentFetcher({
                    videoId,
                    setComments,
                    setContinuationComments,
                    setLoadingMore,
                    setError
                });
            } catch (error) {
                setError('Failed to load comments');
            }
        };
        commentFetch();
    }, [videoId]);

    const fetchMoreComments = async () => {
        commentContinuationFetcher({
            videoId,
            setComments,
            continuationComments,
            setContinuationComments,
            setLoadingMore,
            setError
        });
    };

    infiniteScroller(endCommentRef, setIsEnd, fetchMoreComments);





    function toggleHideComments() {
       if(hideComments){
        setHideComments(false);
       }else{
        window.scrollTo({ top: topRef.current.offsetTop, behavior: 'smooth' });
        setHideComments(true);
       }
    }

    const toggleShowReplies = (commentId) => {
        if (replies === commentId) {
            setReplies(null);
        } else {
            setReplies(commentId);
        }
    };

    return (
        <main className='w-full  responsive-paragraph flex flex-col gap-2 rounded-lg border-[1px] border-[#ff8a00]'>
            <span ref={topRef} />

            <span className=' sticky flex items-center z-10 top-28 p-4 backdrop-blur-lg bg-[#2e2e2e80] rounded-lg border-t-[1px] border-[#ff8a00]  backdrop-opacity-15'>
                <font className='text-lg font-bold self-start'>Comments</font>
                <Tooltip title='hide comments' placement='right'>
                    <button

                        onClick={toggleHideComments}

                        className=' ml-auto border-[1px] p-2 rounded-full border-[#ff8a00]'>
                        {hideComments ? <p> Show Comments <VisibilitySharp /></p> : <p> Hide Comments <VisibilityOffOutlined /></p>}
                    </button>
                </Tooltip>
            </span>
            <section id='comments'  className={`${hideComments ? 'max-h-[0] opacity-0 ' : 'min-h-[50px] opacity-100 '} transition-all duration-300 ease-in-out rounded-lg relative`}>

                {comments
                    ?.sort((a, b) => (b.authorIsChannelOwner ? 1 : 0) - (a.authorIsChannelOwner ? 1 : 0))
                    .map((comment, index) => (
                        <span key={index} className='flex gap-2 w-full p-4'>
                            <Link href={`/channel/${comment?.authorChannelId}`} passHref>
                                <Avatar
                                    src={bestMatchLocator(comment.authorThumbnail, 'url')}
                                    alt={comment?.authorName}
                                    className='w-12 h-12'
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
                                    className='text-md mt-1 ml-2'
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
                                    onClick={() => toggleShowReplies(comment?.commentId)}
                                    className='text-xs mt-2 ml-2 flex gap-2 items-center text-blue-500'>
                                    <ExpandMoreOutlined className='w-6 h-6 cursor-pointer' />
                                    {comment?.replyCount} replies
                                </button>
                            </span>
                        </span>
                    ))}
                    {
                        !loadingMore && continuationComments !== '' &&
                        <span className='flex justify-center items-center gap-2 w-full p-4 text-gray-500'>
                            <CircularProgress /> Loading more comments
                        </span>
                    }
                <span ref={endCommentRef} className='min-h-[100px] p-4 w-full mx-auto' />
            </section>
        </main>
    )
}
