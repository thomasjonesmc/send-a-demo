import Axios from 'axios';
import { useEffect, useState } from 'react';

export const useProfile = (userName) => {

    const [ profile, setProfile ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);

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

    return { profile, error, loading };
}