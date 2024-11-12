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
import BlogModal from './BlogModal'

function BlogForm() {
    const [postId, setPostId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pic, setPic] = useState(null);
    const [index, setIndex] = useState(0);
    const [error, setError] = useState('');
    const { user, uid } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [blogPostData, setBlogPostData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            setIsLoading(true);
            try {
                let { data: blogData, error } = await supabase
                    .from('blogpostss')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setBlogPostData(blogData);
            } catch (error) {
                setError(error.message);
                toast.error(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    useEffect(() => {
        const truncateText = (selector, maxLength) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element) => {
                const truncated = element.textContent.trim().substr(0, maxLength);
                element.textContent = truncated + '...';
            });
        };
        truncateText('.truncate-text', 50);
    }, [blogPostData]);

    const truncate = (text, maxLength) => {
        return text.length > maxLength ? text.substr(0, maxLength - 3) + '...' : text;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!user) {
            toast.error('Not authorized! Please sign in first...');
            return;
        }
    
        setIsLoading(true);
    
        try {
            const { count, error: countError } = await supabase.from('blogpostss').select('*', { count: 'exact' });
    
            if (countError) {
                throw new Error(`Error fetching post count: ${countError.message}`);
            }
    
            let newPostId = `BLG_${String(count + 1).padStart(7, '0')}`;
            setPostId(newPostId);
    
            let imgUrl = null;
            if (pic) {
                const fileExt = pic.name.split('.').pop();
                const fileName = `${newPostId}.${fileExt}`;
                const { data, error: uploadError } = await supabase.storage
                    .from('blog-imgs')
                    .upload(fileName, pic, { upsert: true });
    
                if (uploadError) {
                    throw new Error(uploadError.message);
                }
    
                imgUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/blog-imgs/${fileName}`;
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
    
            const { error: insertError } = await supabase.from('blogpostss').insert([postData]);
    
            if (insertError) {
                throw new Error(`Error submitting post: ${insertError.message}`);
            }
    
            toast.success('Blog post submitted successfully!');
            setPostId('');
            setName('');
            setEmail('');
            setTitle('');
            setDescription('');
            setPic(null);
        } catch (error) {
            setError(error.message);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        const fetchBlogPosts = async () => {
            setIsLoading(true);
            try {
                let { data: blogData, error } = await supabase
                    .from('blogpostss')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                setBlogPostData(blogData);
            } catch (error) {
                setError(error.message);
                toast.error(`Error: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogPosts();
    }, []);

    const handleFileChange = (e) => {
        setPic(e.target.files[0]);
    };

    const handleRichTextChange = (content) => {
        setDescription(content);
    };

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const chunkArray = (array, size) => {
        const chunkedArr = [];
        for (let i = 0; i < array.length; i += size) {
            chunkedArr.push(array.slice(i, i + size));
        }
        return chunkedArr;
    };

    const blogPostChunks = chunkArray(blogPostData, 3);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <>
            <div className={blogformcss.carousel} style={{ position: 'relative' }}>
                <h2 className="center">Blog Posts:</h2>
                            <div className="d-flex justify-content-end align-items-end" style={{marginRight: '15%' }}>
                                <Button variant="primary" onClick={handleShowModal}>Post a blog</Button>
                            </div>
                <Carousel activeIndex={index} onSelect={handleSelect}>
                    {blogPostChunks.map((chunk, chunkIndex) => (
                        <Carousel.Item key={chunkIndex}>
                            <div className={blogformcss.carouselInner}>
                                {chunk.map((post) => (
                                    <div className={blogformcss.card} key={post.id}>
                                        <img className={blogformcss.carouselImg} src={post.imgurl} alt={post.title} />
                                        <div className={blogformcss.cardBody}>
                                            <h3>{post.title}</h3>
                                            <p>Posted by: {post.name}</p>
                                            <p className='truncate-text'>{truncate(post.content, 30)}</p>
                                            <Link to={`/BlogPost?postId=${post.id}`} className="button_view" role="button">Read More</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            <br /><br /><br />




            <BlogModal
                show={showModal}
                handleClose={handleCloseModal}
                handleSubmit={handleSubmit}
            />

            {error && <p className="error">{error}</p>}
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </>
    );
}

export default BlogForm;
