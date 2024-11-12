import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Container, Table, Form, Pagination } from 'react-bootstrap';
import supabase from '../supabase';
import Sidebar from './Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPinStatus = () => {
    const [pinData, setPinData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 50;
    const [error, setError] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase.from('treepins').select('*');
                if (error) {
                    throw error;
                }
                setPinData(data);
            } catch (error) {
                console.error('Error fetching tree data:', error.message);
            }
        };
        fetchData();
    }, [pinData]);

    const handleVerify = async (treeInstanceId, verified) => {
        try {
            const { data, error } = await supabase
                .from('treepins')
                .update({ pinverified: verified })
                .eq('treeinstanceid', treeInstanceId);

            if (error) {
                throw error;
            }

            // Assuming successful update, you may want to update the local state or trigger a refetch of data
            console.log('Pin verification successful:', data);
            toast.success('Pin verification successful:');
        } catch (error) {
            console.error('Error verifying pin:', error.message);
            toast.error('pin verification error')
        }
    };


    const filteredData = Object.entries(pinData)
        .filter(([treeinstanceid, details]) => {
            if (!details) return false;
            console.log('speciesid:', treeinstanceid);
            console.log('details:', details);
            const searchTermRegex = new RegExp(searchTerm, 'i');
            return (
                searchTermRegex.test(details.speciesid) ||
                searchTermRegex.test(details.planteename) ||
                searchTermRegex.test(details.status) ||
                searchTermRegex.test(details.pinverified)
            );
        });


    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentData = filteredData.slice(firstIndex, lastIndex);

    const totalPageCount = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="App">
            <Sidebar />
            
                <section className='userlist-section'>
                    <div className="container"><br /><br /><br />
                        <h2 className='overview13'>Pins:</h2>
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
                                                <th>Species ID</th>
                                                <th className="d-none d-md-table-cell">latitude</th>
                                                <th className="d-none d-md-table-cell">Longitude</th>
                                                <th className="d-none d-md-table-cell">Planter Name</th>
                                                <th className="d-none d-md-table-cell">Date Pinned</th>
                                                <th className="d-none d-md-table-cell">Status</th>
                                                <th className="d-none d-md-table-cell">Verification</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map(([treeinstanceid, data]) => (
                                                <tr key={data.treeinstanceid}>
                                                    <td>{data.treeinstanceid}</td>
                                                    <td>{data.speciesid}</td>
                                                    <td className="d-none d-md-table-cell">{data.latitude}</td>
                                                    <td className="d-none d-md-table-cell ">{data.longitude}</td>
                                                    <td className="d-none d-md-table-cell ">{data.plantername}</td>
                                                    <td className="d-none d-md-table-cell ">{data.dateadded}</td>
                                                    <td className="d-none d-md-table-cell ">{data.status}</td>
                                                    <td className="d-none d-md-table-cell ">{data.pinverified ? "Verified" : "Not Verified"}</td>
                                                    <td>
                                                        <button onClick={() => handleVerify(data.treeinstanceid, true)} disabled={data.pinverified}>
                                                            {!data.pinverified ? "Verify Pin" : "Verified"} </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>


                                <div style={{ display: 'flex', justifyContent: 'center', color: 'black' }}>
                                    <Pagination>
                                        {Array.from({ length: totalPageCount}, (_, index) => (
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

export default AdminPinStatus;
