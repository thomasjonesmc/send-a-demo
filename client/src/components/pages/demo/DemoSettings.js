import Axios from 'axios';
import { Button } from 'components/reusable/button/Button';
import { Form, FormCheckBox, FormInput } from 'components/reusable/form/Form';
import { Popup } from 'components/reusable/popup/Popup';
import React, { useEffect, useRef, useState } from 'react';

export const DemoSettings = ({demo, onExit, onUpdateDemo}) => {

    const [ title, setTitle ] = useState(demo.title);
    const [ isPublic, setIsPublic ] = useState(demo.isPublic);
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

            if (title === demo.title && isPublic === demo.isPublic) {
                return setError("You didn't change anything");
            }

            const { data: updatedDemo } = await Axios.put(`/demos/${demo._id}/update`, {
                title,
                isPublic
            });

            onUpdateDemo(updatedDemo);

            setNotice("Successfully Updated Demo");
        } catch (err) {
            err.response && setError(err.response.data.error);
        }
    }

    return (
        <Popup title={demo.title} onExit={onExit}>
            {error && <div>{error}</div>}
            {notice && <div>{notice}</div>}
            <Form onSubmit={submit}>
                <FormInput name="title" label="Demo Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                <FormCheckBox name="isPublic" label="Public" checked={isPublic} onChange={e => setIsPublic(p => !p)} />
            
                <div className="center">
                    <Button type="submit">Submit Changes</Button>
                </div>
            </Form>
        </Popup>
    );
}