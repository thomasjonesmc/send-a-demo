import Axios from "axios";
import { useEffect, useRef, useState } from "react";

export const useUserSearch = (search, filter) => {

    const [ users, setUsers ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const timeoutRef = useRef();

    useEffect(() => {

        setUsers([]);

        clearTimeout(timeoutRef.current);
        
        if (!search) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        
        timeoutRef.current = setTimeout(() => {
            // encode the URI component so special URL characters like `#` or `%` don't affect the URL
            Axios.get(`/users/search`, {
                params: { userName: search }
            })
            .then(res => {
                
                // if a filter function was passed in, apply it to the data
                if (filter) {
                    setUsers(res.data.filter(filter));
                } else {
                    setUsers(res.data);
                }

                setError(null);
            })
            .catch(err => {
                setError(err.response.data.error);
            })
            .finally(() => setLoading(false));
        }, 500);

    }, [search, filter]);

    return { users, setUsers, error, loading };
}