import Axios from "axios";
import { useEffect, useState } from "react";


export const useFollow = (followType, userName) => {
    
    const [ follows, setFollows ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ user, setUser ] = useState(null);

    useEffect(() => {

        setLoading(true);

        Axios.get(`/users/${userName}/${followType}`)
            .then(res => {
                const { followers, following, ...userData } = res.data;

                setUser(userData);

                if (followers) {
                    setFollows(followers);
                } else if (following) {
                    setFollows(following);
                }
            })
            .catch(err => setError(err.response.data.error))
            .finally(() => setLoading(false));
    }, [userName, followType]);

    return { follows, user, loading, error, setError };
}