import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import Sidebar from '../adminside/Sidebar';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
import AdminDashboard from '../pages/AdminDashboard';
import supabase from '../supabase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TreeForm from './TreeForm';

function Tree() {
    const [treeNames, setTreeNames] = useState([]);
    const [selectedTree, setSelectedTree] = useState('');
    const [treeId, setTreeId] = useState('');
    const [imagesToUpload, setImagesToUpload] = useState({
        treeImage: null,
        floweringImage: null,
        fruitingImage: null,
        unripeFruitImage: null,
        ripeFruitImage: null
    });
    const [error, setError] = useState();
    const [currentImages, setCurrentImages] = useState([]);
    const getImageLabel = (index) => {
        switch (index) {
            case 0:
                return 'Tree Image';
            case 1:
                return 'Flowering Image';
            case 2:
                return 'Fruiting Image';
            case 3:
                return 'Unripe Fruit Image';
            case 4:
                return 'Ripe Fruit Image';
            default:
                return `Image ${index + 1}`;
        }
    };

    useEffect(() => {
        fetchTreeNames();
    }, []);

    const fetchTreeNames = async () => {
        try {
            const { data, error } = await supabase.from('treedata').select('speciesid, name');
            if (error) throw error;
            const mappedTreeNames = data.map(tree => ({ speciesid: tree.speciesid, name: tree.name }));
            setTreeNames(mappedTreeNames);
        } catch (error) {
            console.error('Error fetching tree names:', error.message);
        }
    };

    const handleTreeSelect = (e) => {
        const selectedTreeId = e.target.value;
        const treeName = treeNames.find(tree => tree.speciesid === selectedTreeId)?.name || '';
        setSelectedTree(treeName);
        setTreeId(selectedTreeId);
        fetchCurrentImages(selectedTreeId);
    };

    const fetchCurrentImages = async (selectedTreeId) => {
        try {
            const { data, error } = await supabase
                .from('treedata')
                .select('imgurl')
                .eq('speciesid', selectedTreeId)
                .single();

            if (error) throw error;

            setCurrentImages(data.imgurl || []);
        } catch (error) {
            console.error('Error fetching current images:', error.message);
        }
    };

    const handleImageUpload = async () => {
        try {
            const imageUrlPromises = Object.entries(imagesToUpload).map(async ([type, file]) => {
                if (!file) return null;
                const imageUrl = await uploadImage(file, treeId, type);
                return { type, imageUrl };
            });

            const imageResults = await Promise.all(imageUrlPromises);
            const imageUrls = imageResults.filter(result => result !== null);

            await updateImageUrl(imageUrls, treeId);
            toast.success('Images uploaded successfully!');
        } catch (error) {
            console.error('Error uploading images:', error.message);
            toast.error('Error uploading images. Please try again.');
        }
    };

    const uploadImage = async (file, id, type) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}_${type}.${fileExt}`;
        const filePath = `${id}/${fileName}`;

        const { error } = await supabase.storage
            .from('tree-imgs')
            .upload(filePath, file, { upsert: true });

        if (error) {
            console.error('Error uploading image:', error.message);
            return null;
        }

        return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/tree-imgs/${filePath}`;
    };

    const updateImageUrl = async (imageResults, id) => {
        try {
            const updatedUrls = currentImages;
            imageResults.forEach(({ type, imageUrl }) => {
                switch (type) {
                    case 'treeImage':
                        updatedUrls[0] = imageUrl;
                        break;
                    case 'floweringImage':
                        updatedUrls[1] = imageUrl;
                        break;
                    case 'fruitingImage':
                        updatedUrls[2] = imageUrl;
                        break;
                    case 'unripeFruitImage':
                        updatedUrls[3] = imageUrl;
                        break;
                    case 'ripeFruitImage':
                        updatedUrls[4] = imageUrl;
                        break;
                    default:
                        break;
                }
            });

            const { data, error } = await supabase
                .from('treedata')
                .update({ imgurl: updatedUrls })
                .eq('speciesid', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error updating image URLs in database:', error.message);
        }

        fetchCurrentImages(id);
    };

    return (

        <div className="App">

            <Sidebar />

            <section className="tree-section">
                <br /><br />
                <h1 className="text">Trees</h1>
                <br />
                <TreeForm />
                <hr style={{ marginTop: '5%', border: '10px solid black' }} />
                <h2 className="text-center">Upload Tree Images</h2>
                <Container style={{ backgroundColor: 'white', color: 'black', borderRadius: '25px', padding: '50px' }}>
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Select Tree:</Form.Label>
                                <Form.Control as="select" onChange={handleTreeSelect}>
                                    <option value="">Choose...</option>
                                    {treeNames.map(tree => (
                                        <option key={tree.speciesid} value={tree.speciesid}>{tree.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            {selectedTree && (
                                <div>
                                    <div>
                                        <h3>Upload New Images</h3>
                                        <Form.Group>
                                            <Form.Label>Tree Image:</Form.Label>
                                            <Form.Control type="file" onChange={(e) => setImagesToUpload({ ...imagesToUpload, treeImage: e.target.files[0] })} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Flowering Image:</Form.Label>
                                            <Form.Control type="file" onChange={(e) => setImagesToUpload({ ...imagesToUpload, floweringImage: e.target.files[0] })} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Fruiting Image:</Form.Label>
                                            <Form.Control type="file" onChange={(e) => setImagesToUpload({ ...imagesToUpload, fruitingImage: e.target.files[0] })} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Unripe Fruit Image:</Form.Label>
                                            <Form.Control type="file" onChange={(e) => setImagesToUpload({ ...imagesToUpload, unripeFruitImage: e.target.files[0] })} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Ripe Fruit Image:</Form.Label>
                                            <Form.Control type="file" onChange={(e) => setImagesToUpload({ ...imagesToUpload, ripeFruitImage: e.target.files[0] })} />
                                        </Form.Group>
                                        <Button onClick={handleImageUpload}>Upload Images</Button>
                                    </div>
                                    <div>
                                        <div>
                                            <h3>Current Images for {selectedTree}</h3>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                    {currentImages.map((imageUrl, index) => (
                                                        <div key={index} style={{ marginRight: '10px', marginBottom: '10px' }}>
                                                            <p>{getImageLabel(index)}</p>
                                                            <img src={imageUrl} alt={`Image ${index + 1}`} style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Col>
                    </Row>
                </Container>
                <hr style={{ marginTop: '5%', border: '10px solid black' }} />
                <Container>
                    <AdminDashboard />
                </Container>
                <br /><br />
            </section>
            {error && <p className="error">{error}</p>}
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default Tree;
