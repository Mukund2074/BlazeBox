'use client';
import axios from 'axios';



export const getLocationOfUser = async () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
};

// geoapify api which is subscribed by developer for reverse geocoding 
// used to fetch address from latitude and longitude
export const fetchAddress = async (lat, long) => {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${process.env.NEXT_PUBLIC_GEOCODE_KEY}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
