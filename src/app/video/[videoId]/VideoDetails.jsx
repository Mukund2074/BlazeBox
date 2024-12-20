'use client'
import React, { useRef, useState } from 'react'
import { bestMatchLocator } from '@/context/MultiContentRender';
import { DangerousRounded, Download, Share, ThumbDownOutlined, ThumbUpOutlined, Verified } from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import Link from 'next/link';


export default function VideoDetails({ videoData, channel, toggleShare , initialType  }) {

  const [collapsed, setIsCollapsed] = useState(true);
  const topRef = useRef(null);

  const toggleDownload = () => {
    // start download from initialType[0].url
    
    

  }



  return (
    <section id='details' className='w-full p-4 mt-2'>

      {/* {videoData?.storyboards.map((item,index) => {
    console.log(item.url[0]);

    return (
      <div key={index}>
        </div>
    )
   })} */}

      {/* {console.log("hello" , bestMatchLocator(videoData?.storyboards , 'url'))}
  <img src={bestMatchLocator(videoData?.storyboards , 'url')[2]} alt="hello"
   className='w-full h-full' 
   /> */}

      <h1 ref={topRef} className='responsive-text font-bold'>{videoData?.title}</h1>

      <section id='channel' className='flex items-center flex-col md:flex-row py-4 md:border-b-[1px] md:border-b-[#ff8a00] '>



        <Link href={`/channel/${channel?.meta?.channelHandle}`}
          className='flex w-auto items-center mr-auto'>
          <span className='flex items-center'>
            <Avatar
              src={bestMatchLocator(channel?.meta?.avatar, 'url')}
              className='w-12 h-12'
            />
          </span>
          <span className='responsive-text font-bold ml-2 flex flex-col w-full  md:min-w-[200px]'>
            <font>{videoData?.channelTitle}
              <Verified className='text-[#ff8a00] ml-2' />
            </font>
            {channel?.meta?.subscriberCount && <font className='text-sm text-gray-400 flex flex-row'>{channel?.meta?.subscriberCountText} Subscribers</font>}
          </span>

        </Link>



        <Tooltip
          title={
            <span className='flex flex-col  bg-[#1b1b1a] p-2 border-[1px] border-[#ff8a00] rounded-lg'>
              <font className='text-red-500 text-sm justify-center flex-1 items-center'>
                <DangerousRounded className='w-6 h-6' />
                <br />Subscribe will not work  Officially .. <br /> This is demo version </font>
            </span>
          }>
          <button
            className={`ml-auto md:ml-8 w-full md:w-[300px] bg-transparent border-[1px] border-[#ff8a00] hover:bg-[#ff880058] rounded-full overflow-hidden  mt-2  text-white p-2 `}>
            Subscribe
          </button>
        </Tooltip>



        <span className='p-2 rounded-lg w-full flex items-center justify-between mt-4 md:mt-0 gap-4' >

          <Tooltip title="Like" > <ThumbUpOutlined className='w-6  h-6 md:ml-auto cursor-pointer ' /> </Tooltip>

          <Tooltip title="Dislike"><ThumbDownOutlined className='w-6  h-6 cursor-pointer' /></Tooltip>

          <Tooltip title="Share"> <Share onClick={() => { toggleShare() }} className='w-6  h-6 cursor-pointer' /> </Tooltip>

          <a href={initialType[0].url} download={initialType[0].url} > <Tooltip title="Download"> <Download  className='w-6 h-6 cursor-pointer' /> </Tooltip></a>

        </span>

      </section>


      <section id='description' className='border-[1px] border-[#ff8a00] p-2 rounded-lg mt-2' >
        <div className={`${collapsed ? 'max-h-[50px]' : ' max-h-[1000px] opacity-100 oveflow-y-scroll scrollbar-hidden'} overflow-hidden
      transition-all duration-500 ease-in-out `}>
          <font className='text-gray-500'>
            {videoData?.publishDate
              ? new Date(videoData.publishDate).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
              })
              : ""}
          </font>

          <div
            className='w-full responsive-paragraph'
            dangerouslySetInnerHTML={{
              __html: videoData?.description
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
        </div>
        <button
          className='text-blue-200 hover:text-blue-500 hover:underline text-sm'
          onClick={() => { setIsCollapsed(!collapsed), window.scrollTo({ top: topRef.current.offsetTop, behavior: 'smooth' }) }}>
          {collapsed ? '...View more description' : '...Hide description'}
        </button>

      </section>
    </section>
  )
}
