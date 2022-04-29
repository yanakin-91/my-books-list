import React, { useEffect, useState, useContext } from 'react'
import { FirebaseContext } from '../Firebase'

const Logout = props => {

    const firebase = useContext(FirebaseContext);

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (checked) firebase.logout()
    }, [checked, firebase])

    return (
        <>
            <div className="logout">
                <label htmlFor="logout">
                    <input type="checkbox" id="logout" checked={ checked } onChange={ e => setChecked(e.target.checked) }/>
                    <span></span>
                </label>
                <span>Logout</span>
            </div>
        </>
    )
}

export default Logout;