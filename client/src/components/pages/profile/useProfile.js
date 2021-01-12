import Axios from 'axios';
import { useEffect, useState } from 'react';

export const useProfile = (user, userName) => {

    const [ profile, setProfile ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ demos, setDemos ] = useState([]);
    const [ page, setPage ] = useState({ ownProfile: false, following: false, interactable: false });

    useEffect(() => {

      setLoading(true);

      Axios.get(`/users/${userName}`)
        .then(res => {
          setProfile(res.data);
          setError(null);
        })
        .catch(err => {
          setError(err.response.data.error);
          setProfile(null);
        })
        .finally(() => setLoading(false));
      
    }, [userName]);

    // find some additional page info that will help us dictate the page/what the user is allowed to interact with on the page
    useEffect(() => {
      if (!user || !profile) {
        setPage({ ownProfile: false, following: false, interactable: false });
      } else if (user._id === profile._id) {
        setPage({ ownProfile: true, following: false, interactable: false });
      } else {
        Axios.get(`/users/${user._id}/follows/${profile._id}`)
        .then(res => {
          setPage({ ownProfile: false, following: res.data, interactable: true });
        })
        .catch(err => {
          setError(err.response.data.error);
        });
      }
    }, [user, profile]);

    // currently the way the 2 useEffects below are setup, demos get refetched on follow/unfollow 
    // since those actions update the profile and user. Its not a huge problem, but not ideal
    useEffect(() => {
      if (user && user.userName.toLowerCase() === userName.toLowerCase()) {
        const token = localStorage.getItem("auth-token");
        
        console.log("TOP", user, profile, userName);

        // fetch the user's own profile with their public and private demos since they are on their own profile page
        Axios.get("/demos/get-demo-list", { headers: { "x-auth-token": token } })
          .then(res => {
            setDemos(res.data);
          })
          .catch(err => {
            setError(err.message);
          });
      } else if (profile && user && profile.userName.toLowerCase() !== user.userName.toLowerCase()) {

        console.log("BOTTOM", user, profile, userName);

        // fetch the profile page of the user whose profile we're on unless it is their own profile
        Axios.get(`/users/${profile._id}/demos`)
          .then(res => {
            setDemos(res.data);
          })
          .catch(err => {
            setError(err.messgae);
          })
      }

    }, [userName, user, profile]);

    return { profile, setProfile, error, setError, demos, loading, page };
}