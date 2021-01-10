import Axios from 'axios';
import { useEffect, useState } from 'react';

const useProfile = (username) => {

    const [ profile, setProfile ] = useState(null);
    const [ error, setError ] = useState(null);

    useEffect(() => {
      Axios.get(`/users${username}`)
        .then(res => setProfile(res.data))
        .catch(err => setError(err.message));
        
    }, [username]);

    return { profile };
}