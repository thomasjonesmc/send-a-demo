import UnderlinedTextInput from 'components/reusable/inputs/Inputs';
import React, { useState } from "react";
import { useUserSearch } from './useUserSearch';
import './userSearch.css';

export const UserSearch = ({userClick, filter}) => {
    
    const [ search, setSearch ] = useState("");

    const { users, error, loading } = useUserSearch(search, filter);

    
    if (error) return <div>{error}</div>

    return <>
        <UnderlinedTextInput value={search} onChange={e => setSearch(e.target.value)} autoFocus/>
        {loading && <div className="userSearchLoading">Loading Users...</div>}
        <ul>
            {users.map(u => (
                <li className="userSearchListItem" key={u._id} onClick={() => userClick(u, setSearch)}>
                    <span>{u.userName}</span>
                </li>
            ))}
        </ul>
    </>
}