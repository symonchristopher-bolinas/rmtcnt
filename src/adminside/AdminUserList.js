import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Container, Table, Form, Pagination, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import supabase from '../supabase';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminUserList = () => {
    const [userData, setUserData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 50;
    const [error, setError] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase.from('accounts').select('*');
                if (error) {
                    throw error;
                }
                setUserData(data);
            } catch (error) {
                console.error('Error fetching tree data:', error.message);
            }
        };
        fetchData();
    }, [userData]);

    const handleVerify = async (id, verified) => {
        try {
            const { data, error } = await supabase
                .from('accounts')
                .update({ isAdminVerified: verified })
                .eq('id', id);

            if (error) {
                throw error;
            }

            // Assuming successful update, you may want to update the local state or trigger a refetch of data
            console.log('User verification successful:', data);
            toast.success('User verification successful:');
        } catch (error) {
            console.error('Error verifying User:', error.message);
            toast.error('User verification error')
        }
    };


    const filteredData = Object.entries(userData)
        .filter(([id, details]) => {
            if (!details) return false;
            console.log('speciesid:', id);
            console.log('details:', details);
            const searchTermRegex = new RegExp(searchTerm, 'i');
            return (
                searchTermRegex.test(details.id) ||
                searchTermRegex.test(details.username) ||
                searchTermRegex.test(details.email) ||
                searchTermRegex.test(details.role) ||
                searchTermRegex.test(details.isAdminVerified)
            );
        });


    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentData = filteredData.slice(firstIndex, lastIndex);

    const totalPageCount = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className='app'>
            <Sidebar />
            <section className='userlist-section'>
                <div className="container"><br /><br /><br />
                    <h2 className='overview13'>Users:</h2>
                    <div className="row justify-content-start">
                        <div className="col" id='qrtable'>
                            <Form.Group controlId="search">
                                <Form.Control
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Form.Group>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Username</th>
                                            <th className="d-none d-md-table-cell">Email</th>
                                            <th className="d-none d-md-table-cell">Role</th>
                                            <th className="d-none d-md-table-cell">KYC Verification</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map(([id, data]) => (
                                            <tr key={data.id}>
                                                <td>{data.id}</td>
                                                <td>{data.username}</td>
                                                <td className="d-none d-md-table-cell">{data.email}</td>
                                                <td className="d-none d-md-table-cell ">{data.role}</td>
                                                <td className="d-none d-md-table-cell ">{data.isAdminVerified ? "Verified" : "Not Verified"}</td>
                                                <td>
                                                    <button onClick={() => handleVerify(data.id, true)} disabled={data.isAdminVerified}>
                                                        {!data.isAdminVerified ? "Verify User" : "Verified"} </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>


                            <div style={{ display: 'flex', justifyContent: 'center', color: 'black' }}>
                                <Pagination>
                                    {Array.from({ length: totalPageCount }, (_, index) => (
                                        <Pagination.Item
                                            key={index + 1}
                                            active={index + 1 === currentPage}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </Pagination.Item>
                                    ))}
                                </Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {error && <p className="error">{error}</p>}
            {/* ToastContainer for displaying Toast notifications */}
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
};

export default AdminUserList;
