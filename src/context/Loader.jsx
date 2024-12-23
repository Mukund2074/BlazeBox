'use client';
import React from 'react';
import { Skeleton } from '@mui/material';

const SkeletonLoader = ({ count = 1, noGrid = false }) => (
    <span className={`${!noGrid ? '' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-4'}`}>
        {Array.from({ length: count }).map((_, index) => (
            <aside key={index} className="hover:shadow flex flex-col  border-gray-800 rounded-tl-3xl rounded-br-3xl ">
                <Skeleton variant="rect" width="100%" height={180} className="rounded-tl-3xl  bg-gray-800" />
                <span className="text-xs mt-[-25px] px-2 py-1 rounded self-end items-center justify-center ">
                    <Skeleton width="50%" height={20} />
                </span>
                <span className="p-2 flex gap-2 mt-2 bg-transparent rounded-b-xl">
                    <Skeleton variant="circle" width={40} height={40} className="bg-gray-800 rounded-full" />
                    <span className="flex flex-col w-full">
                        <Skeleton width="80%" height={20} className='bg-gray-800' />
                        <Skeleton width="60%" height={15} className='bg-gray-800' />
                        <Skeleton width="40%" height={15} className='bg-gray-800' />
                    </span>
                </span>
            </aside>
        ))}
    </span>
);

export const ShortsLoader = ({ count = 10, singleMain = false }) => {
    if (!singleMain) {

        return (
            <span className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
                {Array.from({ length: count }).map((_, index) => (
                    <aside key={index} className="hover:shadow-md flex flex-col  border-gray-800 rounded-tl-3xl rounded-br-3xl">
                        <Skeleton variant="rect" width="100%" height={280} className="rounded-tl-3xl  bg-gray-800" />
                        <span className="p-2 flex gap-2 mt-2 bg-transparent rounded-b-xl">
                            <span className="flex flex-col w-full">
                                <Skeleton width="80%" height={20} className='bg-gray-800' />
                                <Skeleton width="60%" height={15} className='bg-gray-800' />
                                <Skeleton width="40%" height={15} className='bg-gray-800' />
                            </span>
                        </span>
                    </aside>
                ))}
            </span>
        );
    } else {
        return (
            <main className='flex flex-col gap-4 items-center justify-center w-full'>
                <span className="hover:shadow-md flex p-4 flex-col w-full h-[600px] items-center justify-center rounded-3xl ">
                    <Skeleton variant="rect" width="300px" height={600} className="rounded-3xl bg-gray-800" />
                </span>
            </main>
        )
    }
}

export const MainVideoLoader = () => {
    return (
        <main className='flex flex-row gap-1 p-4 w-full'>

            <span className="hover:shadow-md flex flex-col w-full h-[600px] border-gray-800 rounded-3xl overflow-hidden">
                <Skeleton variant="rect" width="100%" height={600} className="rounded-tl-3xl  bg-gray-800" />
                <span className="p-2 flex gap-2 mt-2 bg-transparent rounded-b-xl">
                    <span className="flex flex-col w-full">
                        <Skeleton width="80%" height={20} className='bg-gray-800' />
                        <Skeleton width="60%" height={15} className='bg-gray-800' />
                        <Skeleton width="40%" height={15} className='bg-gray-800' />
                    </span>
                </span>
            </span>



        </main>
    )
}

export const CommunityLoader = ({ count = 10 }) => {
    return (
        <span className='flex flex-col gap-4 '>
            {Array.from({ length: count }).map((_, index) => (
                <main
                    key={index}
                    className="flex p-4 w-full mx-auto md:w-[50%] gap-4  rounded-tl-3xl rounded-br-3xl shadow-custom-dark"
                >
                    <Skeleton variant="circular" className={`bg-gray-600`} width={50} height={50}>
                    </Skeleton>

                    <section className="flex flex-col w-full">
                        <h2 className="text-lg font-semibold flex items-center gap-3">
                            <Skeleton className={`bg-gray-600`} width="40%" height={15} />
                            <Skeleton className={`bg-gray-600`} width="30%" height={15} />
                        </h2>

                        <Skeleton className={`bg-gray-600`} width="60%" height={20} />


                        {index % 2 === 0 ?
                            <span className='flex flex-col pr-32 mt-2 gap-4'>
                                {Array.from({ length: 4 }).map((_, index) => (

                                    <Skeleton key={index} variant="rectangular" className={`bg-gray-600 rounded-xl`} width="100%" height={30} />
                                ))}
                            </span>
                            :
                            <Skeleton className={`bg-gray-600 rounded-tl-3xl rounded-br-3xl mt-4 `} variant="rectangular" width="65%" height={280} />
                        }
                        <span className="flex items-center gap-4 ">
                            <Skeleton className={`bg-gray-500`} width={60} height={60} />
                            <Skeleton className={`bg-gray-500`} width={60} height={60} />
                            <Skeleton className={`bg-gray-500`} width={60} height={60} />
                        </span>
                    </section>
                </main>
            ))}
        </span>
    );
}



export const ChannelLoader = () => {

    return (
        <React.Fragment>
            <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="80%" height={200} />
            <section className="flex flex-col w-full md:flex-row mt-4 md:mt-0 gap-4 md:p-10 items-center md:items-start ">

                <Skeleton className={`bg-gray-500`} variant="circular" width={250} height={250} />

                <span className='flex flex-col w-full gap-2 items-center md:items-start justify-center '>
                    <Skeleton className={`bg-gray-500 `} width="60%" height={80} />
                    <Skeleton className={`bg-gray-500 mt-4`} width="60%" height={20} />
                    <Skeleton className={`bg-gray-500 `} width="60%" height={20} />
                    <Skeleton className={`bg-gray-500`} width="60%" height={20} />
                    <Skeleton className={`bg-gray-500`} width="60%" height={20} />
                </span>
            </section>



            <section className="sticky z-30 top-20 p-4 backdrop-blur-lg bg-[#282727f7] rounded-lg border-t-[1px] border-[#ff8a00] backdrop-opacity-15 mt-8 md:mt-0 md:px-14 flex gap-8 items-center overflow-y-scroll scrollbar-hidden">
                <Skeleton className={`bg-gray-500`} width="10%" height={40} />
                <Skeleton className={`bg-gray-500`} width="10%" height={40} />
                <Skeleton className={`bg-gray-500`} width="10%" height={40} />
                <Skeleton className={`bg-gray-500`} width="10%" height={40} />
                <Skeleton className={`bg-gray-500`} width="10%" height={40} />
            </section>

            <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4 p-4' >
                <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="100%" height={200} />
                <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="100%" height={200} />
                <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="100%" height={200} />
                <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="100%" height={200} />
                <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="100%" height={200} />
                <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="100%" height={200} />
                <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="100%" height={200} />
                <Skeleton className={`bg-gray-500 rounded-xl mx-auto mt-4`} variant="rectangular" width="100%" height={200} />
            </section>

        </React.Fragment>
    );
};


export default SkeletonLoader;