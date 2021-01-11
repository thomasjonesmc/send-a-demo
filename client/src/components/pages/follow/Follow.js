import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const Follow = ({location}) => {

    // get the last string from the url, its either followers or following
    const [ followType ] = location.pathname.split('/').slice(-1);
    const { userName } = useParams();

    const [ users, setUsers ] = useState([]);

    console.log(userName);

    useEffect(() => {
        Axios.get(`/users/${userName}/${followType}`)
            .then(res => setUsers(res.data))
            .catch(err => console.log(err.message))
    }, [userName, followType]);

    return users.map(u => <div>{u.userName} {u.displayName}</div>)
}