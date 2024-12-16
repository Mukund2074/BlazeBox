'use client';
import VideoDisplay from "@/components/custom/VideoDisplay";
import { useDataContext } from "@/context/DataProvider";
import { useEffect, useRef } from "react";

export default function Home() {

  const { mainVideos , extraVideos , shorts , loadingInitial , loadingMore , error  , setPath , setContinuationPath, setEndRef } = useDataContext();
  const endRef = useRef(null);
  
useEffect(() => {
  setEndRef(endRef);
} , [setEndRef]);
  
  
  useEffect(() => {
    setPath('home');
    setContinuationPath('home');
  },[setPath , setContinuationPath]);

  return (
    <section className="px-6 py-10">
      <VideoDisplay
        cols={null}
        mainVideos={mainVideos}
        extraVideos={extraVideos}
        shorts={shorts}
        loadingInitial={loadingInitial}
        loadingMore={loadingMore}
        error={error}
        endRef={endRef}
      />
    </section>
  );
}
