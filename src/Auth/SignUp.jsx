import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import signupimg from "../assets/images/signup-car.png";
import SignInWithGoogle from './SignInWithGoogle'
import { auth, db } from '../firebase'
import { setDoc, doc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');

  const SignUptheUser= async (e) => {
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(auth,email,password);
            const user = auth.currentUser
            if(user){
                await setDoc(doc(db,'NewUsers',user.uid),{
                    UserEmail:email,
                    UserName:username
                })
                alert("success")
            window.location.href='/home'
            }
        }catch (error) {
            alert(error.message)}
  };

  const LogIntheuser = () => {
    window.location.href='/Auth/SignIn'
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center align-items-center min-vh-100 gx-0">

        {/* Form Column */}
        <div className="col-12 col-md-4 px-4">
          <div className="bg-info rounded shadow-lg p-4 d-flex flex-column align-items-center">
            <h2 className="mb-4 text-white">Sign Up</h2>

            {/* Name */}
            <label htmlFor="nameInput" className="form-label w-100">Name</label>
            <div className="input-group rounded-pill border px-3 py-2 mb-3 w-100">
              <span className="input-group-text bg-transparent border-0">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="form-control border-0"
                id="nameInput"
                placeholder="Enter your name"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <label htmlFor="emailInput" className="form-label w-100">Email</label>
            <div className="input-group rounded-pill border px-3 py-2 mb-3 w-100">
              <span className="input-group-text bg-transparent border-0">
                <i className="bi bi-envelope-fill"></i>
              </span>
              <input
                type="email"
                className="form-control border-0"
                id="emailInput"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <label htmlFor="passwordInput" className="form-label w-100">Password</label>
            <div className="input-group rounded-pill border px-3 py-2 mb-4 w-100">
              <span className="input-group-text bg-transparent border-0">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control border-0"
                id="passwordInput"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-100 mb-3"
              onClick={SignUptheUser}
            >
              Sign Up
            </button>
             <SignInWithGoogle/>

            <div className="d-flex align-items-center">
              <p className="mb-0 me-2 text-white">Already have an account?</p>
              <button
                className="btn btn-outline-light"
                onClick={LogIntheuser}
              >
                Log In
              </button>
            </div>
          </div>
        </div>

        {/* Image Column (hidden on < md) */}
        <div className="d-none d-md-block col-md-8 px-0">
          <img
            src={signupimg}
            alt="Signup Background"
            className="img-fluid h-100 w-100 object-cover"
            style={{ objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
