'use client';
import { Circle, CommentOutlined, PlaylistPlay, RadioButtonChecked, RadioButtonUnchecked, ThumbDownOutlined, ThumbUpOutlined, Visibility } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Link from "next/link";

export const handleThumbnailHover = (e, item, pathKey) => {
    let previousSrc = e.target.src;

    const handleImageError = () => {
        e.target.src = previousSrc;
    };

    if (e.type === 'mouseenter') {
        const newSrc = item?.richThumbnail?.[0]?.url ?
            item?.richThumbnail?.[0]?.url :
            bestMatchLocator(item?.[pathKey], 'url');
        previousSrc = e.target.src;
        e.target.src = newSrc;
        e.target.onerror = handleImageError;
    }

    else if (e.type === 'mouseleave') {
        const bestMatchSrc = bestMatchLocator(item?.[pathKey], 'url');
        previousSrc = e.target.src;
        e.target.src = bestMatchSrc;

        e.target.onerror = handleImageError;
    }
};


export const bestMatchLocator = (path, key) => {
    return path?.slice()?.reverse()?.map(item => item?.[key])?.find(item => item) || '/not-found.png';
};


export const formatViewCount = (number) => {
    if (number >= 1_000_000_000) {
        return (number / 1_000_000_000).toFixed(1) + 'B';
    } else if (number >= 1_000_000) {
        return (number / 1_000_000).toFixed(1) + 'M';
    } else if (number >= 1_000) {
        return (number / 1_000).toFixed(1) + 'K';
    }
    return number?.toString();
};


export const PlaylistCard = ({ item = [], endRef = null }) => {

    return (
        <Link key={item?.playlistId} ref={endRef} href={`/playlist/${item?.playlistId}`}
            className=''>

            <section className={`relative cursor-pointer overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:scale-105 border-b-[2px] border-l-[1px] border-[#ff8a00] rounded-tl-3xl rounded-br-3xl shadow-custom-dark`}>

                <div className="relative w-full h-[200px] pt-2 flex justify-center backdrop-blur-lg ">

                    <span className="absolute z-10 w-full h-[200px] rounded-xl backdrop-blur-lg  ">
                        <img
                            src={bestMatchLocator(item?.thumbnail, 'url')}
                            onError={(e) => (e.target.src = bestMatchLocator(item?.thumbnail, 'url'))}
                            onMouseEnter={(e) => handleThumbnailHover(e, item, 'thumbnail')}
                            onMouseLeave={(e) => handleThumbnailHover(e, item, 'thumbnail')}
                            alt={`Thumbnail of ${item?.title}`}
                            className=" w-full h-full rounded-xl z-0 brightness-[0.1] rounded-br-md shadow-custom-dark border-[1px] border-[#b6b2ae] "
                        />
                    </span>
                    <span className="absolute z-10 px-2 pt-2 w-full h-[200px] rounded-xl   ">
                        <img
                            src={bestMatchLocator(item?.thumbnail, 'url')}
                            onError={(e) => (e.target.src = bestMatchLocator(item?.thumbnail, 'url'))}
                            onMouseEnter={(e) => handleThumbnailHover(e, item, 'thumbnail')}
                            onMouseLeave={(e) => handleThumbnailHover(e, item, 'thumbnail')}
                            alt={`Thumbnail of ${item?.title}`}
                            className=" w-full h-full rounded-xl z-0 brightness-[0.1] rounded-br-md shadow-custom-dark border-[1px] border-[#b6b2ae] "
                        />
                    </span>
                    <span className="absolute z-10 px-4 pt-4 w-full h-[200px] rounded-xl ">
                        <img
                            src={bestMatchLocator(item?.thumbnail, 'url')}
                            onError={(e) => (e.target.src = bestMatchLocator(item?.thumbnail, 'url'))}
                            onMouseEnter={(e) => handleThumbnailHover(e, item, 'thumbnail')}
                            onMouseLeave={(e) => handleThumbnailHover(e, item, 'thumbnail')}
                            alt={`Thumbnail of ${item?.title}`}
                            className=" w-full h-full rounded-xl z-0 brightness-[0.1] rounded-br-md shadow-custom-dark border-[1px] border-[#b6b2ae]"
                        />
                    </span>
                    <span className={`text-xs absolute z-30 px-2 py-1 rounded self-end mr-2 items-center justify-center bg-black right-2 `}>
                        <PlaylistPlay />   {item?.videoCount} Videos
                    </span>
                </div>

                <section className="p-2 min-h-[80px] flex items-start gap-4 mt-2">
                    <span className="flex flex-col">
                        <p className="text-lg font-bold line-clamp-1">{item?.title}</p>
                    </span>
                </section>
            </section>
        </Link>
    );
}


