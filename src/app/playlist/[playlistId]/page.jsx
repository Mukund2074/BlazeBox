'use client';
import api from '@/context/Api';
import { History, PlaylistPlay } from '@mui/icons-material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Avatar, Tooltip } from '@mui/material';
import { bestMatchLocator, formatViewCount } from '@/context/MultiContentRender';
import { useDataContext } from '@/context/DataProvider';

export default function Playlist() {

    const { playlistId } = useParams();

    const { response , setPath } = useDataContext();
    useEffect(() => {
        setPath(`playlist?id=${playlistId}`);
    }, [playlistId , setPath]);
    

    const playlist = response;
    

    return (

        <main className='flex flex-col md:flex-row gap-2 p-2 rounded-lg'>

            {playlist?.meta &&
                <section
                    className={`relative w-full md:w-[30%] min-h-[450px] md:min-h-[calc(100vh-100px)] bg-cover bg-center rounded-[30px]`}
                    style={{ backgroundImage: `url(${bestMatchLocator(playlist?.meta?.thumbnail, 'url')})` }}>
                    <span className="px-3 absolute rounded-[30px] inset-0 bg-[#323131] bg-opacity-30 backdrop-blur-lg flex flex-col  gap-4 justify-center md:justify-start items-center md:items-start pt-10">

                        <img
                            src={bestMatchLocator(playlist?.meta?.thumbnail, 'url')}
                            alt="Centered Image"
                            className="rounded-xl self-center border-[1px] border-[#ff8a00]" />


                        <span className=''>
                            <h1 className='text-xl md:text-3xl font-bold '>{playlist?.meta?.title}</h1>

                            <span className='flex gap-2 items-center'>
                                <PlaylistPlay className='w-[50px] h-[50px]' />
                                <font className='text-xs'>{playlist?.data?.length} Videos</font>
                                <font className='text-xs'>{playlist?.meta?.channelHandle}</font>
                            </span>

                            <Tooltip title={playlist?.meta?.channelTitle} placement='top'>
                                <Link href={`/channel/${playlist?.meta?.channelId}`} className='flex gap-2 items-center'>

                                    <Avatar
                                        src={bestMatchLocator(playlist?.meta?.avatar, 'url')}
                                        alt={playlist?.meta?.channelTitle}
                                        className='w-[50px] h-[50px] rounded-full'
                                    />

                                    <font className="flex flex-col">
                                        <font className="text-sm"> by {playlist?.meta?.channelTitle}</font>
                                        <font className="text-xs text-gray-300">{playlist?.meta?.viewCountText}</font>
                                    </font>

                                </Link>
                            </Tooltip>

                            <span className='flex gap-2 items-center'>
                                <History className='w-[50px] h-[50px]' />
                                <font className='text-xs'>{playlist?.meta?.lastUpdated}</font>
                            </span>


                        </span>
                    </span>

                </section>
            }

            {playlist?.data &&
                <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 w-full md:w-[70%] gap-2 px-8 md:overflow-y-scroll md:max-h-[calc(100vh-100px)]'>
                    {playlist?.data?.map((item, index) => (

                        <Link key={index} href={`/video/${item?.videoId}?playlistId=${playlistId} `} className=' flex flex-col  md:flex-row gap-2 items-center md:px-2 px-8 py-4 '>
                            {index + 1}.
                            <span className='relative '>
                                <img
                                    src={bestMatchLocator(item?.thumbnail, 'url')}
                                    alt="Centered Image"
                                    
                                    className=" max-w-[300px] min-h-[150px] rounded-xl self-center border-[1px] border-[#ff8a00] " />
                                <font className='text-xs text-gray-300 bg-[#000000ae] px-2 py-1 rounded absolute right-2 bottom-2 ' >{item?.lengthText}</font>
                            </span>

                            <span className='flex flex-col w-[300px] md:w-full '>
                                <font className='font-semibold line-clamp-2 text-wrap'>{item?.title}</font>
                                <font className='text-gray-300'>{item?.videoOwnerChannelTitle}</font>
                                <font className='text-xs text-gray-300'>{formatViewCount(item?.viewCount)} views | {item?.publishedTimeText}</font>
                            </span>

                        </Link>
                    ))}
                    <span className='border-b-[1px] border-b-[#ff8a00] w-full h-1' />
                </section>
            }
        </main>
    );

}

