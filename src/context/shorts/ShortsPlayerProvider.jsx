'use client'
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import api from '../Api';
import { HttpStatusCode } from 'axios';
import { SequenceFetcher } from '../FetchingFunctions';

const ShortsPlayerContext = createContext();

export default function ShortsPlayerProvider({ children }) {

    const [firstId, setFirstId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [poster, setPoster] = useState(null);
    const [shortsData, setShortsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [initialType, setInitialType] = useState();



    const [sequence, setSequence] = useState([]);
    const [sequenceContinuation, setSequenceContinuation] = useState('');
    const [isEnd, setIsEnd] = useState(false);


    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const containerRef = useRef(null);
    const IndexRef = useRef([]);


    const [videoUrl, setVideoUrl] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);

    const [playerRefresher, setPlayerRefresher] = useState(false);


    useEffect(() => {
        if (playerRefresher) {

            setFirstId(null);

            setPoster(null);
            setShortsData(null);
            setLoading(true);
            setError(null);
            setIsVideoLoading(true);
            setInitialType(null);

            videoRef.current = null;
            audioRef.current = null;
            containerRef.current = null;

            setVideoUrl(null);
            setAudioUrl(null);

        }
        setPlayerRefresher(false);
    }, [playerRefresher])


    useEffect(() => {
        const fetchshortsData = async () => {
            try {
                if (firstId) {
                    setIsVideoLoading(true);
                    const response = await api.get(`dl?id=${firstId}`);
                    if (response.status === HttpStatusCode.Ok && response.data) {
                        setShortsData(response.data);
                        setInitialType(response.data.formats);
                        setLoading(false);
                    }
                }
            } catch (err) {
                setError('Failed to load video data');
                setLoading(false);
            } finally {
                setIsVideoLoading(false);
            }
        };
        fetchshortsData();
    }, [firstId]);

    useEffect(() => {
        const fetchSequence = async () => {
            try {
                if(firstId !== undefined && firstId !== null && isEnd){
                    SequenceFetcher({
                        firstId,
                        setSequence,
                        setError
                    })
                }
            } catch (err) {
                setError('Failed to load video data');
            } finally {
                setIsEnd(false);
            }
        }
        fetchSequence();
    }, [firstId , isEnd])



    const videoOptions = shortsData?.adaptiveFormats?.filter((format) =>
        format?.mimeType?.includes('avc1')
    );
    const audioOptions = shortsData?.adaptiveFormats?.filter((format) =>
        format?.mimeType?.includes('audio/mp4')
    );


    return (
        <ShortsPlayerContext.Provider value={{
            videoUrl, setVideoUrl,
            audioUrl, setAudioUrl,
            poster, setPoster,
            loading, setLoading,
            error, setError,
            isVideoLoading, setIsVideoLoading,
            sequence, setSequence,
            sequenceContinuation, setSequenceContinuation,
            isEnd, setIsEnd,
            currentIndex, setCurrentIndex,

            videoOptions, audioOptions,
            videoRef, audioRef, containerRef,
            shortsData,
            setFirstId,
            initialType,
            setPlayerRefresher,
        }}>
            {children}
        </ShortsPlayerContext.Provider>
    )
}

export const useShortsPlayer = () => useContext(ShortsPlayerContext);
