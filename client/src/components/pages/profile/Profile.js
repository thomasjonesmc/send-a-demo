import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from './useProfile';
import './profile.css';
import profilePic from 'img/gabby.jpg';

export const Profile = () => {

    const { userName } = useParams();
    const { profile, error, loading } = useProfile(userName);

    if (loading) return <div>loading</div>
    if (error) return <div>{error}</div>

    // this is all temporary 
    return <div className="profileContainer">
        <div className="profileHeader">
            <span className="profileDisplayName">{profile.displayName}</span>
            <span className="profileUserName">@{profile.userName}</span>
            <button className="profileFollowButton">Follow</button>
        </div>

        <div className="profileInfoContainer">
            <div className="profileImageContainer">
                <img className="profileImage" src={profilePic} alt="Profile"/>
            </div>

            <span className="profileDisplayName">{profile.displayName}</span>
            <span className="profileUserName">@{profile.userName}</span>
            
            <div className="profileFollow">
                <Link to={`/users/${userName}/followers`}>{profile.followers.length} Followers</Link>
                <Link to={`/users/${userName}/following`}>{profile.following.length} Following</Link>
            </div>
        </div>
    </div>
} 