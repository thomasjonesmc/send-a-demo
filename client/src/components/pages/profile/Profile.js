import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProfile } from './useProfile';
import './profile.css';
import gabby from 'img/gabby.jpg';
import oliver from 'img/oliver.jpg';
import defaultProfile from 'img/profile.png';
import Axios from 'axios';
import UserContext from 'context/UserContext';
import DemoList from '../myDemos/DemoList';

export const Profile = () => {

    const { userName } = useParams();
    const { user, setUser } = useContext(UserContext);
    const { profile, setProfile, error, setError, loading, page, demos } = useProfile(user, userName);

    if (loading) return <div>loading</div>
    if (error) return <div>{error}</div>

    // temporary hardcoded profile pics for FUN!!!
    let profilePic = defaultProfile;
    if (userName.toLowerCase().includes('mac')) {
        profilePic = oliver;
    } else if (userName.toLowerCase().includes('sam')) {
        profilePic = gabby;
    }

    const followClick = () => {
        
        let action = "follow";
        if (page.following) { action = "unfollow"; }

        Axios.put(`/users/${user._id}/${action}/${profile._id}`)
            .then(res => {
                console.log("FOLLOWER", res.data.follower);
                console.log("FOLLOWEE", res.data.followee);
                setUser(res.data.follower);
                setProfile(res.data.followee);
            })
            .catch(err => setError(err.response.data.error));
    }

    // this is all temporary, should be refactored into sepaate components 
    return <div className="profileContainer">
        <div className="profileHeader">
            <div>
                <div className="profileDisplayName">{profile.displayName}</div>
                <div className="profileUserName">@{profile.userName}</div>
                {page.ownProfile && <div className="profileUserName">{profile.email}</div>}
            </div>
            {!page.ownProfile && page.interactable &&
                <button className="profileFollowButton" onClick={() => followClick()}>
                    {page.following ? "Unfollow" : "Follow"}
                </button>
            }
        </div>

        <div className="profileInfoContainer">
            <div className="profileImageContainer">
                <img className="profileImage" src={profilePic} alt="Profile"/>
            </div>

            <div className="profileDisplayName">{profile.displayName}</div>
            <div className="profileUserName">@{profile.userName}</div>
            
            <div className="profileFollow">
                <Link to={`/users/${userName}/followers`}>{profile.followers} Followers</Link>
                <Link to={`/users/${userName}/following`}>{profile.following} Following</Link>
            </div>
        </div>

        <div style={{marginTop: "20px"}}>
            {demos.length > 0 && <h2 style={{margin: "15px 0px"}}>{profile.displayName}'s Demos</h2>}
            <DemoList demos={demos} />
        </div>
    </div>
} 