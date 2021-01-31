import { IconButton } from 'components/reusable/button/Button';
import { Popup } from 'components/reusable/popup/Popup';
import { ContributorSearch } from 'components/userSearch/ContributorSearch';
import UserContext from 'context/UserContext';
import React, { useContext, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { MdPersonAdd, MdSettings } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

export const DemoItem = ({demo, setDemos}) => {

    const history = useHistory();
    const { user } = useContext(UserContext);
    const [ showSearch, setShowSearch ] = useState(false);
    const [ showSettings, setShowSettings ] = useState(false);
    
    const demoClick = () => {
        history.push({
            pathname: `/demos/${demo._id}`,
            state: { demo }
        });
    }

    const onAddContributor = (updatedDemo) => {
        setDemos(demos => demos.map(d => {
            if (d._id === demo._id) {
                return updatedDemo;
            }
            return d;
        }));
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
                <IconButton component={MdSettings} onClick={() => setShowSettings(show => !show)} style={{marginTop: "10px"}}/>
            </div>}

            {showSearch && <ContributorSearch demo={demo} onAddContributor={onAddContributor} onExit={() => setShowSearch(false)} />}
            {showSettings && <Popup title={demo.title} onExit={() => setShowSettings(false)}></Popup>}
        </div>
    )
}

const DemoText = ({label, value}) => (
    <p className="demoText">{label}: <strong>{value}</strong></p>
)