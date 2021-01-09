import React from 'react';
import UnderlinedTextInput from '../inputs/Inputs';
import './form.css';

export const Form = ({onSubmit, title, ...rest}) => {

    // always prevent default for our form, then call our passed in handle submit
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit && onSubmit(e);
    }

    // give our form some default styles
    return <div className="formContainer">
        {title && <h2 className="formTitle">{title}</h2>}
        <form onSubmit={handleSubmit} {...rest} />
    </div>
    
}

export const FormInput = ({name, label, ...rest}) => (
    <>
        <label htmlFor={name}>{label}</label>
        <UnderlinedTextInput
            id={name}
            name={name}
            {...rest}
        />
    </>    
)