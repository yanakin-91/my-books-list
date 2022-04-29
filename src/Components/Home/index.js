import React, { useState, useContext, useRef, useEffect } from 'react';
import { FirebaseContext } from '../Firebase';
import Loader from '../Loader';
import Logout from '../Logout';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const Home = props => {

    const firebase = useContext(FirebaseContext);
    const input = useRef('');

    const [filter, setFilter] = useState(null);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [session, setSession] = useState(null);
    const [datas, setDatas] = useState([]);
    const [maxPages, setMaxPages] = useState();
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setSession(user) : props.history.push('/')
        });
        if (session !== null) {
            if (!showWelcome) {
                firebase.user(session.uid)
                .get()
                .then(doc => {
                    if (doc && doc.exists) {
                        const myData = doc.data()
                        welcomeMessage(myData.pseudo);
                        
                    }
                }).catch(error => {
                    console.log(error)
                });
            }
            
            let array_tmp = [];
            firebase.books(session.uid)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => { array_tmp = [...array_tmp, { id : doc.id, title : doc.data().title, status : doc.data().status } ] });
                var start = (page * perPage) - perPage;
                var end = start + perPage;
                console.log(start, end)
                const filterDatas = filter !== null ? array_tmp.filter(elem => elem.status === filter) : array_tmp;
                const totalPages = Math.ceil(filterDatas.length / perPage);
                const array_datas = filterDatas.slice(start, end);
                setDatas(array_datas);
                setMaxPages(totalPages);
                
            })
            .catch(err => { console.log(err) })
        }
        return () => {
            listener()
        }
    }, [session, props.history, firebase, page, filter, perPage]);

    // Remove 
    const handleDelete = id => {
        firebase.books(session.uid).doc(id)
        .delete()
        .then(() => {
            const newDatas = datas.filter(elem => elem.id !== id);
            setDatas(newDatas);
            successMessage('Your book has been removed from the list');
        });
    };

    const welcomeMessage = (pseudo) => {
        if (!showWelcome) {
            setShowWelcome(true);
            toast(`Welcome ${pseudo} to your application and enjoy`, {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false
            });
        }
    }

    // Show a success message
    const successMessage = string => {
        toast.success(string, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false
        });
    }
    // Show a error message 
    const errorMsg = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false
        });
    }

    const handleEdit = e => {
        const current = e.currentTarget;
        const is_active = current.classList.contains('active');
        if (is_active) return;
        const value = current.innerHTML;
        const id = current.closest('.row').id;
        firebase.books(session.uid).doc(id)
        .update({ status: value })
        .then(res => {
            const newDatas = datas.map(elem => { 
                if (elem.id === id) { elem.status = value }
                return elem;
                
            });
            setDatas(newDatas);
            successMessage('The change has been saved');
        });
    }

    const handleChange = e => {
        var current = e.currentTarget;
        var value = parseInt(current.value);
        setPerPage(value);
    }

    const handleSubmit = e => {
        e.preventDefault();
        let value = input.current.value;
        if (value !== '') {
            firebase.add(session.uid).add({
                title: value,
                status: null
            })
            .then(doc => {
                const newDatas = [{ id: doc.id, title: value, status: null }, ...datas ]
                setDatas(newDatas)
                input.current.value = '';
                successMessage('Your book has been added to the list');
            })
            .catch(err => { console.log(err) })
        } 
        else {
            errorMsg('Please enter a book name');
        }
    };

    const previous = page > 1 ? <li className="previous" onClick={ () => setPage(page - 1) }>Previous</li> : '';
    const next = page < maxPages ? <li className="next" onClick={ () => setPage(page + 1) }>Next</li> : '';

    return session === null ? ( <Loader /> ) : (
        <>
            <main>
                <h1 className="title-h1">My Books List</h1>
                <div className="list">
                    <Logout />
                    <div className="filters">
                        <div className="container">
                            <div className="row">
                                <form className="add" onSubmit={ handleSubmit }>
                                    <div className="row">
                                        <div className="form-group">
                                            <input type="text" className="input" ref={ input } name="add" id="add" placeholder=" " />
                                            <label htmlFor="add" className="label">Add a book</label>
                                        </div>
                                    </div>
                                </form>
                                <div className="labels">
                                    <span className={ filter === null ? 'all active' : 'all' } onClick={ () => setFilter(null) }>all</span>
                                    <span className={ filter === 'to purchase' ? 'to-purchased active' : 'to-purchased' } onClick={ () => setFilter('to purchase') }>to purchase</span>
                                    <span className={ filter === 'purchased' ? 'purchased active' : 'purchased' } onClick={ () => setFilter('purchased') }>purchased</span>
                                </div>
                                <div className="views">
                                    <select name="perPage" onChange={ handleChange } value={ perPage }>
                                        <option value="5">5 books per page</option>
                                        <option value="10">10 books per page</option>
                                        <option value="15">15 books per page</option>
                                        <option value="20">20 books per page</option>
                                    </select>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <div className="table">
                        <div className="container">
                            { 
                                datas.map((data, index) => {
                                    return (
                                        <div className={ data.status === 'to purchase' ? 'row to-purchase' : 'row' } key={ index } id={ data.id }>
                                            <div className="col">{ data.title }</div>
                                            <div className="col">
                                                <ul>
                                                    <li onClick={ handleEdit } className={ data.status === 'to purchase' ? 'to-purchase active' : 'to-purchase' }>to purchase</li>
                                                    <li onClick={ handleEdit } className={ data.status === 'purchased' ? 'purchased active' : 'purchased' }>purchased</li>
                                                    <li onClick={ () => handleDelete(data.id) } className="delete">delete</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="pagination">
                        <div className="container">
                            <div className="row">
                                <ul>
                                    { previous }
                                    <li className="page">{ page }</li>
                                    { next }
                                </ul>
                            </div>    
                        </div>
                    </div>
                </div>
                <span className="copyright">The My Books List website was created by DUCHAUSSOIT Yann &#169; 2022</span>
            </main>
        </>
    )

}

export default Home;