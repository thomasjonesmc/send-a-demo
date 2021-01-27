import Axios from "axios";
import { useEffect, useRef, useState } from "react";

export const useUserSearch = (search) => {

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
            Axios.get(`/users/search/${search}`)
            .then(res => {
                setUsers(res.data);
                setError(null);
            })
            .catch(err => {
                setError(err.response.data.error);
            })
            .finally(() => setLoading(false));
        }, 500);

    }, [search]);

    return { users, error, loading };
}