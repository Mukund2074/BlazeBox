'use client';
import '@/app/globals.css'
import { ChevronRightTwoTone, Close, Home, Menu, TrendingUpOutlined, VideoCameraBack, VideoLibrarySharp } from '@mui/icons-material'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import '@/app/globals.css';
import api from '@/context/Api';
import { HttpStatusCode } from 'axios';
import { useRouter } from 'next/navigation';
import { CloseRounded, WidgetsRounded } from '@mui/icons-material';

export default function Header({ }) {

  const [searchModelOpen, setSearchModelOpen] = useState(false);

  const [inputQuery, setInputQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [showCats, setShowCats] = useState(false);
  const router = useRouter();

  const toggleCats = () => {
    setShowCats(!showCats);
  }

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {

        if (inputQuery.length > 2) {

          const response = await api.get(`search?query=${decodeURIComponent(inputQuery)}`);

          if (response.status === HttpStatusCode.Ok) {
            let combine = [];
            let refinements = response?.data?.refinements || [];
            let titles = response.data?.data.map((data) => (
              data?.title
            )) || [];

            combine = [...titles, ...refinements];

            setSuggestions(combine);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchSearchResults();
  }, [inputQuery])

  useEffect(() => {
    if (inputQuery === '') {
      setSuggestions([]);
    }
  }, [inputQuery])

  const toggleSearchModel = () => {
    setSearchModelOpen(!searchModelOpen);
  }


  const handleNavigation = (params) => {

    let url = '';
    if (params === '' || null || undefined) {
      url = `/search/${inputQuery}`;
    } else {
      url = `/search/${params}`
    }

    router.push(url)
    setSuggestions([]);
    toggleSearchModel();
  }

  const Catagories = [
    { id: 1, name: 'Home', to: '/home', icon: <Home /> },
    { id: 2, name: 'Trending', to: '/trending', icon: <TrendingUpOutlined /> },
  ]

  return (
    <header className="w-full fixed z-30 top-0 left-0 right-0 text-[#d8c9b8]">
      <div className="w-full flex flex-row items-center px-6 h-20 gap-4 bg-gradient-to-r from-[#402d17] via-[#2f1921] to-[#483e4d]">
        {/* Logo */}
        <span className="text-lg font-bold flex items-center justify-center py-4">
          <img
            className="w-24 spinner h-[30px] rounded-lg"
            src="/logo.png"
            alt="YouTube"
          />
          <Link href="/" className="hover:transform hover:translate-y-[-5px] hover:transition hover:ease-in-out hover:duration-300">
            <p>BlazeBox</p>
          </Link>
        </span>

        <span className='flex flex-row gap-4 ml-auto'>
          <button className={`backdrop-blur-[2px] backdrop-brightness-50 hover:transform hover:translate-y-[-5px] px-6 py-2 rounded-lg hover:transition hover:ease-in-out hover:duration-300 shadow-custom-dark border-[1px] border-[#ff8a00]`}
            onClick={toggleSearchModel}>
            <SearchIcon />
          </button>


          <button className={`backdrop-blur-[2px] backdrop-brightness-50 hover:transform hover:translate-y-[-5px] px-6 py-2 rounded-lg hover:transition hover:ease-in-out hover:duration-300 shadow-custom-dark border-[1px] border-[#ff8a00]`} onClick={toggleCats} >
            <Menu />
          </button>
        </span>


        {searchModelOpen && (
          <div className="fixed flex flex-col p-4 inset-0  bg-gray-900 bg-opacity-50 backdrop-blur-sm">

            <span className='flex flex-col mt-4 w-full gap-4 items-center justify-center'>

              <section className='flex items-center justify-center w-full gap-2'>
                <span className="bg-[#1d1d1d9b] border-[1px] border-[#ff8a00] w-[80%] p-2 md:p-4 rounded-lg shadow-custom-dark-up">
                  <input
                    type="text"
                    onChange={(e) => setInputQuery(e.target.value)}
                    className="w-full p-2 h-8 ml-2 bg-transparent focus:outline-none text-white placeholder:text-gray-300"
                    placeholder="Search"
                  />
                </span>
                <button className="bg-[#1d1d1d9b] border-[1px] border-[#ff8a00] p-2  md:p-4 rounded-lg shadow-custom-dark-up"
                  onClick={() => handleNavigation(inputQuery)}>
                  <SearchIcon className='w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8' />
                </button>

                <button className={`backdrop-blur-[2px] bg-[#862d2d9b] backdrop-brightness-50 hover:transform hover:translate-y-[-5px] p-2  md:p-4 rounded-lg hover:transition hover:ease-in-out hover:duration-300 shadow-custom-dark border-[1px] border-[#ff8a00] ml-auto`} onClick={toggleSearchModel}>
                  <CloseRounded className='w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8' />
                </button>
              </section>


              {suggestions && suggestions.length !== 0 && (
                <ul className="max-h-[500px] overflow-y-scroll mt-1 p-2 mx-auto items-start justify-center text-[#e9e0d6] backdrop-blur-sm backdrop-brightness-50 z-50 border-[1px] border-[#ff8a00] max-w-[80dvw] rounded-lg">
                  {suggestions.map((suggestion, index) => (

                    <li
                      onClick={() => handleNavigation(suggestion)}
                      key={index}
                      className="p-2 my-2 w-full rounded-xl border-[1px] border-[#ff8a00] hover:text-[#da1b60] hover:cursor-pointer hover:transition hover:ease-in-out hover:duration-300">
                      <p className=' line-clamp-1'>
                        {suggestion}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </span>
          </div>
        )}


      </div>

      {showCats &&
        <span className='w-full items-start bg-gradient-to-b border-b-[3px] border-[#ffb03a] shadow-custom-dark  from-[#1b1a1a]  via-[#1c0c12] to-[#130619]  gap-8 flex flex-row  py-4 px-4 overflow-x-scroll scrollbar-hidden '>
          <button className='hover:transform hover:translate-y-[-5px] px-4 py-1  rounded-lg hover:transition hover:ease-in-out hover:duration-300 shadow-custom-dark border-t-[1px] responsive-paragraph border-b-[1px] border-[#ff8a00] '
            onClick={toggleCats}
          >
            <Close />
          </button>

          {Catagories.map((catagory) => (
            <Link key={catagory.id} href={catagory.to} onClick={toggleCats} className='flex items-center flex-row gap-2 hover:transform hover:translate-y-[-5px] px-4 py-1 min-w-max text-center rounded-lg hover:transition hover:ease-in-out hover:duration-300 shadow-custom-dark border-t-[1px]  border-b-[1px] border-[#ff8a00] responsive-paragraph'>
              {catagory.icon}  {catagory.name}
            </Link>
          ))}
        </span>
      }
    </header>
  );
}

