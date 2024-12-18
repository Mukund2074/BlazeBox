'use client';
import React, { useState, useEffect } from 'react';
import { Check, ChevronLeft, Fullscreen, FullscreenExit, HighQuality, Language, Pause, PlayArrow, Settings, Speed, Subtitles, VolumeOff, VolumeUp } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import '@/app/globals.css';
import { useShortsPlayer } from '@/context/shorts/ShortsPlayerProvider';
// import { useShortsControls } from '@/context/shorts/ShortsControlsProvider';

export default function ShortsController({ triggerId }) {


    const {
        playerState, setPlayerState,
        controlState, setControlState,
        containerRef,
        getVideoRef, getAudioRef
    } = useShortsPlayer();

    const videoElement = getVideoRef(triggerId);
    const audioElement = getAudioRef(triggerId);

    const [volume, setVolume] = useState(1);
    const [previousVolume, setPreviousVolume] = useState();
    const [showvolumeControls, setShowVolumeControls] = useState(false);

    const [settingsMenu, setSettingsMenu] = useState(false);
    const [currentSpeed, setCurrentSpeed] = useState(1);

    const [qualityMenu, setQualityMenu] = useState(false);
    const [languageMenu, setLanguageMenu] = useState(false);
    const [playbackMenu, setPlaybackMenu] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'm':
                case 'M':
                    handleVolumeToggle();
                    break;
                case ' ':
                case (event.keyCode === 32 ? event.code : ' '):
                case 'P':
                case 'p':
                    handlePlayPause();
                    break;
                case 'f':
                case 'F':
                    handleFullscreenToggle();
                    break;
                default:
                    break;
            }
        };

        const handleVideoClick = () => {
            if (settingsMenu || qualityMenu || languageMenu || playbackMenu) {
                setSettingsMenu(false);
                setQualityMenu(false);
                setLanguageMenu(false);
                setPlaybackMenu(false);

            } else {
                handlePlayPause();
            }
        };

        videoElement?.addEventListener('click', handleVideoClick);
        videoElement?.addEventListener('dblclick', handleFullscreenToggle);

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            videoElement?.removeEventListener('click', handleVideoClick);
            videoElement?.removeEventListener('dblclick', handleFullscreenToggle);
        };
    });

    useEffect(() => {
        if (controlState.currentTime[triggerId] === controlState.maxTime[triggerId]) {
            videoElement.currentTime = 0;
            audioElement.currentTime = 0;
            setControlState((prevControlState) => ({
                ...prevControlState,
                currentTime: { ...prevControlState.currentTime, [triggerId]: 0 }
            }))
        }
    })

    function handleSubMenuToggle(menuName) {
        switch (menuName) {
            case 'quality':
                setQualityMenu(!qualityMenu);
                break;
            case 'language':
                setLanguageMenu(!languageMenu);
                break;
            case 'playback':
                setPlaybackMenu(!playbackMenu);
                break;
            default:
                break;
        }
        setSettingsMenu(true);
    }

    const changeVideoQuality = (itag) => {

        setPlayerState((prevState) => ({
            ...prevState,
            isVideoLoading: { ...prevState.isVideoLoading, [triggerId]: true },
        }))
        const currentVideoTime = videoElement.currentTime;

        setControlState((prevControlState) => ({
            ...prevControlState,
            currentTime: { ...prevControlState.currentTime, [triggerId]: currentVideoTime },
            selectedVideoQuality: { ...prevControlState.selectedVideoQuality, [triggerId]: itag },
        }))


        videoElement.pause();
        audioElement.pause();

        let newUrl = playerState.videoOptions[triggerId].find((format) => format?.itag === itag).url;

        setPlayerState((prevState) => ({
            ...prevState,
            videoUrl: { ...prevState.videoUrl, [triggerId]: newUrl },
        }))
        videoElement.src = newUrl;
        videoElement.load();

        videoElement.currentTime = currentVideoTime;
        audioElement.currentTime = currentVideoTime;

        setControlState((prevControlState) => ({
            ...prevControlState,
            videoReady: { ...prevControlState.videoReady, [triggerId]: false },
            audioReady: { ...prevControlState.audioReady, [triggerId]: false },
        }))

        const handleCanPlay = () => {
            if (videoElement.readyState >= 3 && audioElement.readyState >= 3) {

                setPlayerState((prevState) => ({
                    ...prevState,
                    isVideoLoading: { ...prevState.isVideoLoading, [triggerId]: false },
                }))

                setControlState((prevControlState) => ({
                    ...prevControlState,
                    videoReady: { ...prevControlState.videoReady, [triggerId]: true },
                    audioReady: { ...prevControlState.audioReady, [triggerId]: true },
                }))

                if (controlState.playing[triggerId]) {
                    videoElement.play();
                    audioElement.play();
                    setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [triggerId]: true },
                    }))
                }
            }
        };

        videoElement.oncanplay = handleCanPlay;
        audioElement.oncanplay = handleCanPlay;
    };

    const changeLanguage = (languageId) => {
        const currentAudioTime = audioElement.currentTime;

        audioElement.pause();
        videoElement.pause();

        let newLanguage = playerState.audioOptions[triggerId].find((format) => format?.audioTrack?.id === languageId);

        if (newLanguage && audioElement) {
            audioElement.src = newLanguage.url;
            setPlayerState((prevState) => ({
                ...prevState,
                audioUrl: { ...prevState.audioUrl, [triggerId]: newLanguage.url },
            }))
            setControlState((prevControlState) => ({
                ...prevControlState,
                selectedLanguage: { ...prevControlState.selectedLanguage, [triggerId]: newLanguage },
            }))
        }

        setControlState((prevControlState) => ({
            ...prevControlState,
            videoReady: { ...prevControlState.videoReady, [triggerId]: false },
            audioReady: { ...prevControlState.audioReady, [triggerId]: false },
            currentTime: { ...prevControlState.currentTime, [triggerId]: currentAudioTime },
        }))

        setPlayerState((prevState) => ({
            ...prevState,
            isVideoLoading: { ...prevState.isVideoLoading, [triggerId]: true },
        }))

        audioElement.load();
        videoElement.load();

        videoElement.currentTime = currentAudioTime;
        audioElement.currentTime = currentAudioTime;

        const handleCanPlay = () => {
            if (videoElement.readyState >= 3 && audioElement.readyState >= 3) {
                setPlayerState((prevState) => ({
                    ...prevState,
                    isVideoLoading: { ...prevState.isVideoLoading, [triggerId]: false },
                }))

                setControlState((prevControlState) => ({
                    ...prevControlState,
                    videoReady: { ...prevControlState.videoReady, [triggerId]: true },
                    audioReady: { ...prevControlState.audioReady, [triggerId]: true },
                }))


                if (controlState.playing[triggerId]) {
                    videoElement.play();
                    audioElement.play();
                     setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [triggerId]: true },
                    }))
                }
            }
        };

        videoElement.oncanplay = handleCanPlay;
        audioElement.oncanplay = handleCanPlay;
    };

    const handleSelectPlaybackSpeed = (speed) => {
        if (videoElement && audioElement) {
            setCurrentSpeed(speed);
            videoElement.playbackRate = speed;
            audioElement.playbackRate = speed;

            if (controlState.playing[triggerId]) {
                videoElement.play();
                audioElement.play();
                 setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [triggerId]: true },
                    }))
            }
        }
    };

    const handleVolumeToggle = () => {
        setPreviousVolume(volume);
        if (volume !== 0) {
            if (videoElement) videoElement.volume = 0;
            if (audioElement) audioElement.volume = 0;
            setVolume(0);
        } else {
            if (videoElement) videoElement.volume = previousVolume;
            if (audioElement) audioElement.volume = previousVolume;
            setVolume(previousVolume);
        }
    }

    const handlePlayPause = () => {
        if (controlState.playing[triggerId]) {
              setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [triggerId]: false },
                    }))
            videoElement.pause();
            audioElement.pause();
        } else {
            setControlState((prevControlState) => ({
                ...prevControlState,
                currentTime: { ...prevControlState.currentTime, [triggerId]: videoElement?.currentTime || 0 },
            }))
            handlePlayerReady();
        }
    };

    const handlePlayerReady = () => {
        if (controlState.videoReady[triggerId] && controlState.audioReady[triggerId]) {

            videoElement.currentTime = controlState.currentTime[triggerId] || 0;
            audioElement.currentTime = controlState.currentTime[triggerId] || 0;

             setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [triggerId]: true },
                    }))
            videoElement.play();
            audioElement.play();
        } else {
              setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [triggerId]: false },
                    }))
            videoElement.pause();
            audioElement.pause();
        }
    };

    const handleFullscreenToggle = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                setControlState((prevControlState) => ({
                    ...prevControlState,
                    fullscreen: false,
                }))
                document.exitFullscreen();
            } else {
                setControlState((prevControlState) => ({
                    ...prevControlState,
                    fullscreen: true,
                }))
                if (containerRef.current.requestFullscreen) {
                    containerRef.current.requestFullscreen();
                } else if (containerRef.current.webkitRequestFullscreen) {
                    containerRef.current.webkitRequestFullscreen();
                } else if (containerRef.current.mozRequestFullScreen) {
                    containerRef.current.mozRequestFullScreen();
                }
            }
        }
    };



    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);

        if (videoElement && audioElement) {
            videoElement.volume = newVolume;
            audioElement.volume = newVolume;
        }
    };

    const handleTimeChange = (event) => {

        
        // setPlayerState((prevState) => ({
        //     ...prevState,
        //     isVideoLoading: { ...prevState.isVideoLoading, [triggerId]: true },
        // }))
        
        const newTime = parseFloat(event.target.value);
       

        if (videoElement && audioElement) {

            videoElement.currentTime = newTime;
            audioElement.currentTime = newTime;
            setControlState((prevControlState) => ({
                ...prevControlState,
                currentTime: { ...prevControlState.currentTime, [triggerId]: newTime },
            }))
        }

        videoElement.oncanplay = () => {
            // setPlayerState((prevState) => ({
            //     ...prevState,
            //     isVideoLoading: { ...prevState.isVideoLoading, [triggerId]: false },
            // }))


            if (controlState.playing[triggerId]) {
                videoElement.play();
                audioElement.play();
                 setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [triggerId]: true },
                    }))
            }
        };
    };


    function toggleVolumeShow() {
        setShowVolumeControls(!showvolumeControls);
    }

    useEffect(() => {
        updateSliderBackground(controlState.currentTime[triggerId]);
    }, [controlState.currentTime[triggerId]]);

    useEffect(() => {
        updateSlider(volume);
    }, [volume]);

    const updateSlider = (value) => {
        let percentage = (value / 1) * 100;
        let rangeInput = document.querySelector('.new-renge-css');
        rangeInput.style.background = `linear-gradient(to right, #ffb03a ${percentage}%, #333 ${percentage}%)`
    }

    const updateSliderBackground = (currentTime) => {

        const percentage = (currentTime / controlState.maxTime[triggerId]) * 100;
        const rangeInput = document.querySelector('.prev-css');

        rangeInput.style.background = `linear-gradient(to right, #ffb03a ${percentage}%, #333 ${percentage}%)`;
    };

    return (

        <React.Fragment>

            <section className='absolute top-0 left-0 right-0 w-full gap-2 p-4 z-10  flex items-center'>

                <Tooltip title={controlState.playing[triggerId] ? 'Pause' : 'Play'} >
                    <button onClick={handlePlayPause} className="text-white flex justify-center items-center p-3 rounded-full bg-[#2a282882]">
                        {controlState.playing[triggerId] ? <Pause className="w-4 h-4 md:w-6 md:h-6" /> : <PlayArrow className="w-4 h-4 md:w-6 md:h-6" />}
                    </button>
                </Tooltip>



                <span id="shorts-control" className={`shorts-control flex items-center p-3 rounded-full bg-[#2a282882] group`}>
                    <button className="text-white flex justify-center items-center "
                        onClick={() => {
                            setPreviousVolume(volume);
                            if (volume !== 0) {
                                if (videoElement) videoElement.volume = 0;
                                if (audioElement) audioElement.volume = 0;
                                setVolume(0);
                            } else {
                                if (videoElement) videoElement.volume = previousVolume;
                                if (audioElement) audioElement.volume = previousVolume;
                                setVolume(previousVolume);
                            }
                        }}
                        onMouseEnter={toggleVolumeShow}
                        onMouseLeave={toggleVolumeShow}
                    >
                        {volume === 0 ? <VolumeOff className="w-4 h-4 md:w-6 md:h-6" /> : <VolumeUp className="w-4 h-4 md:w-6 md:h-6" />}
                    </button>

                    <span className="
                hidden
                        transition-all duration-300 ease-in-out justify-center items-center
                        px-1 rounded-lg gap-2 w-[120px]
                        md:rounded-xl  md:px-3 md:py-2
                        group-hover:flex ">

                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="transform max-w-[90%] new-renge-css"
                        />


                    </span>
                </span>


                <Tooltip title={'Fullscreen'}>
                    <button onClick={handleFullscreenToggle} className="ml-auto p-3 flex justify-center items-center rounded-full bg-[#2a282882]">
                        {controlState.fullscreen ? <FullscreenExit className="w-4 h-4 md:w-6 md:h-6" /> : <Fullscreen className="w-4 h-4 md:w-6 md:h-6" />}
                    </button>
                </Tooltip>

            </section>

            <button
                className='absolute bottom-4  z-10 right-2 text-white flex justify-center items-center p-3 rounded-full bg-[#2a282882]'
                onClick={() => {
                    setSettingsMenu(!settingsMenu);
                }}>
                <Settings className='w-4 h-4 md:w-6 md:h-6' />
            </button>


            <span className={`${controlState.fullscreen ? 'w-[100%]' : ''} shorts-control px-2  z-10 flex items-center gap-2 w-full absolute left-0 bottom-0 right-0 `}>

                <input
                    type="range"
                    min="0"
                    max={controlState.maxTime[triggerId]}
                    value={controlState.currentTime[triggerId]}
                    onChange={handleTimeChange}
                    className="prev-css w-full"
                />
            </span>


            {settingsMenu &&
                <ul className={`absolute  z-10 border-[1px] border-gray-500 rounded-xl bottom-[45px] md:bottom-[65px] backdrop-brightness-50 backdrop-blur right-2 overflow-y-scroll scrollbar-hidden p-2`}
                    style={{ maxHeight: `${videoElement.clientHeight * 0.7}px` }}>

                    <button
                        onClick={() => {
                            setSettingsMenu(false);
                            setTimeout(() => {
                                setQualityMenu(true);
                            }, 100);
                        }}
                        className="flex justify-start w-full mt-1 md:mt-2 px-2 md:px-8  items-center gap-2 text-white text-xs md:text-lg  rounded-md md:rounded-xl p-2 hover:backdrop-blur-xl " >
                        <HighQuality className="w-4 h-4 md:w-6 md:h-6" /> Quality
                    </button>

                    {playerState.audioOptions[triggerId] && playerState.audioOptions[triggerId][0]?.audioTrack?.id &&
                        <button
                            onClick={() => {
                                setSettingsMenu(false);
                                setTimeout(() => {
                                    setLanguageMenu(true);
                                }, 100);
                            }}
                            className="flex justify-start w-full mt-1 md:mt-2 px-2 md:px-8  items-center gap-2 text-white p-2 text-xs md:text-lg  rounded-md md:rounded-xl  hover:backdrop-blur-xl " >
                            <Language className="w-4 h-4 md:w-6 md:h-6" /> Language
                        </button>}

                    <button
                        onClick={() => {
                            setSettingsMenu(false);
                            setTimeout(() => {
                                setPlaybackMenu(true);
                            }, 100);
                        }}
                        className="flex justify-start w-full mt-1 md:mt-2 px-2 md:px-8  items-center gap-2 text-white p-2 text-xs md:text-lg  rounded-md md:rounded-xl  hover:backdrop-blur-xl " >
                        <Speed className="w-4 h-4 md:w-6 md:h-6" /> Speed
                    </button>

                    <button
                        // onClick={() => {
                        //     setSettingsMenu(false);
                        //     setTimeout(() => {
                        //         setQualityMenu(true);
                        //     }, 100);
                        // }}
                        className="flex justify-start w-full mt-1 md:mt-2 px-2 md:px-8  items-center gap-2 text-white p-2 text-xs md:text-lg  rounded-md md:rounded-xl  hover:backdrop-blur-xl " >
                        <Subtitles className="w-4 h-4 md:w-6 md:h-6" /> Captions
                    </button>
                </ul>}

            {qualityMenu &&
                <ul className={`absolute  z-10 border-[1px] border-gray-500 rounded-xl bottom-[45px] md:bottom-[65px] backdrop-brightness-50 backdrop-blur right-2 overflow-y-scroll scrollbar-hidden  p-2`}
                    style={{ maxHeight: `${videoElement?.clientHeight * 0.7}px` }}>
                    <button
                        onClick={() => { handleSubMenuToggle("quality"); }}
                        className='px-2 py-1 rounded-full flex items-center justify-start'>
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    {playerState.videoOptions[triggerId]?.map((option, index) => (
                        <li
                            key={index}
                            className="flex cursor-pointer w-full mt-1 md:mt-2 px-2 md:px-8  items-center juctify-center gap-2 text-white text-xs md:text-lg  rounded-md md:rounded-xl  hover:backdrop-blur-xl p-2 "
                            onClick={() => { changeVideoQuality(option?.itag), setQualityMenu(false); }}>
                            {option?.qualityLabel}
                            {option?.itag === controlState.selectedVideoQuality[triggerId] ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : ""}
                        </li>
                    ))}
                </ul>}

            {languageMenu &&
                <ul className={`absolute  z-10 border-[1px] border-gray-500 rounded-xl bottom-[45px] md:bottom-[65px] backdrop-brightness-50 backdrop-blur right-2 overflow-y-scroll scrollbar-hidden p-2`}
                    style={{ maxHeight: `${videoElement?.clientHeight * 0.7}px` }}>
                    <button
                        onClick={() => { handleSubMenuToggle("language"); }}
                        className='px-2 py-1 rounded-full flex items-center justify-start'>
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    {playerState.audioOptions[triggerId]?.map((option, index) => (
                        <li className="flex cursor-pointer w-full mt-1 md:mt-2 px-2 py-2 md:px-8  items-center gap-2 text-white p-2 text-xs md:text-lg  rounded-md md:rounded-xl  hover:backdrop-blur-xl "
                            key={index}
                            onClick={() => { changeLanguage(option?.audioTrack?.id), setLanguageMenu(false); }}>
                            {option?.audioTrack?.displayName}
                            {option?.audioTrack?.id === controlState.selectedLanguage[triggerId]?.audioTrack?.id ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : ""}
                        </li>
                    ))}
                </ul>}

            {playbackMenu &&
                <ul className={`absolute  z-10 w-[100px] md:w-[200px] border-[1px] border-gray-500 rounded-xl bottom-[45px] md:bottom-[65px] backdrop-brightness-50 backdrop-blur right-2 overflow-y-scroll scrollbar-hidden p-2`}
                    style={{ maxHeight: `${videoElement?.clientHeight * 0.7}px` }}>
                    <button
                        onClick={() => { handleSubMenuToggle("playback") }}
                        className='px-2 py-1 rounded-full flex items-center justify-start'>
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <li
                            key={speed}
                            className='flex cursor-pointer w-full mt-1 md:mt-2 px-2 py-2 md:px-8  items-center gap-2 text-white text-xs md:text-lg  rounded-md md:rounded-xl  hover:backdrop-blur-xl p-2'
                            onClick={() => { handleSelectPlaybackSpeed(speed), setPlaybackMenu(false); }}>
                            {speed}x
                            {currentSpeed === speed ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : ""}
                        </li>
                    ))}
                </ul>

            }
        </React.Fragment>
    );
}
