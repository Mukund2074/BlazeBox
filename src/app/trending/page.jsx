'use client';

import { useEffect, useRef, useState } from "react";
import VideoDisplay from "@/components/custom/VideoDisplay";
import { Gamepad, MovieCreation, MusicNote, SentimentSatisfiedAlt, TrendingUp } from "@mui/icons-material";
import { useDataContext } from "@/context/DataProvider";
import SkeletonLoader from "@/context/Loader";

export default function Trending() {

  const { mainVideos, extraVideos, shorts, loadingInitial, continuation, loadingMore, error, setPath, setContinuationPath, setEndRef } = useDataContext();
  const endRef = useRef(null);

  const [selected , setSelected] = useState('now');
  const [isLoadingPage , setIsLoadingPage] = useState(false);


  useEffect(() => {
    setEndRef(endRef);
  }, [setEndRef]);


  useEffect(() => {
    setPath('trending?type=now');
    setContinuationPath('trending');
  }, [setPath, setContinuationPath]);

  const handleChangeCategory = (path) => {
    setIsLoadingPage(true);
    setSelected(path);
    setPath(`trending?type=${path}`);
    setContinuationPath(`trending?type=${path}`);
    setTimeout(() => {
      setIsLoadingPage(false);
    }, 1000);
  }


  const links = [
    { name: "Trending Now", path: 'now', icon: <TrendingUp /> },
    { name: 'Trending Music', path: 'music', icon: <MusicNote /> },
    { name: 'Trending Movies', path: 'movies', icon: <MovieCreation /> },
    { name: 'Trending Gaming', path: 'gaming', icon: <Gamepad /> },
  ]

  return (
    <main className="py-4">

      <span className='w-full items-start gap-8 flex flex-row  py-4 px-4 overflow-x-scroll scrollbar-hidden '>

        {links.map((item, index) => (
          <button 
          onClick={() => handleChangeCategory(item.path)} 
          key={index} 
          className={`
          ${selected === item.path ? 'bg-[#ff880070] border-t-[1px] border-b-[1px] border-[#ff8a00]' : ''}
          flex min-w-max responsive-paragraph items-center flex-row gap-2 hover:transform hover:translate-y-[-5px] px-6 py-2 text-center rounded-lg hover:transition hover:ease-in-out hover:duration-300 shadow-custom-dark border-t-[1px] border-b-[1px] border-[#ff8a00]`}>
            {item.icon}  {item.name}
          </button>
        ))}

      </span>

      {isLoadingPage && <SkeletonLoader count={10} noGrid={true} />}
      <section className="px-6">

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

      {continuation === '' && <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Page! <SentimentSatisfiedAlt /></font>}
    </main>

  );
}
