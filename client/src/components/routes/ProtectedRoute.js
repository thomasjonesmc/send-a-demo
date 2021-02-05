import React from 'react'
import { Redirect, Route } from 'react-router-dom'

export const ProtectedRoute = ({component: Component, condition, redirect, ...rest}) => {
    return (
        <Route 
            {...rest}
            render={props => {
                if (condition) {
                    return <Component {...props} />
                } else {
                    return (
                        <Redirect to={{
                                pathname: redirect ? redirect : "/",
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
