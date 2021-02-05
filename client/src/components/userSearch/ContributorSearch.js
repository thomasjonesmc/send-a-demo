import Axios from "axios";
import { Popup } from "components/reusable/popup/Popup";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { UserSearch } from "./UserSearch";

export const ContributorSearch = ({demo, onAddContributor, onExit}) => {
    const [ error, setError ] = useState(null);
    const [ notice, setNotice ] = useState(null);

    const timeoutRef = useRef();

 // useEffect that removes the error/notice after 4 seconds of appearing
    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setError(null);
            setNotice(null);
        }, 4000);

        return () => clearTimeout(timeoutRef.current);
    }, [error, notice]);

    const userClick = async (clickedUser, setSearch) => {

        if (!window.confirm(`Add ${clickedUser.userName} to demo contributors?`)) {
            return;
        }

        try {
            const res = await Axios.put(`/demos/${demo._id}/addContributor/${clickedUser._id}`);
            
            onAddContributor(res.data);

            setNotice(`Added ${clickedUser.userName} to contributors!`);
            setSearch('');
        } catch (err) {
            err.response && setError(err.response.data.error);
        }
    }

    // filter out the creator and users who are already contributors
    // callback so it doesn't keep changing as demo state updates
    const filterUsers = useCallback((u) => {
        const isCreator = u._id === demo.creator._id;
        const isContributor = demo.contributors.includes(u._id);

        return !isCreator && !isContributor;
    }, [demo.contributors, demo.creator._id]);

    return (
        <Popup title="Add User to Demo" onExit={onExit}>
            {notice && <div>{notice}</div>}
            {error && <div>{error}</div>}
            <UserSearch userClick={userClick} filter={filterUsers} />
        </Popup>
    )
}