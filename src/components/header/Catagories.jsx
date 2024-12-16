'use client'
import React from 'react'
import Link from 'next/link'
import '@/app/globals.css'
import { ChevronRightTwoTone, Home, TrendingUpOutlined, VideoCameraBack, VideoLibrarySharp } from '@mui/icons-material'


export default function Catagories({ toggleCategories }) {

    const Catagories = [
        { id: 1, name: 'Home', to: '/home' , icon: <Home />},
        { id: 2, name: 'Trending', to: '/trending' , icon : <TrendingUpOutlined /> },
    ]
    return (
        <span className='w-full items-start bg-gradient-to-b border-b-[3px] border-[#ffb03a] shadow-custom-dark  from-[#1b1a1a]  via-[#1c0c12] to-[#130619]  gap-8 flex flex-row  py-4 px-4 overflow-x-scroll scrollbar-hidden '>
            <button className='hover:transform hover:translate-y-[-5px] px-6 py-2  rounded-lg hover:transition hover:ease-in-out hover:duration-300 shadow-custom-dark border-t-[1px] border-b-[1px] border-[#ff8a00] '
                onClick={toggleCategories}
            >
                <ChevronRightTwoTone />
            </button>

            {Catagories.map((catagory) => (
                <Link key={catagory.id} href={catagory.to} className='flex items-center flex-row gap-2 hover:transform hover:translate-y-[-5px] px-6 py-2 w-64 text-center rounded-lg hover:transition hover:ease-in-out hover:duration-300 shadow-custom-dark border-t-[1px]  border-b-[1px] border-[#ff8a00]'>
                  {catagory.icon}  {catagory.name}
                </Link>
            ))}
        </span>


    )
}
