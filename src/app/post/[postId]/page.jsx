'use client';
import api from '@/context/Api';
import { commentContinuationFetcher, commentFetcher, infiniteScroller } from '@/context/FetchingFunctions';
import { bestMatchLocator, formatViewCount } from '@/context/MultiContentRender';
import { Circle, CommentOutlined, ExpandMoreOutlined, RadioButtonChecked, RadioButtonUnchecked, ThumbDownAltOutlined, ThumbDownOutlined, ThumbUpOutlined, VisibilityOffOutlined, VisibilitySharp } from '@mui/icons-material';
import { Avatar, CircularProgress, Tooltip } from '@mui/material';
import { HttpStatusCode } from 'axios';
import Link from 'next/link'
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

export default function Post() {

  const { postId } = useParams();

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [continuationComments, setContinuationComments] = useState('');
  const [isEnd, setIsEnd] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  const topRef = useRef(null);

  const [replies, setReplies] = useState();
  const [hideComments, setHideComments] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await api.get(`post/info?id=${postId}`);
        if (post.status === HttpStatusCode.Ok && post.data) {
          setPost(post.data);

        }
      } catch (error) {
        setError(error);
      }
    }
    fetchPost();
  }, [postId])

  useEffect(() => {
    const fetchPostComments = async () => {
      await commentFetcher({
        videoId: postId,
        path: 'post',
        setComments,
        setError,
        setContinuationComments,
        setLoadingMore
      })
    }
    fetchPostComments();
  }, [postId])

  const fetchMoreComments = async () => {
    await commentContinuationFetcher({
      videoId: postId,
      path: 'post',
      setComments,
      continuationComments,
      setContinuationComments,
      setLoadingMore,
      setError
    })
  }

  infiniteScroller(endRef, setIsEnd, fetchMoreComments)



  function toggleHideComments() {
    if (hideComments) {
      setHideComments(false);
    } else {
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

  const handeleSelection = (id, postId) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [postId]: id,
    }));
  };

  const PostCard = ({ item  }) => {

    return (

      <main
        className={`overflow-hidden flex p-4 gap-4 border-[1px] border-[#ff8a00] rounded-3xl  shadow-custom-dark `}>

        <Avatar
          src={bestMatchLocator(item?.authorThumbnail, 'url')}
          alt={`Thumbnail of ${item?.title}`}
          className={`h-[50px] w-[50px] `}
        />

        <section className="flex flex-col w-full">

          <h2 className='text-sm font-semibold  flex items-center gap-3'>{item?.authorText}
            <Circle className='text-sm text-gray-400' />
            <font className='text-sm text-gray-400 hover:text-[#fff]'>{item?.publishedTimeText}</font>
          </h2>

          <span
            className="responsive-paragraph text-gray-400 mt-2 font-[400] "
            dangerouslySetInnerHTML={{
              __html: item?.contentText
                .replace(/(https?:\/\/[^\s]+)/g, (match) => {
                  return `<a href="${match}" target="_blank" class="text-blue-500 hover:underline" rel="noopener noreferrer">${match}</a>`;
                })
                .replace(/#([A-Za-z0-9_]+)/g, (match) => {
                  return `<a href="/hashtag/${match.slice(1).toLowerCase()}" class="text-blue-500 hover:underline">${match}</a>`;
                })
                .replace(/(?:\r\n|\r|\n)/g, '<br>')
                .replace(/\[([0-9:]+)\]/g, '<br>[$1]')
                .replace(/<sub>(.*?)<\/sub>/g, '<br><sub>$1</sub>')
                .replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, (match) => {
                  return `<a href="mailto:${match}" class="text-blue-500 hover:underline">${match}</a>`;
                })
            }}
          />

          <font className='text-gray-400 responsive-paragraph text-sm'>{item?.attachment?.totalVotes}</font>

          {item?.attachment?.type === 'poll' && item?.attachment?.choices && item?.attachment?.choices.map((choice, index) => (
            <span
              key={index}
              onClick={() => handeleSelection(index.toString(), item?.postId)}
              className={`${selectedOptions[item?.postId] === index.toString() ? 'bg-[#ff88004e]' : ''} border-[1px] border-[#ff8a00] rounded-lg w-full flex items-center gap-2 mt-2 px-4 py-2`}>
              {selectedOptions[item?.postId] === index.toString() ? <RadioButtonChecked className='text-[#ff8a00]' /> : <RadioButtonUnchecked />}  {choice}
            </span>
          ))}


          {item?.attachment?.type === 'video' && item?.attachment &&
            <Link href={`/video/${item?.attachment?.videoId}`} >

              <section className={`my-4 cursor-pointer overflow-hidden flex flex-col md:flex-row gap-2 rounded-xl shadow-custom-dark `}>

                <span className='relative '>
                  <img
                    src={bestMatchLocator(item?.attachment?.thumbnail, 'url')}
                    onError={(e) => (e.target.src = bestMatchLocator(item?.attachment?.thumbnail, 'url'))}
                    alt={`thumbnail not found`}
                    className={`md:h-[180px] h-full max-w-[200px] max-h-[180px] min-w-full md:min-w-[200px] rounded-tl-3xl rounded-br-3xl shadow-custom-dark border-b-[1px] border-[#423f3c] `}
                  />
                  <font className={`absolute bottom-2 right-2 text-xs px-2 py-1 rounded mr-2 items-center justify-center ${item?.attachment?.lengthText === 'Live' ? 'bg-[#e93232e6] text-white px-3' : 'bg-[#000000ae]'}`}>
                    {item?.attachment?.lengthText === 'Live' ? 'LIVE' : item?.attachment?.lengthText}
                  </font>
                </span>

                <section className="px-4 py-2 flex items-start gap-4 my-2 ">

                  <span className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-400 ">{item?.attachment?.title}</p>

                    <font className="text-xs font-semibold text-gray-400 md:mt-2">{item?.attachment?.channelTitle}
                    </font>
                    <p className="text-xs text-gray-400">{formatViewCount(item?.attachment?.viewCount)} views | {item?.publishedTimeText}</p>
                  </span>
                </section>

              </section>
            </Link>
          }

          {item?.attachment?.type === 'image' && item?.attachment &&

            <span className=" mt-2 max-w-[400px] max-h-[300px] overflow-hidden">
              <img
                src={bestMatchLocator(item?.attachment?.image, 'url')}
                onError={(e) => (e.target.src = item?.attachment?.image[0]?.url)}
                alt={`thumbnail not found`}
                height={300}
                width={400}
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </span>

          }

          {item?.attachment?.type === 'multi_image' && item?.attachment?.image.length > 1 && (

            <section className={`my-4 w-full flex gap-2`}>
              <div className="overflow-x-scroll snap-x snap-mandatory snap-center w-full flex gap-4 space-x-2 scroll-smooth py-2 " style={{ scrollBehavior: 'smooth' }}>
                {item?.attachment?.image.map((pic, index) => (
                  <img
                    key={index}
                    src={bestMatchLocator(pic, 'url')}
                    onError={(e) => (e.target.src = pic[0]?.url)}
                    alt={`thumbnail not found`}
                    height={300}
                    width={400}
                    style={{ objectFit: 'cover' }}
                    className="rounded-lg snap-always"
                  />
                ))}


              </div>
            </section>
          )}



          <span className='flex responsive-paragraph text-gray-400 items-center gap-2 py-4 '>
            <ThumbUpOutlined /> {item?.voteCountText}
            <ThumbDownOutlined /> Dislike
            <CommentOutlined /> {item?.replyCount ? item?.replyCount : 'No Comments'}
          </span>
        </section>
      </main>
    )
  };

  if (error) console.log(error);

  return (
    <main className={` relative pt-6 overflow-hidden flex flex-col p-2 gap-4 border-[1px] border-[#ff8a00] rounded-tl-3xl rounded-br-3xl shadow-custom-dark `} >

      {post && <PostCard item={post} />}


      <span ref={topRef} />

      <span className=' fixed bottom-4 right-4 flex items-center z-10 p-4 backdrop-blur-lg bg-[#2e2e2e80] rounded-lg border-t-[1px] border-[#ff8a00]  backdrop-opacity-15'>
      
        <button

          onClick={toggleHideComments}

          className=' ml-auto border-[1px] p-2 rounded-full border-[#ff8a00]'>
          {hideComments ? <p> <VisibilitySharp /></p> : <p>  <VisibilityOffOutlined /></p>}
        </button>
      </span>

      <section id='comments' className={`${hideComments ? 'max-h-[0] opacity-0 ' : 'min-h-[50px] opacity-100 '} relative transition-all duration-300 ease-in-out rounded-lg`}>

      <h1 className='flex items-center z-10 p-4 backdrop-blur-lg bg-[#2e2e2e80] rounded-lg border-t-[1px] border-[#ff8a00]  backdrop-opacity-15 '>Comments</h1>


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
        <span ref={endRef} className='min-h-[100px] p-4 w-full mx-auto' />
      </section>

    </main>
  )
}
