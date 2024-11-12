import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/login-register.css';
import { Modal, Button } from 'react-bootstrap';

const AuthPage = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [adminVerfied, setAdminVerfied] = useState(false);
    const navigate = useNavigate();
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const handleEmailLink = () => {
        window.open('https://www.gmail.com', '_blank');
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const { user, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                toast.error(error.message); // Display error message using React-Toastify
            } else {

                const { user, error: accountError } = await supabase
                    .from('accounts')
                    .insert([{ username, email, password, role: 'user', isAdminVerified: adminVerfied }]);

                if (accountError) {
                    toast.error('Email already in used'); // Display error message using React-Toastify
                } else {
                    toast.success('user signed up pls verify yout email')
                    setShowVerificationModal(true);
                    console.log('User signed up successfully:', user);
                }
            }
        } catch (error) {
            console.error('Error signing up:', error.message);
            toast.error('An error occurred during sign-up. Please try again.'); // Display error message using React-Toastify
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();

        try {
            // Fetch user data based on username
            const { data: userData, error: userError } = await supabase
                .from('accounts')
                .select('email, password, isAdminVerified')
                .eq('username', username)
                .single();

            if (userError || !userData) {
                toast.error('Invalid username or password.');
            } else {
                if (!userData.isAdminVerified) {
                    toast.error('user not yet verified by admin. ');
                    return;
                };

                const { data: { user }, error } = await supabase.auth.signInWithPassword({
                    email: userData.email,
                    password,
                });

                if (error) {
                    toast.error(error.message);
                } else {
                    console.log('User signed in successfully:', user);
                    // Redirect to dashboard or home page after successful sign-in
                    navigate('/AddTree'); // Change the route as per your app's navigation
                }
            }
        } catch (error) {
            console.error('Error signing in:', error.message);
            toast.error('An error occurred during sign-in. Please try again');
        }
    };

    return (
        <>
            <div className={`authpage ${isSignUpMode ? 'sign-up-mode' : ''}`} id="particles">
                <div className="forms-container" id="webcoderskull">
                    <div className="signin-signup">
                        {/* Sign-in form */}
                        <form onSubmit={handleSignIn} className="sign-in-form">
                            <h2 className="title">Sign in</h2>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <input type="submit" value="Login" className="btn solid" />
                            <Link to='/forgotpass' replace='true'><a>Forget password</a></Link>
                            <p className="social-text">Or Sign in with social platforms</p>
                            <div className="social-media">
                                <a href="#" className="social-icon">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-google"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </form>
                        {/* Sign-up form */}
                        <form onSubmit={handleSignUp} className="sign-up-form">
                            <h2 className="title">Sign up</h2>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-envelope"></i>
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="input-field">
                                <i className="fas fa-lock"></i>
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <input type="submit" className="btn" value="Sign up" />
                            <p className="social-text">Or Sign up with social platforms</p>
                            <div className="social-media">
                                <a href="#" className="social-icon">
                                    <i className="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-google"></i>
                                </a>
                                <a href="#" className="social-icon">
                                    <i className="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content" id='logsigncontent'>
                            <h3>New here ?</h3>
                            <p>
                            Look for a "Sign Up," "Create Account," or "Register" button. Click on it to begin the account creation process.
                            </p>
                            <button className="btn transparent" id="sign-up-btn" onClick={() => setIsSignUpMode(true)}>
                                Sign up
                            </button>
                        </div>
                        <img src="" className="image" alt="" />
                    </div>
                    <div className="panel right-panel">
                        <div className="content" id='logsigncontent'>
                            <h3>One of us ?</h3>
                            <p>
                            Look for a "Login," "Sign In," or "Log In" option on the homepage or within the app interface. Click on it to proceed.
                            </p>
                            <button className="btn transparent" id="sign-in-btn" onClick={() => setIsSignUpMode(false)}>
                                Sign in
                            </button>
                        </div>
                        <img src="" className="image" alt="" />

                        {/* ToastContainer for displaying Toast notifications */}
                        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                    </div>
                </div>
                <Modal show={showVerificationModal} onHide={() => setShowVerificationModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Email Verification</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Please check your email to verify your account.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleEmailLink}>Verify</Button>
                        <Button variant="secondary" onClick={() => setShowVerificationModal(false)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default AuthPage;