export const VideoCard = ({
    item = [],
    endRef = null,
    last8thVideo = false,
    noAvatar = false,
    lastvideo = false,
    currentIndex = 0
}) => {

    let Videoref = currentIndex.toString() === last8thVideo.toString() || currentIndex.toString() === lastvideo.toString() ? endRef : null


    let url = '';
    if (item?.videoId) {
        const titleLower = item?.title.toLowerCase();
        if (titleLower.includes('#short') || titleLower.includes('#shorts') || item?.type === 'shorts') {
            url = `/shorts/${item?.videoId}`;
        } else {
            url = `/video/${item?.videoId}`;
        }
    }


    return (

        <Link
            ref={Videoref}
            href={url}
            className="sm:max-w-[200px]">

            <section className={`relative cursor-pointer overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:scale-105 border-b-[2px] border-l-[1px] border-[#ff8a00] rounded-tl-3xl rounded-br-3xl shadow-custom-dark `}>
                {/* <h1 className='text-2xl font-bold'>{currentIndex}</h1> */}
                <span className="relative">
                    <img
                        src={bestMatchLocator(item?.thumbnail, 'url')}
                        onError={(e) => (e.target.src = '/not-found.png')}
                        onMouseEnter={(e) => handleThumbnailHover(e, item, "thumbnail")}
                        onMouseLeave={(e) => handleThumbnailHover(e, item, "thumbnail")}
                        alt={`Thumbnail of ${item?.title}`}
                        className={`relative h-[180px] min-w-[200px] w-full rounded-tl-3xl rounded-br-3xl shadow-custom-dark border-b-[1px] border-[#423f3c] `}
                    />
                    <span className={`text-xs absolute right-2 bottom-2 px-2 py-1 rounded self-end mr-2 items-center justify-center ${item.lengthText === 'Live' ? 'bg-[#e93232e6] text-white px-3' : 'bg-[#000000ae]'}`}>
                        {item.lengthText === 'Live' ? 'LIVE' : item.lengthText}
                    </span>
                </span>
                <section className="p-2 flex items-start gap-4 h-[120px]">
                    {noAvatar ? null : (
                        <span className="min-w-[40px] h-[40px]">
                            <Avatar
                                className="rounded-full w-[40px] h-[40px] object-cover"
                                src={bestMatchLocator(item?.channelThumbnail, 'url')}
                                onError={(e) => (e.target.src = bestMatchLocator(item?.channelThumbnail, 'url') || '/not-found.png')}
                                alt={`Channel Thumbnail of ${item?.channelTitle}`}
                            />
                        </span>
                    )}
                    <span className="flex flex-col ">
                        {/* {currentIndex.toString() === last8thVideo.toString() || currentIndex === lastvideo && <span className="text-xs translate-y-[-12px] px-2 py-1 rounded self-end mr-2 items-center justify-center bg-[#000000be]">{`this is the last video or last 8th video`}</span>} */}
                        <p className="text-sm md:text-md font-bold line-clamp-2">{item?.title}</p>
                        <p className="text-xs text-gray-300 line-clamp-1">{item?.channelTitle}</p>
                        <p className="text-xs text-gray-300 line-clamp-1">{formatViewCount(item?.viewCount)} views | {item?.publishedTimeText}</p>
                    </span>
                </section>

            </section>
        </Link>
    )
}

export const PostCard = ({ item, endRef, selectedOptions, handleSelection, setSelectedOptions }) => {

    let last4th = item.length - 4;

    return (

        <main
            key={item?.postId}
            ref={last4th ? endRef : null}
            className={`overflow-hidden flex p-4 gap-4 border-[1px] border-[#ff8a00] rounded-tl-3xl rounded-br-3xl shadow-custom-dark `}>

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
                    className="responsive-paragraph line-clamp-3 text-gray-400 mt-2 font-[400] "
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
                <Link href={`/post/${item?.postId}`} className='text-sm text-gray-500 hover:text-blue-400 hover:underline self-start '>...View Full Post</Link>

                <font className='text-gray-400 responsive-paragraph text-sm'>{item?.attachment?.totalVotes}</font>

                {item?.attachment?.type === 'poll' && item?.attachment?.choices && item?.attachment?.choices.map((choice, index) => (
                    <span
                        key={index}
                        onClick={() => handleSelection(index.toString(), item?.postId)}
                        className={`${selectedOptions[item?.postId] === index.toString() ? 'bg-[#ff88004e]' : ''} border-[1px] border-[#ff8a00] rounded-lg w-full flex items-center gap-2 mt-2 px-4 py-2`}>
                        {selectedOptions[item?.postId] === index.toString() ? <RadioButtonChecked className='text-[#ff8a00]' /> : <RadioButtonUnchecked />}  <font className='responsive-paragraph font-semibold'>{choice}</font>
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
                                    <p className="text-sm font-semibold text-gray-400 line-clamp-1">{item?.attachment?.title}</p>

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



export const ShortsDisplay = ({ data, index }) => {


    return (
        <Link key={index} href={`/shorts/${data?.videoId}`} className="flex flex-col max-h-[380px] mx-auto border-[1px] border-[#ff8a00] overflow-hidden rounded-tl-3xl rounded-br-3xl">
            <div className="relative hover:shadow-md flex flex-col max-h-[380px] mx-auto border-[1px] border-[#ff8a00] overflow-hidden rounded-tl-3xl rounded-br-3xl">
                <img src={bestMatchLocator(data?.thumbnail, 'url')}
                    className="w-full h-full object-cover rounded-tl-3xl rounded-br-3xl" alt="thumbnail" />
                <span className="absolute max-h-[85px] bottom-0 p-2 flex flex-col items-start gap-2 mt-2 bg-[#0000009f]">
                    <font className="line-clamp-2 text-sm font-semibold">{data?.title}</font>
                    <font className="flex items-center gap-2 text-sm font-semibold text-gray-400"><Visibility /> {formatViewCount(data?.viewCountText)}</font>
                </span>
            </div>
        </Link>
    )
}