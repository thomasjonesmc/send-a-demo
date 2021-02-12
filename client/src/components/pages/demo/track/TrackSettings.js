import Axios from 'axios';
import { Button } from 'components/reusable/button/Button';
import { Form, FormInput } from 'components/reusable/form/Form';
import { Popup } from 'components/reusable/popup/Popup';
import React, { useEffect, useRef, useState } from 'react';

export const TrackSettings = ({track, onExit, onUpdateTrack}) => {

    const [ title, setTitle ] = useState(track.trackTitle);
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
   

    const submit = async () => {
        try {

            if (!title) { return setError("Title is required"); }

            if (title === track.trackTitle) {
                return setError("You didn't change anything");
            }

            const { data: updatedTrack } = await Axios.put(`/demos/update-track/${track._id}`, {
                title,
            });

            onUpdateTrack(updatedTrack);

            setNotice("Successfully Updated Track");
        } catch (err) {
            err.response && setError(err.response.data.error);
        }
    }

    return (
        <Popup title={track.trackTitle} onExit={onExit}>
            {error && <div>{error}</div>}
            {notice && <div>{notice}</div>}
            <Form onSubmit={submit}>
                <FormInput name="title" label="Track Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
            
                <FormInput name="author" label="Track Author" value={track.trackAuthor} readOnly/>
                {track.trackStart !== null && <FormInput name="trackStart" label="Track Start Time" value={`${track.trackStart.toFixed(2)} seconds`} readOnly/>}

                <div className="center">
                    <Button type="submit">Submit Changes</Button>
                </div>
            </Form>
        </Popup>
    );
}