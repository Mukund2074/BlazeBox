'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';

const shortsControlsContext = createContext();

export default function ShortsControlProvider({ children }) {

    const [fullscreen, setFullscreen] = useState(false);


    const [maxTime, setMaxTime] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [selectedVideoQuality, setSelectedVideoQuality] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const [videoReady, setVideoReady] = useState(false);
    const [audioReady, setAudioReady] = useState(false);


  

    const [controlRefresher, setControlRefresher] = useState(false);

    useEffect(() => {
        if (controlRefresher) {
            setFullscreen(false);
            setMaxTime(0);
            setCurrentTime(0);
            setSelectedVideoQuality(null);
            setSelectedLanguage(null);
            setVideoReady(false);
            setAudioReady(false);
            
        }
        setTimeout(() => {
            setControlRefresher(false);
        }, 50);
    }, [controlRefresher]);

    return (
        <shortsControlsContext.Provider value={{
            fullscreen, setFullscreen,
            maxTime, setMaxTime,
            currentTime, setCurrentTime,
            selectedVideoQuality, setSelectedVideoQuality,
            selectedLanguage, setSelectedLanguage,
            videoReady, setVideoReady,
            audioReady, setAudioReady,
       

            
            setControlRefresher
        }}>
            {children}
        </shortsControlsContext.Provider>
    );
}

export function useShortsControls() {
    return useContext(shortsControlsContext);
}