import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Dropdown } from 'react-bootstrap'; // Assuming you have Dropdown from react-bootstrap
import supabase from '../supabase'; // Import your Supabase client
import { useAuth } from '../AuthContext'; // Import the useAuth hook from your AuthContext
import '../styles/navbar.css';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
    const [visible, setVisible] = useState(true);
    const { user, signOut } = useAuth();
    const [username, setUsername] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUsername = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('accounts')
                    .select('username')
                    .eq('email', user.email)
                    .single();

                if (error) {
                    console.error('Error fetching username:', error.message);
                } else if (data) {
                    setUsername(data.username);
                }
            }
        };

        fetchUsername();
    }, [user]);

    useEffect(() => {
        const fetchRole = async () => {
            if (user) {
                const { data, error } = await supabase
                    .from('accounts')
                    .select('role')
                    .eq('email', user.email)
                    .single();

                if (error) {
                    console.error('Error fetching username:', error.message);
                } else if (data) {
                    if (data.role == 'admin') {
                        setIsAdmin(true);
                    } else { setIsAdmin(false) }
                }
            }
        };

        fetchRole();
    }, [user]);

    useEffect(() => {
        const handleScroll = () => {
            // find current scroll position
            const currentScrollPos = window.pageYOffset;

            // set state based on location info (compare with previous scroll position)
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

            // set state to new scroll position
            setPrevScrollPos(currentScrollPos);
        };

        // add event listener
        window.addEventListener('scroll', handleScroll);

        // remove event listener on cleanup
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos, visible]);

    return (
        <Navbar className={`sticky-nav ${visible ? 'visible' : 'hidden'}`} style={{ backgroundColor: 'rgba(0, 100, 0, 0.8)' }} expand="lg" sticky="top">

            <Navbar.Brand href="/"><div className='logo'><img src="/img/arbologo.png" alt="Logo" className="icon" style={{ width: '50px', background: 'white', borderRadius: '50%' }} />  ARBOREATRIX</div></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="nav-collapse justify-content-center" id="basic-navbar-nav">
                <Nav className="nav_bar mr-auto">
                    <Nav.Link className="nav_link_custom" href="/">Home</Nav.Link>
                    <Nav.Link className="nav_link_custom" href="/#/BlogSlider">Blog</Nav.Link>
                    <Nav.Link className="nav_link_custom" href="/#/AboutUs">About</Nav.Link>
                    <Nav.Link className="nav_link_custom" href="/#/ContactForm">Contact</Nav.Link>
                    <Nav.Link className="nav_link_custom" href="/#/Feedback">Feedback</Nav.Link>
                    <Nav.Link className="button1" href="/#/AddTree">Add Tree</Nav.Link>
                </Nav>
                {user && (
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Account
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="dropdown-menu-right" style={{ left: '-15px' }}>
                            <Dropdown.ItemText>
                                Welcome, {username}
                            </Dropdown.ItemText>
                            {isAdmin && (
                                <Dropdown.Item><Link to='/Home' style={{ textDecoration: 'none', color: 'black' }}>Admin Dashboard</Link> </Dropdown.Item>)}
                            <Dropdown.Item style={{ background: 'red', color: 'white' }} onClick={signOut}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;
