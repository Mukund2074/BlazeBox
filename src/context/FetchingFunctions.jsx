'use client';
import { useEffect } from 'react';
import api from '@/context/Api';
import { getLocationOfUser, fetchAddress } from '@/context/LocationFetcher';
import { HttpStatusCode } from 'axios';


export const mainFetcher = async ({
  setMainVideos = () => { },
  setExtraVideos = () => { },
  setShorts = () => { },
  setPlaylists = () => { },
  setPost = () => { },
  setChannel = () => { },
  setContinuation = () => { },
  setResponce = () => { },
  setCountryCode = () => { },
  setError = () => { },
  path = '',
  setLoadingInitial = false,
  noGeo = false
}) => {


  try {
    // const position = await getLocationOfUser();
    // const { latitude, longitude } = position.coords;

    // const address = await fetchAddress(latitude, longitude);
    // const countryCode = address.features[0].properties.country_code.toUpperCase();
    let countryCode = ''
    setCountryCode(countryCode || 'IN');

    let url = '';
    if (noGeo) {
      url = `${path}`;
    } else if (path.includes('?')) {
      url = `${path}&geo=${countryCode}`;
    } else {
      url = `${path}?geo=${countryCode}`;
    }

    const response = await api.get(url);

    if (response.data && response.status === HttpStatusCode.Ok && response.data.data) {

      setContinuation(response.data?.continuation || '');


      let mainVideos = response.data.data.filter(item => item.type === 'video');
      let innerVideos = response.data.data.filter(item => item.type === 'video_listing');
      let shortVideos = response.data.data.filter(item => item.type === 'shorts_listing');
      let apiShorts = response.data.data.filter(item => item.type === 'shorts');
      let channelData = response.data.data.filter(item => item.type === 'channel');
      let playlists = response.data.data.filter(item => item.type === 'playlist');
      let post = response.data.data.filter(item => item.type === 'post');

      const totalExtraVideos = innerVideos.reduce((acc, video) => {
        if (Array.isArray(video.data)) {
          return [...acc, ...video.data];
        }
        return acc;
      }, []);

      const totalShorts = shortVideos.reduce((acc, video) => {
        if (video.data && Array.isArray(video.data)) {
          return [...acc, ...video.data];
        }
        return acc;
      }, []);

      setMainVideos?.(mainVideos);
      setExtraVideos?.(totalExtraVideos);
      setShorts?.(apiShorts.length > 0 ? apiShorts : totalShorts);
      setChannel?.(channelData);
      setPlaylists?.(playlists);
      setPost?.(post);
      setResponce?.(response.data);
      return response;

    } else {
      setError?.('Failed to fetch data');
    }
  } catch (error) {
    setError?.(error);
  } finally {
    setLoadingInitial?.(false);
  }
};

export const continuationFetcher = async ({
  setMainVideos = () => { },
  setPlaylists = () => { },
  setPost = () => { },
  setShorts = () => { },
  setContinuation = () => { },
  setChannel = () => { },
  setResponce = () => { },
  setIsEnd = () => { },
  setError = () => { },
  setLoadingMore = false,
  countryCode = '',
  continuation = '',
  path = '',
  isEnd = false,
  loadingMore = false,
}) => {
  if (isEnd && continuation && !loadingMore) {
    setLoadingMore(true);

    try {

      let uri = '';
      if (path.includes('?')) {
        uri = `${path}&continuation=${continuation}&geo=${countryCode}`;
      } else if (path.includes('token')) {
        uri = `${path}&geo=${countryCode}`;
      } else {
        uri = `${path}?continuation=${continuation}&geo=${countryCode}`;
      }

      const response = await api.get(uri);

      if (response.data && response.status === HttpStatusCode.Ok && response.data.data) {
        let filteredData = response.data.data.filter(item => item.type === 'video');
        let playlists = response.data.data.filter(item => item.type === 'playlist');
        let post = response.data.data.filter(item => item.type === 'post');
        let shorts = response.data.data.filter(item => item.type === 'shorts');

        setPlaylists?.(prevData => {
          return [...prevData, ...playlists];
        });

        setPost?.(prevData => {
          return [...prevData, ...post];
        });

        setMainVideos?.(prevData => {
          return [...prevData, ...filteredData];
        });

        setShorts?.(prevData => {
          return [...prevData, ...shorts];
        });

        setChannel?.(prevData => {
          return [...prevData, ...response.data.data.filter(item => item.type === 'channel')];
        });

        // setResponce?.(!prevData === undefined ? response.data : prevData => {
        //   return [...prevData, ...response.data?.data];
        // });

        setContinuation(response.data.continuation);

      }
    } catch (error) {
      setError("error in continuation fetcher");
    } finally {
      setLoadingMore(false);
      setIsEnd(false);
    }
  }
};

