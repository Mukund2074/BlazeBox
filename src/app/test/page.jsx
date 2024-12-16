'use client';
import api from '@/context/Api';
import { HttpStatusCode } from 'axios';
import React, { useEffect, useRef, useState } from 'react';

// List of dynamic IDs
const cardIds = [
    'YyNz4--6fro',
    '0yg5467Jem4',
    'AydS-vA3qa4',
];

const DynamicCards = () => {
    const [visibleCards, setVisibleCards] = useState([]);
    const divref = useRef(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [cardImages, setCardImages] = useState({});
    const [urls, setUrls] = useState({});

    const cardRefs = useRef([]);

    const handleIntersection = (entries) => {
        entries.forEach((entry) => {
            const cardIndex = cardRefs.current.indexOf(entry.target);
            if (entry.isIntersecting && cardIndex >= 0) {
                // console.log(`Card ${cardIndex + 1} with ID ${cardIds[cardIndex]} is in the current view`);
                api.get(`dl?id=${cardIds[cardIndex]}`).then((response) => {
                    if (response.status === HttpStatusCode.Ok && response.data) {
                        const videoUrl = response?.data?.formats[0]?.url;
                        // console.log('Video URL:', videoUrl); // Check the URL in the console
                        if (videoUrl) {
                            setUrls((prevUrls) => ({
                                ...prevUrls,
                                [cardIds[cardIndex]]: videoUrl,
                            }));
                        }
                        setCardImages((prevImages) => ({
                            ...prevImages,
                            [cardIds[cardIndex]]: response?.data?.thumbnail ? response?.data?.thumbnail[0]?.url : '/not-found.png',
                        }));
                    }
                });
                if (!visibleCards.includes(cardIndex)) {
                    setVisibleCards((prev) => [...prev, cardIndex]);
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

        cardRefs.current.forEach((card) => observer.observe(card));

        return () => observer.disconnect();
    }, [visibleCards]);

    const handleFullscreenToggle = () => {
        if (divref.current) {
            if (document.fullscreenElement) {
                setFullscreen(false);
                document.exitFullscreen();
            } else {
                setFullscreen(true);
                if (divref.current.requestFullscreen) {
                    divref.current.requestFullscreen();
                } else if (divref.current.webkitRequestFullscreen) {
                    divref.current.webkitRequestFullscreen();
                } else if (divref.current.mozRequestFullScreen) {
                    divref.current.mozRequestFullScreen();
                }
            }
        }
    };



    return (
        <ul ref={divref} className={`flex flex-col items-center gap-4 ${fullscreen ? 'h-screen' : 'h-[600px]'}  overflow-hidden overflow-y-scroll snap-y snap-mandatory snap-always`}>
            {cardIds.map((id, index) => (
                <li
                    key={id}
                    ref={(el) => {
                        cardRefs.current[index] = el;
                    }}
                    className={`relative ${fullscreen ? 'min-h-[100dvh]' : 'min-h-[75dvh]'} w-[400px] rounded-lg p-4 snap-always snap-start shadow-lg bg-cover bg-center`}

                >


                    {urls[id] ? (
                        <video controls  className={`w-full h-[400px] rounded-xl border-4 border-blue-500`}>
                            <source src={urls[id]} type="video/mp4" />
                            Your browser does not support the video element.
                        </video>
                    ) : (
                        <div>Loading...</div>
                    )}


                    <img src={cardImages[id]} onError={(e) => { e.target.src = '/not-found.png' }} alt="/not found.png" />
                    <h3 className="text-center text-xl font-semibold">Card {index + 1}</h3>
                    <p className="text-center text-sm">ID: {id}</p>
                    <button onClick={handleFullscreenToggle} className="absolute top-2 right-2 bg-black text-white py-1 px-2 rounded">large</button>
                </li>

            ))}

        </ul>

    );
};

export default DynamicCards;
