import React from 'react';
import { useParams } from 'react-router-dom';
import { useFollow } from './useFollow';
import './follow.css';

export const Follow = ({location}) => {

    // get the last string from the url, its either followers or following
    const [ followType ] = location.pathname.split('/').slice(-1);
    const { userName } = useParams();


    const { follows, user, loading, error, setError } = useFollow(followType, userName);

    if (loading) return <div className="center">Loading {followType}</div>

    return <div className="followContainer">

        <div className="followHeader">
            <span>{user.userName}'s </span> 
            {followType.charAt(0).toUpperCase() + followType.slice(1)}
        </div>

        {follows.map(u => {
            return <div className="follow" key={u._id}>{u.userName} {u.displayName}</div>
        })}

    </div>
}