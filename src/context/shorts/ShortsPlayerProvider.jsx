'use client'
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import api from '../Api';
import { HttpStatusCode } from 'axios';
import { SequenceFetcher } from '../FetchingFunctions';

const ShortsPlayerContext = createContext();

export default function ShortsPlayerProvider({ children }) {

    const [shortsIdForNav, setShortsIdForNav] = useState('');
    // const [listOfIds, setListOfIds] = useState([]);

    const [playerState, setPlayerState] = useState({
        listOfIds: [],
        poster: {},
        shortsData: {},
        videoUrl: {},
        audioUrl: {},
        videoOptions: {},
        audioOptions: {},
        loading: {},
        error: {},
        isVideoLoading: {},
        initialType: {},
        sequence: {},
        sequenceContinuation: {},
        isEnd: {},
        playerRefresher: false,
        allSet: false
    });

    const [controlState, setControlState] = useState({
        fullscreen: false,
        maxTime: {},
        currentTime: {},
        selectedVideoQuality: {},
        selectedLanguage: {},
        videoReady: {},
        audioReady: {},
        controlRefresher: false,
        playing: {},
    });



    const videoRef = useRef({});
    const audioRef = useRef({});
    const containerRef = useRef({});
    const IndexRef = useRef({});

    // useEffect(() => {
    //     if (playerState.playerRefresher) {
    //         // Reset all playerState properties
    //         setPlayerState((prevState) => ({
    //             ...prevState,
    //             poster: {},
    //             shortsData: {},
    //             videoUrl: {},
    //             audioUrl: {},
    //             videoOptions: {},
    //             audioOptions: {},
    //             loading: {},
    //             error: {},
    //             isVideoLoading: {},
    //             initialType: {},
    //             sequence: {},
    //             sequenceContinuation: {},
    //             isEnd: {},
    //             playerRefresher: false,
    //         }));
    //     }
    // }, [playerState.playerRefresher]);

    // Fetch shorts data for a given ID


    const fetchSequence = async (id) => {
        try {
            if (!id) {
                console.error('Invalid ID');
                return;
            } else {

                SequenceFetcher({
                    shortsId: id,
                    setSequence: (sequence) => {
                        setPlayerState((prevState) => {
                            const newShort = [...[id], ...sequence];
                            return {
                                ...prevState,
                                listOfIds: [...new Set(newShort)],
                            }
                        })
                    },
                    setError: (error) =>
                        setPlayerState((prevState) => ({
                            ...prevState,
                            error: { ...prevState.error, [id]: error },
                        })),
                });

            }
        } catch (err) {
            setPlayerState((prevState) => ({
                ...prevState,
                error: { ...prevState.error, [id]: 'Failed to load sequence data' },
            }));
        } finally {
            setPlayerState((prevState) => ({
                ...prevState,
                isEnd: { ...prevState.isEnd, [id]: false },
            }));
        }
    };


    const fetchShortsData = async (id) => {
        try {
            setPlayerState((prevState) => ({
                ...prevState,
                isVideoLoading: { ...prevState.isVideoLoading, [id]: true },
            }));

            const response = await api.get(`dl?id=${id}`);
            if (response.status === HttpStatusCode.Ok && response.data) {
                setPlayerState((prevState) => ({
                    ...prevState,
                    shortsData: { ...prevState.shortsData, [id]: response.data },
                    initialType: { ...prevState.initialType, [id]: response.data.formats },
                    loading: { ...prevState.loading, [id]: false },
                }));

                const videoOptions = response.data.adaptiveFormats.filter((format) =>
                    format.mimeType.includes('avc1')
                );

                const audioOptions = response.data.adaptiveFormats.filter((format) =>
                    format.mimeType.includes('audio/mp4')
                );

                setPlayerState((prevState) => ({
                    ...prevState,
                    videoOptions: { ...prevState.videoOptions, [id]: videoOptions },
                    audioOptions: { ...prevState.audioOptions, [id]: audioOptions },
                    videoUrl: { ...prevState.videoUrl, [id]: videoOptions[3]?.url },
                    audioUrl: { ...prevState.audioUrl, [id]: audioOptions[0]?.url },
                }));

                setControlState((prevState) => ({
                    ...prevState,
                    selectedVideoQuality: { ...prevState.selectedVideoQuality, [id]: videoOptions[0] },
                    selectedLanguage: { ...prevState.selectedLanguage, [id]: audioOptions[0] },
                    maxTime: { ...prevState.maxTime, [id]: videoOptions[0]?.approxDurationMs },
                    videoReady: { ...prevState.videoReady, [id]: true },
                    audioReady: { ...prevState.audioReady, [id]: true },
                    currentTime: { ...prevState.currentTime, [id]: 0 },

                }));

                setTimeout(() => {
                    setPlayerState((prevState) => ({
                        ...prevState,
                        allSet: true
                    }))
                }, 3000);
            }
        } catch (err) {
            setPlayerState((prevState) => ({
                ...prevState,
                error: { ...prevState.error, [id]: 'Failed to load video data' },
                loading: { ...prevState.loading, [id]: false },
            }));
        } finally {
            setPlayerState((prevState) => ({
                ...prevState,
                isVideoLoading: { ...prevState.isVideoLoading, [id]: false },
            }));
        }
    };



    useEffect(() => {

        if (!playerState.listOfIds) {
            return;
        }
        playerState.listOfIds.slice(0, 5).forEach((id) => {
            fetchShortsData(id);
        });
    }, [playerState.listOfIds, shortsIdForNav]);

    useEffect(() => {
        if (shortsIdForNav) {
            fetchSequence(shortsIdForNav);
        }
    }, [shortsIdForNav]);


    const getVideoRef = (id) => videoRef.current[id];
    const getAudioRef = (id) => audioRef.current[id];
    const getContainerRef = (id) => containerRef.current[id];

    //create observer that checks if the indexref.current[annyId] element is in the viewport then it log that which video id is in the viewport and log the current id of the video that is in the viewport
    const [visibleCards, setVisibleCards] = useState([]);

    const handleIntersection = (entries) => {
    
        entries.forEach((entry) => {
            const ID = entry.target.id; // ID of the element currently intersecting
            const isInView = entry.isIntersecting;
    
            if (isInView) {
    
                // Check if the ID in the viewport matches the ID in IndexRef.current
                if (IndexRef.current[ID] && IndexRef.current[ID].id === ID) {
    
                    // Pause all videos
                    Object.keys(videoRef.current).forEach((videoId) => {
                        videoRef.current[videoId].pause();
                        audioRef.current[videoId].pause();
                    });
    
                    // Play the current video
                    videoRef.current[ID].play();
                    audioRef.current[ID].play();
    
                    // Optionally update the state to reflect that this video is playing
                    setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [ID]: true },
                    }));
                }
    
                // Add the ID to the visibleCards list if it's not already present
                if (!visibleCards.includes(ID)) {
                    setVisibleCards((prev) => [...prev, ID]);
                }
            } else {
                // Optionally, you can pause the video when it's not in view (if required)
                if (IndexRef.current[ID] && IndexRef.current[ID].id === ID) {
                    videoRef.current[ID].pause();
                    audioRef.current[ID].pause();
    
                    // Optionally update the state to reflect that the video is not playing
                    setControlState((prevControlState) => ({
                        ...prevControlState,
                        playing: { ...prevControlState.playing, [ID]: false },
                    }));
                }
            }
        });
    };
    


    useEffect(() => {
        const observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        });

        setTimeout(() => {


            playerState.listOfIds.slice(0, 5).forEach(id => {
                const element = IndexRef.current[id];
                if (element) {
                    observer.observe(element);
                }
            });
        }, 7000);

        return () => observer.disconnect();
    }, [visibleCards , playerState.listOfIds]);

    useEffect(() => {
        
    }, [IndexRef , playerState.listOfIds]);

    return (
        <ShortsPlayerContext.Provider value={{
            shortsIdForNav, setShortsIdForNav,
            playerState, setPlayerState,
            controlState, setControlState,
            videoRef,
            audioRef,
            containerRef,
            IndexRef,
            getVideoRef,
            getAudioRef,
            getContainerRef,
        }}>
            {children}
        </ShortsPlayerContext.Provider>
    );
}

export const useShortsPlayer = () => useContext(ShortsPlayerContext);
