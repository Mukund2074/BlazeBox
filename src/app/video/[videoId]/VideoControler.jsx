'use client';
import React, { useState, useEffect } from 'react';
import { Check, ChevronLeft, Fullscreen, FullscreenExit, HighQuality, Language, Pause, PlayArrow, Settings, Speed, Subtitles, VolumeOff, VolumeUp } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import '@/app/globals.css';

export default function VideoControler({
    videoRef,
    audioRef,
    containerRef,
    currentTime,
    setCurrentTime,
    maxTime,
    videoOptions,
    audioOptions,
    initialType,
    setIsVideoLoading,
    selectedVideoStream,
    videoReady,
    setVideoReady,
    audioReady,
    setAudioReady,
    selectedVideoQuality,
    setSelectedVideoQuality,
    selectedLanguage,
    setSelectedLanguage,
    fullscreen,
    setFullscreen
}) {

    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [previousVolume, setPreviousVolume] = useState();
    const [showvolumeControls, setShowVolumeControls] = useState(false);

    const [currentSpeed, setCurrentSpeed] = useState(1);
    const [settingsMenu, setSettingsMenu] = useState(false);

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
            if (settingsMenu) {
                setSettingsMenu(false);
                setQualityMenu(false);
                setLanguageMenu(false);
                setPlaybackMenu(false);

            } else {
                handlePlayPause();
            }
        };

        videoRef?.current?.addEventListener('click', handleVideoClick);
        videoRef?.current?.addEventListener('dblclick', handleFullscreenToggle);

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            videoRef?.current?.removeEventListener('click', handleVideoClick);
            videoRef?.current?.removeEventListener('dblclick', handleFullscreenToggle);
        };
    });
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

    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor((timeInSeconds % 3600) % 60);
        return `${hours ? `${hours}:` : ''}${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const changeVideoQuality = (itag) => {

        setIsVideoLoading(true);
        const currentVideoTime = videoRef.current.currentTime;

        setCurrentTime(currentVideoTime);
        setSelectedVideoQuality(itag);

        videoRef.current.pause();
        audioRef.current.pause();

        if (selectedVideoStream) {
            videoRef.current.src = selectedVideoStream.url;
            videoRef.current.load();
        }

        if (selectedLanguage) {
            audioRef.current.src = selectedLanguage.url ? selectedLanguage.url : audioOptions[0].url;
            audioRef.current.load();
        }


        videoRef.current.currentTime = currentVideoTime;
        audioRef.current.currentTime = currentVideoTime;

        setVideoReady(false);
        setAudioReady(false);

        const handleCanPlay = () => {
            if (videoRef.current.readyState >= 3 && audioRef.current.readyState >= 3) {
                setIsVideoLoading(false);
                setVideoReady(true);
                setAudioReady(true);

                if (playing) {
                    videoRef.current.play();
                    audioRef.current.play();
                    setPlaying(true);
                }
            }
        };

        videoRef.current.oncanplay = handleCanPlay;
        audioRef.current.oncanplay = handleCanPlay;
    };

    const changeLanguage = (languageId) => {
        const currentAudioTime = audioRef.current.currentTime;

        audioRef.current.pause();
        videoRef.current.pause();

        const newLanguage = audioOptions.find((format) => format?.audioTrack?.id === languageId);

        if (newLanguage && audioRef.current) {
            audioRef.current.src = newLanguage.url;
            setSelectedLanguage(newLanguage?.url ? newLanguage : initialType[0].mimeType);
        }

        setCurrentTime(currentAudioTime);
        setIsVideoLoading(true);
        setVideoReady(false);
        setAudioReady(false);

        audioRef.current.load();
        videoRef.current.load();

        videoRef.current.currentTime = currentAudioTime;
        audioRef.current.currentTime = currentAudioTime;

        const handleCanPlay = () => {
            if (videoRef.current.readyState >= 3 && audioRef.current.readyState >= 3) {
                setIsVideoLoading(false);
                setVideoReady(true);
                setAudioReady(true);

                if (playing) {
                    videoRef.current.play();
                    audioRef.current.play();
                    setPlaying(true);
                }
            }
        };

        videoRef.current.oncanplay = handleCanPlay;
        audioRef.current.oncanplay = handleCanPlay;
    };

    const handleSelectPlaybackSpeed = (speed) => {
        if (videoRef.current && audioRef.current) {
            setCurrentSpeed(speed);
            videoRef.current.playbackRate = speed;
            audioRef.current.playbackRate = speed;

            if (playing) {
                videoRef.current.play();
                audioRef.current.play();
                setPlaying(true);
            }
        }
    };

    const handleVolumeToggle = () => {
        setPreviousVolume(volume);
        if (volume !== 0) {
            if (videoRef.current) videoRef.current.volume = 0;
            if (audioRef.current) audioRef.current.volume = 0;
            setVolume(0);
        } else {
            if (videoRef.current) videoRef.current.volume = previousVolume;
            if (audioRef.current) audioRef.current.volume = previousVolume;
            setVolume(previousVolume);
        }
    }

    const handlePlayPause = () => {
        if (playing) {
            setPlaying(false);
            videoRef.current.pause();
            audioRef.current.pause();
        } else {
            setCurrentTime(videoRef.current.currentTime);
            handlePlayerReady();
        }
    };
    const handlePlayerReady = () => {
        if (videoReady && audioReady) {
            videoRef.current.currentTime = currentTime;
            audioRef.current.currentTime = currentTime;

            setPlaying(true);
            videoRef.current.play();
            audioRef.current.play();
        } else {
            setPlaying(false);
            videoRef.current.pause();
            audioRef.current.pause();
        }
    };

    const handleFullscreenToggle = () => {
        if (containerRef.current) {
            if (document.fullscreenElement) {
                setFullscreen(false);
                document.exitFullscreen();
                unlockOrientation(); // Unlock the orientation when exiting fullscreen
            } else {
                setFullscreen(true);
                if (containerRef.current.requestFullscreen) {
                    containerRef.current.requestFullscreen();
                } else if (containerRef.current.webkitRequestFullscreen) {
                    containerRef.current.webkitRequestFullscreen();
                } else if (containerRef.current.mozRequestFullScreen) {
                    containerRef.current.mozRequestFullScreen();
                }
                lockOrientation(); 
            }
        }
    };

    const lockOrientation = () => {
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(err => {
                console.log('Error locking orientation to landscape:', err);
            });
        }
    };

    const unlockOrientation = () => {
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    };

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);

        if (videoRef.current && audioRef.current) {
            videoRef.current.volume = newVolume;
            audioRef.current.volume = newVolume;
        }
    };

    const handleTimeChange = (event) => {
        setIsVideoLoading(true);

        const newTime = parseFloat(event.target.value);
        setCurrentTime(newTime);
        if (videoRef.current && audioRef.current) {
            videoRef.current.currentTime = newTime;
            audioRef.current.currentTime = newTime;
        }

        videoRef.current.oncanplay = () => {
            setIsVideoLoading(false);

            if (playing) {
                videoRef.current.play();
                audioRef.current.play();
                setPlaying(true);
            }
        };
    };

    // const handle10Secs = (type) => {
    //     let newTime = currentTime;

    //     if (type === 'back') {
    //         newTime = Math.max(currentTime - 10, 0);
    //     } else if (type === 'forward') {
    //         newTime = Math.min(currentTime + 10, maxTime); 
    //     }

    //     setIsVideoLoading(true);
    //     setCurrentTime(newTime);

    //     if (videoRef.current && audioRef.current) {
    //         videoRef.current.currentTime = newTime;
    //         audioRef.current.currentTime = newTime;
    //     }

    //     videoRef.current.oncanplay = () => {
    //         setIsVideoLoading(false);

    //         if (playing) {
    //             videoRef.current.play();
    //             audioRef.current.play();
    //             setPlaying(true);
    //         }
    //     };
    // };

    function toggleVolumeShow() {
        setShowVolumeControls(!showvolumeControls);
    }

    useEffect(() => {
        updateSliderBackground(currentTime);
    }, [currentTime]);

    useEffect(() => {
        updateSlider(volume);
    }, [volume]);

    const updateSlider = (value) => {
        let percentage = (value / 1) * 100;
        let rangeInput = document.querySelector('.new-renge-css');
        rangeInput.style.background = `linear-gradient(to right, #4caf50 ${percentage}%, #333 ${percentage}%)`
    }

    const updateSliderBackground = (currentTime) => {
        const percentage = (currentTime / maxTime) * 100;
        const rangeInput = document.querySelector('.prev-css');

        // Set the background with a linear gradient, completed part in green
        rangeInput.style.background = `linear-gradient(to right, #4caf50 ${percentage}%, #333 ${percentage}%)`;
    };

    return (

        <React.Fragment>

            <section id="controls" className={`${fullscreen ? 'fixed' : 'absolute'} 
            transition-all duration-300 ease-in-out 
            
            controls absolute bottom-0 left-0 right-0 bg-[#1b1a1a7c] w-full px-2 py-1 md:px-4 md:py-2 `}>


                <div className="relative w-full flex  items-center gap-2 rounded-md">


                    <Tooltip title={playing ? 'Pause' : 'Play'}>
                        <button onClick={handlePlayPause} className="text-white flex justify-center items-center p-3 rounded-full hover:bg-[#2a282882]">
                            {playing ? <Pause className="w-4 h-4 md:w-6 md:h-6" /> : <PlayArrow className="w-4 h-4 md:w-6 md:h-6" />}
                        </button>
                    </Tooltip>

                    <span className="relative group">
                        <button className="text-white flex justify-center items-center p-3 rounded-full hover:bg-[#2a282882]">
                            {volume === 0 ? <VolumeOff className="w-4 h-4 md:w-6 md:h-6" /> : <VolumeUp className="w-4 h-4 md:w-6 md:h-6" />}
                        </button>

                        <span className=" opacity-0
                        transition-opacity flex justify-center items-center absolute left-1/2 -translate-x-1/2  translate-y-[-100px] rotate-[270deg]
                        bg-[#1b1a1a] bg-opacity-50 
                        px-1 rounded-lg gap-2 w-[100px]
                        md:rounded-xl md:translate-y-[-200px] md:w-[200px] md:px-3 md:py-2
                        group-hover:opacity-100 ">

                            <button
                                onClick={() => {
                                    setPreviousVolume(volume);
                                    if (volume !== 0) {
                                        if (videoRef.current) videoRef.current.volume = 0;
                                        if (audioRef.current) audioRef.current.volume = 0;
                                        setVolume(0);
                                    } else {
                                        if (videoRef.current) videoRef.current.volume = previousVolume;
                                        if (audioRef.current) audioRef.current.volume = previousVolume;
                                        setVolume(previousVolume);
                                    }
                                }}
                                onMouseEnter={toggleVolumeShow}
                                onMouseLeave={toggleVolumeShow}
                                className="text-white flex justify-center items-center p-3 rounded-full hover:bg-[#2a282882]"
                            >
                                {volume === 0 ? <VolumeOff className="w-4 h-4 rotate-90 md:w-6 md:h-6" /> : <VolumeUp className="w-4 h-4 rotate-90 md:w-6 md:h-6" />}
                            </button>


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

                    <span className={`${fullscreen ? 'w-[100%]' : ''} flex items-center gap-2 w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] 2xl:w-[700px] `}>
                        <span className="flex gap-2">
                            <p>{formatTime(currentTime)}</p> / <p>{formatTime(maxTime)}</p>
                        </span>

                        <input
                            type="range"
                            min="0"
                            max={maxTime}
                            value={currentTime}
                            onChange={handleTimeChange}
                            className="prev-css w-full"
                        />
                    </span>

                    <Tooltip title={'Fullscreen'}>
                        <button onClick={handleFullscreenToggle} className="ml-auto p-3 flex justify-center items-center rounded-full hover:bg-[#2a282882]">
                            {fullscreen ? <FullscreenExit className="w-4 h-4 md:w-6 md:h-6" /> : <Fullscreen className="w-4 h-4 md:w-6 md:h-6" />}
                        </button>
                    </Tooltip>


                    <button
                        className='text-white flex justify-center items-center p-3 rounded-full hover:bg-[#2a282882]'
                        onClick={() => {
                            setSettingsMenu(!settingsMenu);
                        }}>
                        <Settings className='w-4 h-4 md:w-6 md:h-6' />
                    </button>
                </div>
            </section>

            {settingsMenu &&
                <ul className={`absolute border-[1px] border-gray-500 rounded-xl bottom-[45px] md:bottom-[65px] backdrop-brightness-50 backdrop-blur right-2 overflow-y-scroll scrollbar-hidden p-2`}
                    style={{ maxHeight: `${videoRef?.current?.clientHeight * 0.7}px` }}>

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

                    {audioOptions[0]?.audioTrack?.id &&
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
                <ul className={`absolute border-[1px] border-gray-500 rounded-xl bottom-[45px] md:bottom-[65px] backdrop-brightness-50 backdrop-blur right-2 overflow-y-scroll scrollbar-hidden  p-2`}
                    style={{ maxHeight: `${videoRef?.current?.clientHeight * 0.7}px` }}>
                    <button
                        onClick={() => { handleSubMenuToggle("quality"); }}
                        className='px-2 py-1 rounded-full flex items-center justify-start'>
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    {videoOptions?.map((option, index) => (
                        <li
                            key={index}
                            className="flex cursor-pointer w-full mt-1 md:mt-2 px-2 md:px-8  items-center juctify-center gap-2 text-white text-xs md:text-lg  rounded-md md:rounded-xl  hover:backdrop-blur-xl p-2 "
                            onClick={() => { changeVideoQuality(option?.itag), setQualityMenu(false); }}>
                            {option?.qualityLabel}
                            {option?.itag === selectedVideoQuality ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : ""}
                        </li>
                    ))}
                </ul>}

            {languageMenu &&
                <ul className={`absolute border-[1px] border-gray-500 rounded-xl bottom-[45px] md:bottom-[65px] backdrop-brightness-50 backdrop-blur right-2 overflow-y-scroll scrollbar-hidden p-2`}
                    style={{ maxHeight: `${videoRef?.current?.clientHeight * 0.7}px` }}>
                    <button
                        onClick={() => { handleSubMenuToggle("language"); }}
                        className='px-2 py-1 rounded-full flex items-center justify-start'>
                        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    {audioOptions?.map((option, index) => (
                        <li className="flex cursor-pointer w-full mt-1 md:mt-2 px-2 py-2 md:px-8  items-center gap-2 text-white p-2 text-xs md:text-lg  rounded-md md:rounded-xl  hover:backdrop-blur-xl "
                            key={index}
                            onClick={() => { changeLanguage(option?.audioTrack?.id), setLanguageMenu(false); }}>
                            {option?.audioTrack?.displayName}
                            {option?.audioTrack?.id === selectedLanguage?.audioTrack?.id ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : ""}
                        </li>
                    ))}
                </ul>}

            {playbackMenu &&
                <ul className={`absolute w-[100px] md:w-[200px] border-[1px] border-gray-500 rounded-xl bottom-[45px] md:bottom-[65px] backdrop-brightness-50 backdrop-blur right-2 overflow-y-scroll scrollbar-hidden p-2`}
                    style={{ maxHeight: `${videoRef?.current?.clientHeight * 0.7}px` }}>
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
