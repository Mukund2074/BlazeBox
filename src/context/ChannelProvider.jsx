'use client';
import React, { useState, useEffect, createContext, useContext } from 'react';
import { ChannelFetcher } from './FetchingFunctions';

const ChannelContext = createContext();

export default function ChannelProvider({ children }) {

    const [channel, setChannel] = useState([]);
    const [about, setAbout] = useState([]);
    const [loading, setLoading] = useState(true);
    const [channelId, setChannelId] = useState('');


    let channelTabs = channel?.meta?.tabs || [];
    const [activeTab, setActiveTab] = useState(channelTabs[0] || 'Home' || '');



    useEffect(() => {
        const fetchChannel = async () => {
            if (!channelId || channelId === '' || channelId === undefined || channelId === null) return;
            ChannelFetcher({ channelId, setChannel, setLoading });
            ChannelFetcher({ channelId, changeOfPath: 'about', setChannel: setAbout, setLoading });
        }
        fetchChannel();
    }, [channelId]);


    return (
        <ChannelContext.Provider value={{ channel,about, loading, setChannelId , activeTab, setActiveTab , channelTabs }}>
            {children}
        </ChannelContext.Provider>
    );

}

export const useChannel = () => useContext(ChannelContext);