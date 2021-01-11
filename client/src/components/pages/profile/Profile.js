import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from './useProfile';
import './profile.css';
import profilePic from 'img/gabby.jpg';
import Axios from 'axios';
import UserContext from 'context/UserContext';

export const Profile = () => {

    const { userName } = useParams();
    const { profile, setProfile, error, setError, loading } = useProfile(userName);
    const { user, setUser } = useContext(UserContext);

    if (loading || !user) return <div>loading</div>
    if (error) return <div>{error}</div>

    const onOwnProfile = user._id === profile._id;

    const followClick = () => {
        Axios.put(`/users/${user._id}/follow/${profile._id}`)
            .then(res => {
                console.log("FOLLOWER", res.data.follower);
                console.log("FOLLOWEE", res.data.followee);
                setUser(res.data.follower);
                setProfile(res.data.followee);
            })
            .catch(err => setError(err.response.data.error));
    }

    // this is all temporary 
    return <div className="profileContainer">
        <div className="profileHeader">
            <span className="profileDisplayName">{profile.displayName}</span>
            <span className="profileUserName">@{profile.userName}</span>
            {!onOwnProfile && <button className="profileFollowButton" onClick={() => followClick()}>Follow</button>}
        </div>

        <div className="profileInfoContainer">
            <div className="profileImageContainer">
                <img className="profileImage" src={profilePic} alt="Profile"/>
            </div>

            <span className="profileDisplayName">{profile.displayName}</span>
            <span className="profileUserName">@{profile.userName}</span>
            
            <div className="profileFollow">
                <Link to={`/users/${userName}/followers`}>{profile.followers} Followers</Link>
                <Link to={`/users/${userName}/following`}>{profile.following} Following</Link>
            </div>
        </div>
    </div>
} 