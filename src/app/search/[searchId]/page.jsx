'use client';
import React, { useEffect, useRef, useState } from "react";
import VideoDisplay from "@/components/custom/VideoDisplay";
import { useDataContext } from "@/context/DataProvider";
import { AccountCircleRounded, AlarmOffRounded, BorderColorRounded, CalendarMonthRounded, CameraRearRounded, Check, ChecklistRtlRounded, Clear, CloseRounded, DateRangeRounded, DvrRounded, EditCalendarRounded, EventNoteRounded, FourKRounded, GradeRounded, HdRounded, LibraryAddCheckRounded, LiveTvRounded, LocationOnRounded, MovieCreationRounded, PersonalVideoRounded, PlaylistAddCircleRounded, QueryBuilderRounded, RemoveRedEyeRounded, RunningWithErrorsRounded, SentimentSatisfiedAlt, ShoppingCartRounded, Sort, SortRounded, Subtitles, ThreeDRotationRounded, ThreeSixtyRounded, TimelapseRounded, TimerRounded, TodayRounded, VideoCameraBackRounded, ViewInArRounded } from "@mui/icons-material";
import { useParams } from "next/navigation";

export default function Search() {

  const { searchId } = useParams();
  const [selected, setSelected] = useState({
    types: "",
    dates: "",
    durations: "",
    sorts: "",
    features: []
  });

  const [selectedConfirm, setSelectedConfirm] = useState({
    types: "",
    dates: "",
    durations: "",
    sorts: "",
    features: []
  });

  const [showFilterModel, setShowFilterModel] = useState(false);
  const { mainVideos, shorts, extraVideos, channel, playlists, loadingInitial, continuation, loadingMore, error, setPath, setContinuationPath, setEndRef, queryParams, setQueryParams } = useDataContext();
  const endRef = useRef(null);

  useEffect(() => {
    const buildPath = () => {
      let path = `/search?query=${searchId}`;

      if (selectedConfirm.types) path += `&type=${selectedConfirm.types}` ;
      if (selectedConfirm.sorts) path += `&sort=${selectedConfirm.sorts}`;
      if (selectedConfirm.durations) path += `&duration=${selectedConfirm.durations}`;
      if (selectedConfirm.dates) path += `&upload_date=${selectedConfirm.dates}`;
      if (selectedConfirm.features.length > 0) path += `&features=${selectedConfirm.features.join(',')}`;

      return path;
    };

    const buildContinuationPath = () => {
      let continuationPath = `/search?query=${searchId}&token=${continuation}`;

      if (selectedConfirm.types) continuationPath += `&type=${selectedConfirm.types}`;
      if (selectedConfirm.sorts) continuationPath += `&sort=${selectedConfirm.sorts}`;
      if (selectedConfirm.durations) continuationPath += `&duration=${selectedConfirm.durations}`;
      if (selectedConfirm.dates) continuationPath += `&upload_date=${selectedConfirm.dates}`;
      if (selectedConfirm.features.length > 0) continuationPath += `&features=${selectedConfirm.features.join(',')}`;

      return continuationPath;
    };

    setPath(buildPath());
    setContinuationPath(buildContinuationPath());
  }, [searchId, selectedConfirm, continuation, setPath, setContinuationPath]);

  useEffect(() => {
    setEndRef(endRef);
  }, [setEndRef]);

  const filterControl = {
    types: [
      { name: "All", value: "", icon: <ChecklistRtlRounded /> },
      { name: "Videos", value: "video", icon: <VideoCameraBackRounded /> },
      { name: "Shorts", value: "shorts", icon: <CameraRearRounded /> },
      { name: "Channels", value: "channel", icon: <AccountCircleRounded /> },
      { name: "Playlists", value: "playlist", icon: <PlaylistAddCircleRounded /> },
      { name: "Movies", value: "movie", icon: <MovieCreationRounded /> },
      { name: "Shows", value: "show", icon: <PersonalVideoRounded /> },
    ],
    dates: [
      { name: "Last Hour", value: "hour", icon: <QueryBuilderRounded /> },
      { name: "Today", value: "today", icon: <TodayRounded /> },
      { name: "This Week", value: "week", icon: <DateRangeRounded /> },
      { name: "This Month", value: "month", icon: <CalendarMonthRounded /> },
      { name: "This Year", value: "year", icon: <EventNoteRounded /> },
    ],
    durations: [
      { name: "less than 4 min ", value: "short", icon: <RunningWithErrorsRounded /> },
      { name: "4 to 20 min", value: "medium", icon: <TimelapseRounded /> },
      { name: "more than 20 min", value: "long", icon: <AlarmOffRounded /> },
    ],
    sorts: [
      { name: "Relevance", value: "relevance", icon: <DvrRounded /> },
      { name: "Upload Date", value: "date", icon: <CalendarMonthRounded /> },
      { name: "Views", value: "views", icon: <RemoveRedEyeRounded /> },
      { name: "Rating", value: "rating", icon: <GradeRounded /> },
    ],
    features: [
      { name: "Subtitles", value: "subtitles", icon: <Subtitles /> },
      { name: "Creator Commons", value: "CCommons", icon: <AccountCircleRounded /> },
      { name: "3D", value: "3d", icon: <ThreeDRotationRounded /> },
      { name: "Live", value: "live", icon: <LiveTvRounded /> },
      { name: "Purchased", value: "purchased", icon: <ShoppingCartRounded /> },
      { name: "4K", value: "4k", icon: <FourKRounded /> },
      { name: "360", value: "360", icon: <ThreeSixtyRounded /> },
      { name: "Location", value: "location", icon: <LocationOnRounded /> },
      { name: "HDR", value: "hdr", icon: <HdRounded /> },
      { name: "VR180", value: "vr180", icon: <ViewInArRounded /> },
    ]
  }

  const handleReset = () => {
    setSelected({
      types: "",
      dates: "",
      durations: "",
      sorts: "",
      features: [],
    });
  };

  const handleSelect = (category, value) => {
    if (category === "features") {
      setSelected((prevSelected) => {
        const newFeatures = prevSelected.features.includes(value)
          ? prevSelected.features.filter((item) => item !== value)
          : [...prevSelected.features, value];
        return { ...prevSelected, features: newFeatures };
      });
    } else {
      setSelected((prevSelected) => ({
        ...prevSelected,
        [category]: prevSelected[category] === value ? "" : value, 
      }));
    }
  };

  const handleApply = () => {
    setSelectedConfirm(selected);
    setShowFilterModel(false);
  };

  return (
    <main className={`relative p-4`}>

      <section className="flex items-center gap-2 mb-2">
        <font className=" font-semibold text-gray-400 responsive-text flex items-center gap-2 ">Search Results for   <span className="text-blue-500 underline"> {searchId.replace(/%20/g, ' ')}     {queryParams?.length}</span></font>

        <button onClick={() => setShowFilterModel(!showFilterModel)} className="border-[1px] flex items-center gap-2 border-[#ff8a00] text-gray-400 text-sm ml-auto rounded-lg px-2 py-1" >
          <Sort className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" /> Filter
        </button>
      </section>

      {showFilterModel &&
        <main className={`fixed top-0 left-0 right-0 z-50 w-[100dw] h-[100dvh] backdrop-brightness-50 flex items-center justify-center`}>
          <section className="sticky rounded-xl shadow-custom-dark flex flex-col w-[calc(100vw-20%)] max-h-[calc(100dvh-20%)] min-h-[calc(100vh-200px)] overflow-hidden top-10 right-0 left-0 bg-gradient-to-tl from-[#191a1a] via-[#040408] to-[#38383e]">
            
            <span className="flex border-b-[1px] border-slate-500 items-center gap-2 w-full p-4 ">

              <h1 className=" font-semibold text-gray-400 responsive-text flex items-center gap-2 ">Filter searching results </h1>
              <button className="ml-auto p-2 border-[1px] border-slate-500 text-gray-400 flex items-center justify-center hover:text-white hover:border-white rounded-full">
                <CloseRounded className="w-6 h-6" onClick={() => setShowFilterModel(!showFilterModel)} />
              </button>

            </span>

            <article className="flex flex-col pl-4 pb-8 pt-4 mx-auto overflow-hidden overflow-y-scroll w-full max-h-[calc(100dvh-200px)]">

              {Object.entries(filterControl).map(([category, items] , index) => (
                <div key={category}>
                  <h2 className={`font-bold text-sm ${index === 0 ? "mt-0" : "mt-8"} underline-offset-2 underline flex items-center gap-2`}>{category.toUpperCase()}</h2>
                  <span className={`w-full flex flex-row items-center min-h-max overflow-hidden overflow-x-scroll scrollbar-hidden md:gap-6 gap-2 rounded-lg mt-2 py-2`}>
                    {items.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelect(category, item.value)}
                        className={`min-w-max min-h-max flex responsive-paragraph items-center gap-1 border-[1px] border-slate-500 text-gray-400 hover:text-white hover:border-white ${category === "features" ? selected.features.includes(item.value) && "border-white text-white" : selected[category] === item.value && "border-white text-white"} rounded-lg px-4 py-1`}>
                        {item.icon} {item.name}
                        {category === "features" ? selected.features.includes(item.value) && <Check className="w-4 h-4" /> : selected[category] === item.value && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </span>
                </div>
              ))}

            </article>


            <span className=" w-full flex flex-row  gap-4 p-2 items-center border-t-[1px] border-slate-500 " >

              <button onClick={handleReset} className="border-[1px] flex  ml-auto items-center gap-2 border-slate-500 hover:text-white hover:border-white text-gray-400 text-sm rounded-lg px-4 py-2 shadow-custom-dark" >
                <Clear className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" /> Clear Filters
              </button>
              <button onClick={handleApply} className="border-[1px] flex items-center gap-2 border-slate-500 hover:text-white hover:border-white text-gray-400 text-sm rounded-lg px-4 py-2 shadow-custom-dark" >
                <LibraryAddCheckRounded className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8" /> Confirm
              </button>

            </span>
          </section>
        </main>
      }

      <VideoDisplay
        mainVideos={mainVideos}
        shorts={shorts}
        extraVideos={extraVideos}
        channel={channel}
        playlists={playlists}
        error={error}
        loadingInitial={loadingInitial}
        loadingMore={loadingMore}
        endRef={endRef}
      />

      {continuation === '' && <font className=" font-semibold text-gray-400 text-center text-3xl flex items-center justify-center gap-2 ">End of The Search list! <SentimentSatisfiedAlt /></font>}
    </main>
  );
}
