import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import UserContext from 'context/UserContext';

export const ProtectedRoute = ({component: Component, ...rest}) => {
    const { user } = useContext(UserContext);

    return (
        <Route 
            {...rest}
            render={props => {
                if (user) {
                    return <Component {...props} />
                } else {
                    return (
                        <Redirect to={{
                                pathname: "/",
                                state: {
                                    from: props.location
                                }
                            }}
                        />
                    )
                }
            }}
        
        />
    )
}
