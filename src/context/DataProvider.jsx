'use client'
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { mainFetcher, continuationFetcher, infiniteScroller, commentContinuationFetcher, commentFetcher } from './FetchingFunctions';

const DataContext = createContext();

export default function DataProvider({ children }) {

    const [mainVideos, setMainVideos] = useState([]);
    const [extraVideos, setExtraVideos] = useState([]);
    const [shorts, setShorts] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [post, setPost] = useState([]);
    const [channel, setChannel] = useState([]);
    const [response, setResponce] = useState([]);
    const [continuation, setContinuation] = useState('');
    const [error, setError] = useState(null);
    const [countryCode, setCountryCode] = useState('');

    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [isEnd, setIsEnd] = useState(false);
    const [commentContinuation, setCommentContinuation] = useState('');
    const [commentError, setCommentError] = useState(null);
    const [commentLoadingInitial, setCommentLoadingInitial] = useState(true);
    const [commentLoadingMore, setCommentLoadingMore] = useState(false);
    const [commentIsEnd, setCommentIsEnd] = useState(false);
    const [comments, setComments] = useState([]);
    const [path, setPath] = useState('');
    const [continuationPath , setContinuationPath] = useState('');
    const [endRef , setEndRef] = useState(null);
    
    const [selected, setSelected] = useState('');
    const [queryParams, setQueryParams] = useState({});
    let noGeo = false;


    useEffect(() => {
        const fetchData = async () => {
            if (path) {
                mainFetcher({
                    setMainVideos,
                    setExtraVideos,
                    setShorts,
                    setPlaylists,
                    setPost,
                    setChannel,
                    setResponce,
                    setContinuation,
                    setError,
                    setCountryCode,
                    setLoadingInitial,
                    path,
                })
            }
        };

        fetchData();
    }, [path]);

    
    const fetchMoreData = async () => {
        continuationFetcher({
            setMainVideos,
            setExtraVideos,
            setShorts,
            setPlaylists,
            setPost,
            setChannel,
            setResponce,
            setError,
            setCountryCode,
            setLoadingMore,
            setContinuation,
            setIsEnd,
            setLoadingMore,
            countryCode,
            continuation,
            path: continuationPath,
            isEnd,
            loadingMore
        })
    };


    infiniteScroller(endRef, setIsEnd, fetchMoreData);


    return (
        <DataContext.Provider
            value={{
                mainVideos,
                extraVideos,
                shorts,
                playlists,
                post,
                channel,
                response,
                continuation,
                error,
                countryCode,
                loadingInitial,
                loadingMore,
                isEnd,
                commentContinuation,
                commentError,
                commentLoadingInitial,
                commentLoadingMore,
                commentIsEnd,
                setPath,
                setContinuationPath,
                setEndRef,
                queryParams,
                setQueryParams,
                selected,
                setSelected
            }}>
            {children}
        </DataContext.Provider>
    )
}

export const useDataContext = () => useContext(DataContext);