'use client';
import { bestMatchLocator, VideoCard } from '@/context/MultiContentRender';
import {  SentimentSatisfiedAlt } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import Link from 'next/link';
import React from 'react'

export default function ChannelHome({ channel }) {


  let playerListings = Array.isArray(channel?.data) ? channel.data.filter((data) => data?.type === 'player') : [];
  let videoListings = Array.isArray(channel?.data) ? channel.data.filter((data) => data?.type === 'video_listing') : [];
  let channelListings = Array.isArray(channel?.data) ? channel.data.filter((data) => data?.type === 'channel_listing') : [];



  return (
    <span className="mt-8 shadow-custom-dark border-[1px] rounded-xl border-[#ff8a00]">

      {playerListings && playerListings.map((playerListings, index) => {
        let videoId = playerListings.videoId;

        return (
          <section key={index}></section>
        )
      })}

      {videoListings && videoListings.map((videoListings, index) => (


        <section key={index} className='border-b-[1px] border-b-[#ff8a00] flex flex-col '>
          <span className='flex flex-col pt-2 pl-3'>
            <h2 className="responsive-text font-bold ">{videoListings?.title}</h2>
            <p className="responsive-paragraph text-gray-400 line-clamp-2">{videoListings?.subtitle}</p>
          </span>

          <span className="flex overflow-x-auto min-w-full scrollbar-hidden gap-2 md:gap-[50px] pt-5 pb-5 pr-4">
            {
              videoListings.data?.map((item, index) => (
             <VideoCard key={index} item={item} noAvatar={true}  />
              ))
            }
          </span>

        </section>
      ))}

      {channelListings && channelListings.map((channel, index) => {
        return (
          <section key={index} className='pt-4'>
            <p className='responsive-text pl-4 font-bold'>{channel?.title}</p>

            <span className='flex overflow-x-auto w-full scrollbar-hidden gap-4 pt-5 pb-10 px-4'>
              {
                channel?.data?.map((item, index) => (
                  <section key={index} className='flex flex-col min-w-[200px] h-[200px] items-center justify-center border-[1px] border-[#ff8a00] rounded-xl py-2' >
                    <Link href={`/channel/${item?.channelId}`} >
                      <section className=" flex flex-col items-start rounded-xl ">
                        <Avatar
                          onError={(e) => (e.target.src = item?.thumbnail[0]?.url)}
                          src={bestMatchLocator(item?.thumbnail, 'url')}
                          alt="abs"
                          className="w-[80px] h-[80px] mx-auto shadow-custom-dark object-cover rounded-full" />
                        <span className="flex flex-col px-2 w-[100%] gap-1 mt-1">
                          <p className="text-md line-clamp-1 font-semibold">{item?.title} </p>
                          <p className="text-xs line-clamp-1">{item?.subscriberCount} Subscribers</p>
                          <p className="text-xs line-clamp-1">{item?.videoCount} Videos</p>

                          <p className="text-xs line-clamp-2">{item?.description}</p>
                        </span>
                      </section>
                    </Link>
                   
                      <button
                        className={`w-[60%] bg-transparent border-[1px] border-[#ff8a00] hover:bg-[#ff880058] flex items-center justify-center  py-2 rounded-full`}>
                        <font className={`text-xs font-semibold`}>Subscribe</font>
                      </button>

                  </section>
                ))}
            </span>
          </section>
        )
      })}

       <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Page! <SentimentSatisfiedAlt /></font>
    </span>
  )
}
