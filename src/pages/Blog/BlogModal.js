import React, { useState, useEffect } from 'react';
import blogformcss from './blogform.module.css';
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import { useAuth } from '../../AuthContext';
import supabase from '../../supabase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RichTextEditor from './RichTextEditor';
import { Card, Container, Image, Dropdown, DropdownButton, Modal, Button, Form } from 'react-bootstrap';

function BlogModal({ show, handleClose }) {
    const [postId, setPostId] = useState('');
    const [error, setError] = useState('');
    const { user, uid } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pic, setPic] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!user) {
            toast.error('Not authorized! Please sign in first...');
            return;
        }

        const { count, error: countError } = await supabase.from('blogpostss').select('*', { count: 'exact' });

        if (countError) {
            toast.error(`Error fetching post count: ${countError.message}`);
            setError(countError.message);
            return;
        }

        let newPostId = `BLG_${String(count + 1).padStart(7, '0')}`;
        setPostId(newPostId);

        let imgUrl = null;
        if (pic) {
            try {
                const fileExt = pic.name.split('.').pop();
                const fileName = `${newPostId}.${fileExt}`;
                const { data, error: uploadError } = await supabase.storage
                    .from('blog-imgs')
                    .upload(fileName, pic, { upsert: true });

                if (uploadError) {
                    throw uploadError;
                }

                imgUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/blog-imgs/${fileName}`;
            } catch (error) {
                setError(error.message);
                return;
            }
        }

        const currentTime = new Date().toISOString();
        const postData = {
            id: newPostId,
            imgurl: imgUrl,
            name,
            email,
            title,
            content: description,
            created_at: currentTime,
            posted_by: uid
        };

        const { error } = await supabase.from('blogpostss').insert([postData]);

        if (error) {
            toast.error(`Error submitting post: ${error.message}`);
            setError(error.message);
        } else {
            toast.success('Blog post submitted successfully!');
            setPostId('');
            setName('');
            setEmail('');
            setTitle('');
            setDescription('');
            setPic(null);
        }
    };

    const handleFileChange = (e) => {
        setPic(e.target.files[0]);
    };

    const handleRichTextChange = (content) => {
        setDescription(content);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Submit a Blog</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h2 className="center">Submit a Blog:</h2>
            <div className={blogformcss.container}>
                <form id={blogformcss.myForm} onSubmit={handleSubmit}>
                    <div className="form-group" style={{ width: '90%' }}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ width: '90%' }}>
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ width: '90%' }}>
                        <label htmlFor="title">Title:</label>
                        <input type="text" className="form-control" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group" style={{ width: '90%' }}>
                        <label htmlFor="description">Description:</label>
                        <RichTextEditor onContentChange={handleRichTextChange} />
                    </div>
                    <div className="form-group" style={{ width: '90%', marginTop: '20px' }}>
                        <label htmlFor="file">Upload File:</label>
                        <input type="file" className="form-control-file" name="pic" accept="image/*" id="file" onChange={handleFileChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>

            {error && <p className="error">{error}</p>}
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </Modal.Body>
        </Modal>
    );
}

export default BlogModal;
