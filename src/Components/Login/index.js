import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { BsFillEyeFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const Login = props => {

    const firebase = useContext(FirebaseContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
        firebase.login(email, password).then(userCredential => {
            props.history.push('/home')
        }).catch(error => {
            errorMessage(error.message);
            setEmail('');
            setPassword('');
        });
    }

    const errorMessage = message => {
        return toast.error(message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: true
        });
    }

    const showPassword = () => {
        const input = document.querySelector('#password');
        const type = input.getAttribute('type');
        const newType = type === 'password' ? 'text' : 'password';
        input.setAttribute('type', newType);
    }

    const button = email !== '' && password.length > 5 ? <button className="btn btn-primary">valider</button> : <button className="btn btn-primary" disabled>valider</button>;
    
    return (
        <>
            <main>
                <div className="login">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h1 className="title-h1">My Books List</h1>
                                <p className="text"><span>Welcome</span>This application was created to help you manage your book purchases. Through this website, you will be able to add or modify the books you want to buy to enrich your collection. Enjoy and thank you for your trust.</p>
                            </div>
                            <div className="col">
                                <h2 className="title-h2">Login</h2>
                                <form onSubmit={ handleSubmit }>
                                    <div className="row">
                                        <div className="form-group">
                                            <input type="email" className="input" name="email" id="email" value={ email } onChange={ e => setEmail(e.target.value) } placeholder=" " />
                                            <label className="label" htmlFor="email">Email</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <input type="password" className="input" name="password" id="password" value={ password } onChange={ e => setPassword(e.target.value) } placeholder=" " />
                                            <label className="label" htmlFor="password">Password</label>
                                            <BsFillEyeFill onClick={ showPassword } />
                                        </div>
                                    </div>
                                    <div className="row">{ button }</div>
                                    <div className="row">
                                        <Link to="/Register">Create an account</Link>
                                        <Link to="/Recovery">Forgot your password ?</Link>
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

export default Login;