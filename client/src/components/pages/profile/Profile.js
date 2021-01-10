import React from 'react';
import { useParams } from 'react-router-dom';

export const Profile = () => {

    const { username } = useParams();

    return <div>
        {username}
    </div>
} 