'use client';
import VideoDisplay from "@/components/custom/VideoDisplay";
import { continuationFetcher, infiniteScroller, mainFetcher } from "@/context/FetchingFunctions";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function Hashtag() {

  const { tagId } = useParams();

  const [response, setResponse] = useState(null);
  const [mainVideos, setMainVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [extraVideos, setExtraVideos] = useState([]);
  const [channel, setChannel] = useState([]);
  const [countryCode, setCountryCode] = useState('');
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [continuation, setContinuation] = useState('');
  const [error, setError] = useState(null);
  const endRef = useRef(null);






  useEffect(() => {
    const fetchData = async () => {
      const result = await mainFetcher({
        setMainVideos,
        setExtraVideos,
        setShorts,
        setChannel,
        setContinuation,
        setError,
        setCountryCode,
        path: `hashtag?tag=${tagId}`,
        setLoadingInitial,
        noGeo: true
      })

      setResponse(result?.data);
    };
    fetchData();
  }, []);

  const fetchMoreData = async () => {
    continuationFetcher({
      setMainVideos,
      setContinuation,
      setIsEnd,
      setLoadingMore,
      countryCode,
      continuation,
      path: `hashtag?tag=${tagId}&token=${continuation}`,
      isEnd,
      loadingMore
    })
  };



  infiniteScroller(endRef, setIsEnd, fetchMoreData);






  return (
    <section className="flex flex-col p-4">
      <span className="flex flex-col w-full pt-14 gap-2 border-b-[1px] border-b-[#ff8a00]">

        <h1 className="text-4xl font-bold">{response?.meta?.hashtag}</h1>
        <h2 className="text-md text-gray-500 font-bold">{response?.meta?.hashtagInfoText}</h2>
      </span>
      <VideoDisplay
        mainVideos={mainVideos}
        shorts={shorts}
        extraVideos={extraVideos}
        channel={channel}
        error={error}
        loadingInitial={loadingInitial}
        loadingMore={loadingMore}
        endRef={endRef}
      />
    </section>
  );
}
