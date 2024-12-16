'use client'
import { formatViewCount } from '@/context/MultiContentRender';
import { CloseRounded } from '@mui/icons-material'
import Link from 'next/link'
import React from 'react'

export default function DescriptionPopUp({
    handleShowDescription,
    videoRef,
    showDescription,
    ShortsDetails
}) {

    return (
        <section id='detail-description-modal' className={`transition-all duration-500 ease-in-out absolute z-30 flex flex-col items-center bottom-0 left-0 right-0 bg-gradient-to-tl from-[#191a1a] via-[#040408] to-[#48484e] rounded-t-xl w-[100%] h-[100%] `}
            style={showDescription ? { maxHeight: `${videoRef?.current?.clientHeight * 0.8}px` } : { maxHeight: `0px` }}>

            <span className='relative flex items-center justify-center w-1/2 h-[5px] rounded-full bg-[#767676]' />
            <span className='w-full items-center flex'>

                <h2 className='font-bold text-lg mt-2 mx-auto underline-offset-2 underline' > Description </h2>

            </span>
            <button onClick={handleShowDescription} className='absolute top-2 right-2 rounded-full p-1 border-[1px] border-slate-500 ml-auto'>
                <CloseRounded className='w-6 h-6' />
            </button>
            <span className='w-full  rounded-full border-[1px] mt-2 border-slate-500' />

            <section id='comments' className='relative w-full h-full p-2 overflow-y-scroll '>


                {ShortsDetails?.titleWithNavDetails && ShortsDetails?.titleWithNavDetails.map((item, index) => {
                    if (item?.text?.startsWith('#')) {
                        return (
                            <span key={index} className='text-sm font-bold'>
                                <Link href={`/hashtag/${item.text.replace('#', '')}`} className='text-sm font-bold text-blue-500 underline'>{item.text}</Link>
                            </span>
                        );
                    } else if (item?.url?.startsWith('/@')) {
                        return (
                            <span key={index} className='text-sm font-bold'>
                                <Link href={`/search/${item.url.replace(/^\/@/, '')}`} className='text-sm font-bold text-blue-500 underline'>
                                    {item.text}
                                </Link>
                            </span>
                        );
                    } else {
                        return (
                            <span key={index} className='text-sm font-bold'>{item.text}</span>
                        );
                    }
                })}


                <span className='absolute flex w-full divider left-0 right-0 rounded-full border-[1px] mt-2 border-slate-500 ' />

                <div className='w-full flex justify-evenly'>
                    <span className='flex flex-col items-center justify-center'>
                        <p className='mt-4 text-lg font-semibold'>{formatViewCount(ShortsDetails?.likeCount) || 0}</p>
                        <font className="text-sm font-semibold text-gray-400" >likes</font>
                    </span>

                    <span className='flex flex-col items-center justify-center'>
                        <p className='mt-4 text-lg font-semibold'>{formatViewCount(ShortsDetails?.viewCount) || 0}</p>
                        <font className="text-sm font-semibold text-gray-400" >Views</font>
                    </span>

                    <span className="flex flex-col items-center justify-center">
                        <p className="mt-4 text-lg font-semibold">
                            {ShortsDetails?.publishedAt
                                ? new Date(ShortsDetails?.publishedAt).toLocaleString('en-us', { month: 'short' }) + ' ' + new Date(ShortsDetails?.publishedAt).getDate()
                                : 'Invalid Date'}
                        </p>
                        <font className="text-sm font-semibold text-gray-400">
                            {ShortsDetails?.publishedAt
                                ? new Date(ShortsDetails?.publishedAt).getFullYear()
                                : 'Invalid Year'}
                        </font>
                    </span>

                </div>

                <span className='absolute flex w-full  divider left-0 right-0 rounded-full border-[1px] border-slate-500 ' />

                {ShortsDetails?.description &&
                    <div
                        className='w-full mt-2 responsive-paragraph'
                        dangerouslySetInnerHTML={{
                            __html: ShortsDetails?.description
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
                }
            </section>

        </section>
    )
}
