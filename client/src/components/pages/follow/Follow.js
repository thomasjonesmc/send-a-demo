import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useFollow } from './useFollow';
import './follow.css';

export const Follow = ({location}) => {

    // get the last string from the url, its either followers or following
    const [ followType ] = location.pathname.split('/').slice(-1);
    const { userName } = useParams();
    const history = useHistory();


    const { follows, user, loading, error, setError } = useFollow(followType, userName);

    if (loading) return <div>Loading {followType}</div>
    if (!user) return <div>No user found with username jackie</div>

    return <div className="followContainer">

        <h1 className="followHeader">
            <span>{user.userName}'s </span> 
            {followType.charAt(0).toUpperCase() + followType.slice(1)}
        </h1>

        {follows.length === 0 && <div className="center">{user.userName} has no {followType} 😥</div>}

        {follows.map(u => {
            return <div className="follow" key={u._id} onClick={() => history.push(`/users/${u.userName}`)}>
                <strong>{u.displayName}</strong> @{u.userName}
            </div>
        })}

    </div>
}