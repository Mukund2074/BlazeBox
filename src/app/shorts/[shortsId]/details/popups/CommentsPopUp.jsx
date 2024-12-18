import { CloseRounded } from '@mui/icons-material'
import React from 'react'
import ShortsComments from '../ShortsComments'
import { useShortsPlayer } from '@/context/shorts/ShortsPlayerProvider';

export default function CommentsPopUp({
    handleShowComments,
    showComments,
    ShortsDetails,
    triggerId,
    setError
}) {

      const { getVideoRef } = useShortsPlayer();
        const videoElement = getVideoRef(triggerId);
    return (
        <section id='detail-comments-modal' className={`transition-all duration-500 ease-in-out absolute z-30 flex flex-col items-center bottom-0 left-0 right-0 bg-gradient-to-tl from-[#191a1a] via-[#040408] to-[#48484e] rounded-t-xl w-[100%] h-[100%] `}
            style={showComments ? { maxHeight: `${videoElement?.clientHeight * 0.8}px` } : { maxHeight: `0px` }}>

            <span className='relative flex items-center justify-center w-1/2 h-[5px] rounded-full bg-[#767676]' />
            <span className='w-full items-center flex'>

                <h2 className='font-bold text-lg mt-2 mx-auto underline-offset-2 underline' > Comments</h2>

            </span>
            <button onClick={handleShowComments} className='absolute top-2 right-2 rounded-full p-1 border-[1px] border-slate-500 ml-auto'>
                <CloseRounded className='w-6 h-6' />
            </button>

            
            <span className='w-full  rounded-full border-[1px] mt-2 border-slate-500' />

            {ShortsDetails?.isCommentDisabled ?
                <section className='w-full h-full flex flex-col items-center justify-center'>
                    <font className="text-sm font-semibold text-center">Sorry, this creator has disabled comments</font>
                </section>
                :
                <section id='comments' className='w-full h-full overflow-y-scroll '>
                    {triggerId && <ShortsComments triggerId={triggerId} setError={setError} />}
                </section>
            }


        </section>
    )
}
