import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = props => {

    const firebase = useContext(FirebaseContext);

    const datas = {
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    const [registerDatas, setRegisterDatas] = useState(datas);

    const handleBlur = () => {
        if (password !== confirmPassword) errorMessage('The password and the confirmation are not identical');
    }
  
    const handleChange = e => {
        setRegisterDatas({
            ...registerDatas,
            [e.target.id] : e.target.value
        });
    }

    const handleSubmit = e => {
        e.preventDefault();
        const { pseudo, password, email } = registerDatas;
        firebase.register(email, password)
        .then(auth => {
            firebase.user(auth.user.uid).set({
                pseudo,
                email
            })
        })
        .then((userCredential) => {
            setRegisterDatas({...registerDatas})
            props.history.push('/')
        }).catch((error) => {
            errorMessage(error.message);
            setRegisterDatas({...registerDatas})
        });
    }

    const errorMessage = message => {
        return toast.error(message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: true
        });
    } 
    const { email, pseudo, password, confirmPassword } = registerDatas;

    const button = email === '' || pseudo === '' || password === '' || confirmPassword !== password ? <button className="btn btn-primary" disabled>validate</button> : <button className="btn btn-primary">validate</button>;

    return (
        <>
            <main>
                <div className="register">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h2>Create an account</h2>
                                <form onSubmit={ handleSubmit }>
                                    <div className="row">
                                        <div className="form-group">
                                            <input type="email" className="input" name="email" id="email" onChange={ handleChange } placeholder=" " />
                                            <label className="label" htmlFor="email">Email</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">   
                                            <input type="text" className="input" name="pseudo" id="pseudo" onChange={ handleChange } placeholder=" " />
                                            <label className="label" htmlFor="pseudo">Pseudo</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <input type="password" className="input" name="password" id="password" onChange={ handleChange } placeholder=" " />
                                            <label className="label" htmlFor="password">Password</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            <input type="password" className="input" name="confirmPassword" id="confirmPassword" onBlur={ handleBlur } onChange={ handleChange } placeholder=" " />
                                            <label className="label" htmlFor="confirmPassword">Confirm password</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group">
                                            { button }
                                        </div>
                                    </div>
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

export default Register;