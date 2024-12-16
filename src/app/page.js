'use client';
import Footer from '@/components/footer/Footer';
import Catagories from '@/components/header/Catagories';
import Header from '@/components/header/Header';
import WidgetsIcon from '@mui/icons-material/Widgets';
import React, { useEffect, useState } from 'react';

export default function PageManager({ children }) {

  const [catsOpen, setCatsOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);


  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setIsTop(scrollPosition >= 0 ); 
    };
  
    window.addEventListener('scroll', handleScroll);
  
    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  


  const toggleCategories = (e) => {
    setCatsOpen((prevMenu) => prevMenu ? null : e.currentTarget);
  }


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [children]);

  return (
    <React.Fragment>

      <Header toggleCategories={toggleCategories} />
      {catsOpen &&
        <section className='w-full fixed top-16 max-h-32 z-20 gap-8 flex overflow-x-scroll scrollbar-hidden '>
        <Catagories toggleCategories={toggleCategories} />
        </section>
      }
      <main className={`pt-20`}>
        {children}
      </main>


      <Footer />
    </React.Fragment>
  );
}
