import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import './popup.css';

export const Popup = ({title, onExit, children, ...rest}) => {
    
    const containerRef = useRef(null);
    
    useEffect(() => {

        // select the app element, our whole app lives here, except the header. This lets us interact with the header even when the popup is open
        const app = document.getElementById('app');

        // select all of the focusable elements in the app element
        const focusable = app.querySelectorAll('button, [href], input, select, textarea, datalist, [tabindex]:not([tabindex="-1"])');

        const elementsToCleanup = [];

        // go through each focusable element and disable it if its not already disabled and it not a descendant of the popup container
        // if that condition is true, push the element to the cleanup array so we can remove the disabled property when the component unmounts
        for (let element of focusable) {
            if (!element.disabled && !containerRef.current.contains(element)) {
                element.disabled = true;
                elementsToCleanup.push(element);
            }
        }

        // enable any elements we disabled
        return () => elementsToCleanup.forEach(e => e.disabled = false)
    }, []);

    return <div className="popupBackground">
        <div ref={containerRef} className="popupContainer"  {...rest}>
            <div className="popupHeader">
                <h3>{title}</h3>
                <button type="button" className="popupExitButton" onClick={onExit}>
                    <FaTimes />
                </button>
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
}