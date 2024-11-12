import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Container, Image, Dropdown, DropdownButton, Modal, Button, Form } from 'react-bootstrap';
import supabase from '../../supabase';
import NavigationBar from '../../components/NavigationBar';
import { useAuth } from '../../AuthContext';
import RichTextEditor from './RichTextEditor';
import 'react-quill/dist/quill.snow.css';


const BlogPost = () => {
    const [searchParams] = useSearchParams();
    const postId = searchParams.get('postId');
    const [blogPostData, setBlogPostData] = useState(null);
    const [showModal, setShowModal] = useState(false);


    const { role, uid } = useAuth();

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const { data: blogData, error } = await supabase
                    .from('blogpostss')
                    .select('*')
                    .eq('id', postId)
                    .single();

                if (error) throw error;
                setBlogPostData(blogData);
            } catch (error) {
                console.error('Error fetching blog post data:', error.message);
            }
        };

        fetchPostData();
    }, [postId]);

    // Handler for showing the edit modal
    const handleShowModal = () => setShowModal(true);
    // Handler for closing the edit modal
    const handleCloseModal = () => setShowModal(false);

    // This state will hold the form values for editing
    const [editFormData, setEditFormData] = useState({
        title: '',
        content: '',
    });

    // This effect will pre-fill the form when the data is fetched
    useEffect(() => {
        if (blogPostData) {
            setEditFormData({
                title: blogPostData.title,
                content: blogPostData.content,
            });
        }
    }, [blogPostData]);

    // Handle form value changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handler for the Save changes action in the modal
    const handleSaveChanges = async () => {
        try {
            const { data, error } = await supabase
                .from('blogpostss')
                .update({
                    title: editFormData.title,
                    content: editFormData.content,
                })
                .match({ id: postId });

            if (error) throw error;

            setBlogPostData({ ...data[0] });

            // Close the modal
            handleCloseModal();
        } catch (error) {
            console.error('Error updating blog post:', error.message);
        }
    };

    // Handler for the Delete action
    const handleDelete = async () => {
        const confirm = window.confirm('Are you sure you want to delete this post?');
        if (confirm) {
            try {
                const { error } = await supabase
                    .from('blogpostss')
                    .delete()
                    .match({ id: postId });

                if (error) throw error;

                // Handle what happens after a successful deletion.
                // For example, you might want to redirect to the home page:
                // history.push('/');
            } catch (error) {
                console.error('Error deleting blog post:', error.message);
            }
        }
    };

    if (!blogPostData) {
        return <Container>Loading...</Container>;
    }
    // Define your inline styles here
    const cardContainerStyle = {
        backgroundColor: '#fff', // Restoring the white card background
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' // Simple box-shadow for card effect
    };


    const blogContentContainerStyle = {
        textAlign: 'center',
    };

    // Inline styles for the image container
    const imageContainerStyle = {
        marginRight: '20px', // Add some space between the image and the text
        marginBottom: '1rem', // Space below the image
        flexShrink: 0, // Prevent the image from shrinking
    };


    const blogContentStyle = {
        fontSize: '1rem',
        lineHeight: '1.6',
        color: '#333',
        overflow: 'auto',
    };

    return (
        <>
            <NavigationBar />
            <br />
            <h2 className="center">Blog Post:</h2>
            <br />

            <Container style={cardContainerStyle}>

                {/* Edit and Delete Dropdown */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    {/* Edit and Delete Dropdown */}
                    {(role === 'admin' || uid === blogPostData.posted_by) && (
                        <DropdownButton id="dropdown-basic-button" title="Options">
                            {(role === 'admin' || uid === blogPostData.posted_by) && (
                                <Dropdown.Item onClick={handleDelete}>Delete Post</Dropdown.Item>
                            )}
                            {uid === blogPostData.posted_by && (
                                <Dropdown.Item onClick={handleShowModal}>Edit Post</Dropdown.Item>
                            )}
                        </DropdownButton>
                    )}
                    <Link to={`/BlogSlider`} className="button_view" role="button">Back</Link>
                </div>
                <div style={imageContainerStyle}>
                    <img src={blogPostData.imgurl} alt="Blog Post" style={{ width: '100%', height: 'auto', borderRadius: '5px' }} />
                </div>
                <div style={blogContentContainerStyle}>
                    <h1>{blogPostData.title}</h1>
                    <p>
                        Posted by {blogPostData.name} on {new Date(blogPostData.created_at).toLocaleDateString()}
                    </p>
                    <div style={blogContentStyle} dangerouslySetInnerHTML={{ __html: blogPostData.content }}>
                    </div>
                </div>


                {/* Edit Post Modal */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Blog Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="blogPostTitle">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    name="title"
                                    value={editFormData.title}
                                    onChange={handleFormChange}
                                    style={{ width: '100%' }}
                                />
                            </Form.Group>
                            <Form.Group controlId="blogPostContent">
                                <Form.Label>Content</Form.Label>
                                <RichTextEditor
                                    value={editFormData.content}
                                    onContentChange={(content) =>
                                        setEditFormData((prev) => ({ ...prev, content }))
                                    }
                                />

                            </Form.Group>
                            {/* Add more fields as needed */}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveChanges}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>

        </>
    );
};

export default BlogPost;