'use client';
import { ShortsLoader } from '@/context/Loader';
import { useShortsPlayer } from '@/context/shorts/ShortsPlayerProvider';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react'
import ShortsController from './ShortsController';
import ShortsDetail from './details/ShortsDetail';

export default function Shorts() {

    const { shortsId } = useParams();
    const {
        setShortsIdForNav,
        playerState, setPlayerState,
        controlState, setControlState,
        videoRef,
        audioRef,
        containerRef,
        IndexRef,
    } = useShortsPlayer();

    useEffect(() => {
        if (shortsId) {
            setShortsIdForNav(shortsId);
        }
    }, [shortsId, setShortsIdForNav]);

    useEffect(() => {
        setPlayerState((prevState) => ({
            ...prevState,
            playerRefresher: true
        }))
    }, [])

    if (!playerState.allSet) {
        return (
            <ShortsLoader count={1} singleMain={true} />
        )
    }


    if (playerState.allSet) {
        const handleTimeUpdate = (id) => {
            setControlState((prevControlState) => ({
                ...prevControlState,
                currentTime: { ...prevControlState.currentTime, [id]: videoRef.current[id].currentTime },
            }))
        };

        return (
            <main id='main-section' ref={containerRef} className={` ${controlState.fullscreen ? 'py-0' : 'py-4'} w-full flex flex-col items-center justify-center gap-2`}>
                <section className={`flex flex-col items-center max-h-[100dvh] snap-y snap-mandatory overflow-y-scroll gap-10 pb-28 scrollbar-hidden ${controlState.fullscreen ? 'min-h-[100dvh]' : 'min-h-[90dvh] py-4'}`}>
                    {
                        playerState && playerState.listOfIds.slice(0, playerState.currentCount).map((item, index) => {

                            if (playerState.videoOptions[item] && playerState.videoOptions[item].length > 0) {
                                return (
                                    <section
                                        key={index}
                                        id={item}
                                        ref={(el) => IndexRef.current[item] = el}
                                        className={`relative mx-auto max-w-[400px] w-full snap-start snap-always overflow-hidden rounded-xl ${controlState.fullscreen ? 'min-h-[99dvh] max-h-[99dvh]' : 'min-h-[85dvh] max-h-[85dvh]'} `}
                                    >

                                        <video
                                            ref={(el) => videoRef.current[item] = el}
                                            className={`w-full  ${controlState.fullscreen ? 'h-[100dvh]' : 'h-[90dvh]'}  rounded-xl`}
                                            id={`${item}`}
                                            onCanPlay={() => {
                                                setControlState((prevControlState) => ({
                                                    ...prevControlState,
                                                    videoReady: { ...prevControlState.videoReady, [item]: true },
                                                }))
                                            }}
                                            onLoadedMetadata={() => {
                                                setControlState((prevControlState) => ({
                                                    ...prevControlState,
                                                    maxTime: { ...prevControlState.maxTime, [item]: videoRef.current[item].duration },
                                                    setup: true
                                                }))
                                            }}
                                            onTimeUpdate={() => handleTimeUpdate(item)}
                                        >
                                            <source src={`${playerState.videoUrl[item]}`} type="video/mp4" />
                                            Your browser does not support the video tag.

                                        </video>

                                        <audio
                                            ref={(el) => audioRef.current[item] = el}
                                            id={`${item}`}
                                            className={`w-full h-full  rounded-xl`}
                                            onCanPlay={() => {
                                                setControlState((prevControlState) => ({
                                                    ...prevControlState,
                                                    audioReady: { ...prevControlState.audioReady, [item]: true },
                                                }))
                                            }}
                                        >
                                            <source src={playerState.audioUrl[item]} type="audio/mpeg" />
                                            Your browser does not support the audio tag.
                                        </audio>

                                        {playerState.isVideoLoading[item] && (
                                            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center">
                                                <div className="w-16 h-16 border-4 border-t-4 border-t-[#FF8A00] border-transparent rounded-full animate-spin "></div>
                                            </div>
                                        )}

                                        <ShortsController triggerId={item} />

                                        <ShortsDetail triggerId={item} />


                                    </section>
                                );

                            }
                        })}

                    <p className='text-gray-400 responsive-text'> Only limited Shorts are available in this version </p>
                </section>
            </main>
        )
    }
}
