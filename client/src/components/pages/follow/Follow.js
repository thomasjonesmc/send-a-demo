import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useFollow } from './useFollow';
import './follow.css';
import ErrorNotice from 'components/reusable/error/Error';
import { FaArrowLeft } from 'react-icons/fa';

export const Follow = ({location}) => {

    // get the last string from the url, its either followers or following
    const [ followType ] = location.pathname.split('/').slice(-1);
    const { userName } = useParams();
    const history = useHistory();


    const { follows, user, loading, error, setError } = useFollow(followType, userName);

    if (loading) return <div>Loading {followType}</div>
    if (!user) return <div>No user found with username {userName}</div>
    if (error) return <ErrorNotice clearError={() => setError(null)}>{error}</ErrorNotice>

    return <div className="followContainer">

        <h2 className="followHeader">
            <button href={`/users/${user.userName}`} onClick={() => history.push(`/users/${user.userName}`)}><FaArrowLeft /></button>
            <span>{user.userName}'s {followType.charAt(0).toUpperCase() + followType.slice(1)}</span>
        </h2>

        {follows.length === 0 && <div>{user.userName} has no {followType} 😥</div>}

        {follows.map(u => {
            return <div className="follow" key={u._id} onClick={() => history.push(`/users/${u.userName}`)}>
                <div>
                    <strong>{u.displayName}</strong>
                </div>
                <div style={{color: "gray", fontSize: "small"}}>
                    @{u.userName}    
                </div>  
            </div>
        })}

    </div>
}