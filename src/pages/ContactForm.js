import React, { useState } from 'react';
import '../styles/contactform.css';
import NavigationBar from "../components/NavigationBar";
import Faqs from "../components/Faqs";
import Footer from "../components/Footer";

const ContactForm = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [subject, setSubject] = useState();
    const [message, setMessage] = useState();

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log(`${name}`);
        console.log(`${email}`);
        console.log(`${subject}`);
        console.log(`${message}`);

        window.Email.send({
            SecureToken: 'ce3c897b-99bb-4069-b0b6-94981721ce74',
            To: 'arboreatrix@outlook.com ',
            From: 'arboreatrix-smtp@outlook.com',
            Subject: subject,
            Body: `Name: ${name} <br/>  User Email: ${email} <br/> Message ${message}`
        }).then(
            message => alert(message)
        );
        document.getElementById("conform").reset();
    }


    return (
        <>
            <NavigationBar />
            <section className="contact-form">
                <h1 className="heading">Contact Us</h1>
                <p className="para">Thank you for visiting our website! We value your feedback and inquiries. Please feel free to get in touch with us using the contact information provided below.</p>

                <div className="contactForm">
                    <form id='conform' onSubmit={handleSubmit}>
                        <h1 className="sub-heading">Need Support !</h1>
                        <p className="para para2">Contact us for a quote, help to join them.</p>
                        <input type="text" className="input" placeholder="your name" required onChange={e => setName(e.target.value)} />
                        <input type="text" className="input" placeholder="your email" required onChange={e => setEmail(e.target.value)} />
                        <input type="text" className="input" placeholder="your Subject" required onChange={e => setSubject(e.target.value)} />
                        <textarea className="input" cols="30" rows="5" placeholder="Your message..." required onChange={e => setMessage(e.target.value)}></textarea>
                        <input type="submit" className="input submit" value="Send Message" />
                    </form>

                    <div className="map-container">
                        <div className="mapBg"></div>
                        <div className="map">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.2375786801704!2d121.44594287561249!3d14.41346348162992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397f02b40f56581%3A0x4ef849bbf26fa3dd!2sLaguna%20State%20Polytechnic%20University%20-%20Siniloan%20(Host)%20Campus!5e0!3m2!1sen!2sph!4v1710083470519!5m2!1sen!2sph" width="600" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                        </div>
                    </div>
                </div>

                <div className="contactMethod">
                    <div className="method">
                        <i className="fa-solid fa-location-dot contactIcon"></i>
                        <article className="text">
                            <h1 className="sub-heading">Location</h1>
                            <p className="para">CC7X+9CJ, L. de Leon Street, Siniloan, 4019 Laguna</p>
                        </article>
                    </div>

                    <div className="method">
                        <i className="fa-solid fa-envelope contactIcon"></i>
                        <article className="text">
                            <h1 className="sub-heading">Email</h1>
                            <p className="para">Email: arboreatrix@outlook.com</p>
                        </article>
                    </div>

                    <div className="method">
                        <i className="fa-solid fa-phone contactIcon"></i>
                        <article className="text">
                            <h1 className="sub-heading">Phone</h1>
                            <p className="para">+63-912-214-9381</p>
                        </article>
                    </div>
                </div>
            </section>
            {/* Faqs Section */}
            <div className='faqss'>
                <Faqs />
            </div>

            {/* Footer Section */}
            <footer>
                <Footer />
            </footer>
        </>
    );
};

export default ContactForm;
