import React, { useRef, useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { Container, Table, Form, Pagination } from 'react-bootstrap';
import supabase from '../supabase';

const AdminDashboard = () => {
    const [treeData, setTreeData] = useState({});
    const [selectedTreeForQR, setSelectedTreeForQR] = useState(null);
    const qrRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase.from('treedata').select('*');
                if (error) {
                    throw error;
                }
                setTreeData(data);
            } catch (error) {
                console.error('Error fetching tree data:', error.message);
            }
        };
        fetchData();
    }, []);

    const handleQRCodeGenerate = (treeId) => {
        const qrValue = `${window.location.origin}/#/TreeInfo?treeId=${treeId}`;
        setSelectedTreeForQR(qrValue);
    };


    const downloadQRCode = () => {
        const svg = qrRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const svgSize = svg.getBoundingClientRect();
        canvas.width = svgSize.width;
        canvas.height = svgSize.height;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            context.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `qrcode.png`;
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };


    const filteredData = Object.entries(treeData)
        .filter(([speciesid, details]) => {
            if (!details) return false;
            console.log('speciesid:', speciesid);
            console.log('details:', details);
            const searchTermRegex = new RegExp(searchTerm, 'i');
            return (
                searchTermRegex.test(details.speciesid) ||
                searchTermRegex.test(details.name) ||
                searchTermRegex.test(details.scientificname) ||
                searchTermRegex.test(details.description)
            );
        });


    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const currentData = filteredData.slice(firstIndex, lastIndex);

    const totalPageCount = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <Container>
            <div className="container"><br /><br /><br />
                <h2 className='overview13'>Tree Data</h2>
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
                                        <th>Name</th>
                                        <th className="d-none d-md-table-cell">Scientific Name</th>
                                        <th className="d-none d-md-table-cell">Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentData.map(([speciesid, data]) => (
                                        <tr key={data.speciesid}>
                                            <td>{data.speciesid}</td>
                                            <td>{data.name}</td>
                                            <td className="d-none d-md-table-cell">{data.scientificname}</td>
                                            <td className="d-none d-md-table-cell ">{data.description}</td>
                                            <td>
                                                <button onClick={() => handleQRCodeGenerate(data.speciesid, data.name)}>Generate QR Code</button>
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
                    <div className="col d-flex flex-column align-items-center">
                        {selectedTreeForQR && (
                            <div className='card1 text-center'>
                                <div className='qr' ref={qrRef}>
                                    <QRCode value={selectedTreeForQR} />
                                </div>
                                <div>

                                    <button className='btn-secondary' onClick={downloadQRCode}> <i className='fa-solid fa-download' /> Save as PNG</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default AdminDashboard;