export const commentFetcher = async ({
  videoId,
  path,
  setComments = () => { },
  setContinuationComments = () => { },
  setError = () => { },
  setLoadingMore = false
}) => {
  try {
    let url = `comments?id=${videoId}`;
    if (path) {
      url = `${path}/comments?id=${videoId}`
    }
    const comments = await api.get(url);
    if (comments?.data?.data && comments.status === HttpStatusCode.Ok) {
      setComments(comments?.data?.data);
      setContinuationComments(comments?.data?.continuation);
      return comments;
    }
  } catch (error) {
    setError(error);
  } finally {
    setLoadingMore(false);
  }
};

export const commentContinuationFetcher = async ({
  videoId = '',
  path,
  setComments = () => { },
  continuationComments = '',
  setContinuationComments = () => { },
  setLoadingMore = false,
  setError = () => { }
}) => {
  try {
    if (!continuationComments) {
      return;
    }

    let url = ``;
    if (path) {
      url = `${path}/comments?id=${videoId}&token=${continuationComments}`
    } else {
      url = `comments?id=${videoId}&token=${continuationComments}`
    }

    const newComments = await api.get(url);
    if (newComments?.data?.data && newComments.status === HttpStatusCode.Ok) {
      setContinuationComments(newComments?.data?.continuation);

      setComments(prevComments => {
        return [...prevComments, ...newComments?.data?.data];
      });
    }
    return newComments;
  } catch (error) {
    setError(error);
  } finally {
    setLoadingMore(false);
  }
};

export const ChannelFetcher = async ({
  channelId,
  setChannel = () => { },
  setError = () => { },
  setLoading = () => { },
}) => {
  try {
    const channel = await api.get(`channel/home?id=${channelId}`);
    if (channel.status === HttpStatusCode.Ok && channel.data) {
      setChannel(channel.data);
    }
    return channel;
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};

export const PlaylistFetcher = async ({
  playlistId,
  setPlaylist = () => { },
  setError = () => { }
}) => {
  try {
    const response = await api.get(`/playlist?id=${playlistId}`);
    if (response.status === HttpStatusCode.Ok && response.data) {
      setPlaylist(response.data);
    }
    return response;
  } catch (error) {
    setError(error);
  }
};

export const infiniteScroller = (endRef, setIsEnd, fetchMoreData) => {
  useEffect(() => {
    if (endRef?.current) {
      const observer = new IntersectionObserver(([entry]) => {

        if (entry.isIntersecting) {
          setIsEnd(true);
          fetchMoreData();
        }
      }, { threshold: 0.1 });

      if (endRef.current) {
        observer.observe(endRef.current);
      }

      return () => {
        if (endRef.current) {
          observer.unobserve(endRef.current);
        }
      };
    }
  }, [fetchMoreData, setIsEnd, endRef]);
};

export const ShortsFetcher = async ({
  shortsId,
  setShortsDetails = () => { },
  setError = () => { },
}) => {
  try {
    const response = await api.get(`/shorts/info?id=${shortsId}`);
    if (response.status === HttpStatusCode.Ok && response.data) {
      setShortsDetails(response.data);
    }
    return response;
  } catch (error) {
    setError(error);
  }
};

export const SequenceFetcher = async ({
  shortsId,
  setSequence = () => { },
  setError = () => { },
}) => {
  try {
    let sequence = await api.get(`/shorts/sequence?id=${shortsId}`);
    if (sequence.status === HttpStatusCode.Ok && sequence.data) {

      let sequnceOnly = sequence?.data?.data?.reduce((acc, item) => item.type === 'shorts' ? [...acc, item.videoId] : acc, []);

      setSequence(sequnceOnly);
    }
    return sequence;
  } catch (error) {
    setError(error);
  }
};

