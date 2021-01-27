import Axios from 'axios';
import { IconButton } from 'components/reusable/button/Button';
import { Popup } from 'components/reusable/popup/Popup';
import { UserSearch } from 'components/userSearch/UserSearch';
import UserContext from 'context/UserContext';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdPersonAdd } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

export const DemoItem = ({demo}) => {

    const history = useHistory();
    const { user } = useContext(UserContext);
    const [ showSearch, setShowSearch ] = useState(false);
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

    const demoClick = () => {
        history.push({
            pathname: `/demos/${demo._id}`,
            state: { demo }
        });
    }

    const userClick = async (clickedUser, setSearch) => {

        if (!window.confirm(`Add ${clickedUser.userName} to demo contributors?`)) {
            return;
        }

        try {
            await Axios.put(`/demos/${demo._id}/addContributor/${clickedUser._id}`);
            setNotice(`Added ${clickedUser.userName} to contributors!`);
            setSearch('');
        } catch (err) {
            setError(err.response.data.error);
        }
    }

    return (
        <div className="demoItem">
            <div key={demo._id} className="demoItemInfo" onClick={demoClick}>
                <h3 className="demoTitle">{demo.title}</h3>
                <DemoText label="author" value={demo.creator.displayName} />
                <DemoText label="created" value={new Date(demo.createdOn).toLocaleDateString()} />
                <DemoText label="last modified" value={new Date(demo.modifiedOn).toLocaleDateString()} />
            </div>

            {/* only let the demo creator add users to a demo or delete a demo. might want to extend this to demo contributors in the future */}
            {user._id === demo.creator._id && <div className="demoItemControls">
                <IconButton component={FaRegTrashAlt} />
                <IconButton component={MdPersonAdd} onClick={() => setShowSearch(show => !show)} style={{marginTop: "10px"}} />
            </div>}

            {showSearch && <Popup title="Add User to Demo" onExit={() => setShowSearch(false)}>
                {notice && <div>{notice}</div>}
                {error && <div>{error}</div>}
                <UserSearch userClick={userClick}/>
            </Popup>}
        </div>
    )
}

const DemoText = ({label, value}) => (
    <p className="demoText">{label}: <strong>{value}</strong></p>
)