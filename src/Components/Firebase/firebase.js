import app from 'firebase/app'
import 'firebase/auth';
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyA4bzY13XBB3-73w1QD937RQwzs_yZ-Gf0",
    authDomain: "my-books-list-e8b42.firebaseapp.com",
    projectId: "my-books-list-e8b42",
    storageBucket: "my-books-list-e8b42.appspot.com",
    messagingSenderId: "708891398758",
    appId: "1:708891398758:web:9d0de52db242e9d6fc93a7"
}

class Firebase {
    constructor() {
        app.initializeApp(config)
        this.auth = app.auth()
        this.db = app.firestore()
        this.batch = this.db.batch()
    }

    // Register
    register = (email, password) => { return this.auth.createUserWithEmailAndPassword(email, password) }

    // Login
    login = (email, password) => { return this.auth.signInWithEmailAndPassword(email, password) }

    // Is connect ?
    edit = email => { return this.auth.updateEmail(this.auth.currentUser, email) }

    // Recovery a new password
    recovery = email => { return this.auth.sendPasswordResetEmail(email) }

    // Logout
    logout = () => { return this.auth.signOut() }

    // enregistre le pseudo et le mail
    user = uid => this.db.doc(`users/${uid}`);

    // Register a book
    add = uid => this.db.collection('books').doc(`${uid}`).collection('list');
    
    // List of books widthout filter
    books = uid => this.db.collection('books').doc(`${uid}`).collection('list');

}

export default Firebase