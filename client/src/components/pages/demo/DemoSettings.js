import { Button } from 'components/reusable/button/Button';
import { Form, FormCheckBox, FormInput } from 'components/reusable/form/Form';
import { Popup } from 'components/reusable/popup/Popup';
import React, { useState } from 'react';

export const DemoSettings = ({demo, onExit}) => {

    const [ title, setTitle ] = useState(demo.title);
    const [ isPublic, setIsPublic ]= useState(demo.isPublic);
    
    const submit = () => {

    }

    return (
        <Popup title={demo.title} onExit={onExit}>
            <Form onSubmit={submit}>
                <FormInput name="title" label="Demo Title" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                <FormCheckBox type="checkbox" name="public" label="Public" checked={isPublic} onChange={e => setIsPublic(p => !p)} />
            
                <div style={{display: "flex"}}>
                    <Button type="submit">Submit Changes</Button>
                </div>
            </Form>
        </Popup>
    );
}