import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const Recovery = () => {

    const firebase = useContext(FirebaseContext);
    const [email, setEmail] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        firebase.recovery(email).then(() => {
            successMessage('You will receive an email in a few moments');
        }).catch(error => {
            errorMsg(error.message);
            setEmail('');
            document.querySelector("#email").value = '';
        })
    }
    const successMessage = message => {
        toast.success(message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false
        });
    }
    const errorMsg = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false
        });
    }
    const button = email !== '' ? <button className="btn btn-primary">valider</button> : <button className="btn btn-primary" disabled>valider</button>;
    
    return (
        <>
            <main>
                <div className="recovery">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h2>Recover a new password</h2>
                                <form onSubmit={ handleSubmit }>
                                    <div className="row">
                                        <div className="form-group">
                                            <input type="email" className="input" name="email" id="email" value={ email } onChange={ e => setEmail(e.target.value) } placeholder=" " /> 
                                            <label className="label" htmlFor="email">Email</label>
                                        </div>
                                    </div>
                                    <div className="row">{ button }</div>
                                    <div className="row">
                                        <Link to="/">Log in</Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <span className="copyright">The My Books List website was created by DUCHAUSSOIT Yann &#169; 2022</span>
            </main>
        </>
    )
}

export default Recovery;