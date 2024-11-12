import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, Row, Col, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import NavigationBar from "../components/NavigationBar";
import aboutCss from '../styles/aboutus.module.css';
import rancapImage from '../images/profile/rancap.jpg';
import bongatImage from '../images/profile/bongat.jpg';
import bolinasImage from '../images/profile/bolinas.jpg';
import hiyasImage from '../images/profile/hiyas.jpg';
import { act } from 'react-dom/test-utils';
import Faqs from "../components/Faqs";
import Footer from "../components/Footer";
import img2 from "../images/indigenousfruittrees.png";
import img3 from "../images/inidigenousforesttrees.png";
import Img1 from "../images/arboreatrix.png";
import Img2 from "../images/lspu-siniloan.png";
import Img3 from "../images/lspu-rde.png";
import Img4 from "../images/maamcel.png"

const initialSlides = [
  {
    img: Img1,
    author: "",
    title: "ARBOREATRIX",
    topic: "WEB-BASED PLATFORM",
    des: "Arboreatrix, a research with LSPU-Siniloan Campus, is a pioneering Geographic Information System (GIS) merging with QR technology to map indigenous fruit and forest trees. Every tree is labeled with a unique QR code, allowing users to scan for essential details such as species, status, and content. This innovative approach not only enhances conservation efforts but also promotes community engagement and awareness in preserving our rich natural heritage.",
    popup: "popupcontent1"
  },
  {
    img: Img2,
    author: "",
    title: "FOUNDER",
    topic: "LAGUNA STATE POLYTECHNIC UNIVERSITY",
    des: "Laguna State Polytechnic University - Siniloan (LSPU - Siniloan) is a public satellite campus part of the Laguna State Polytechnic University system. The campus is considered as the university's host campus and has other satellite campuses located in the towns of Lopez, Magdalena, and Nagcarlan. The Siniloan campus provides undergraduate programs in the fields of Agriculture, Arts and Sciences, Criminal Justice Education, Computer Studies, Hospitality Management and Tourism, Business Administration, Accountancy, and Teacher Education. Graduate and post-graduate programs in Agriculture and Teacher Education are also available for its students.",
    popup: "popupcontent2"
  },
  {
    img: Img3,
    author: "",
    title: "RESEARCH EXTENSION",
    topic: "RESEARCH DEVELOPMENT",
    des: "Our research development initiative drives innovation through strategic planning, interdisciplinary collaboration, and cutting-edge technologies. We bring together experts, leverage partnerships, and uphold ethical standards to generate new knowledge and create impactful solutions for society.",
    popup: "popupcontent3"
  },
  {
    img: Img4,
    author: "",
    title: "RESEARCH EXTENTIONIST",
    topic: "MS. MA. CECILIA GATBONTON",
    des: "Ms. Ma. Cecilia Gatbonton is a dedicated research enthusiast on the Arboreatrix platform, exploring the fascinating world of trees. With curiosity and dedication, she learns about different tree species, their habitats, and why they matter. Ms. Gatbonton enjoys sharing her findings with others on Arboreatrix, sparking conversations and connecting with fellow tree enthusiasts. She's a valuable member of the community, inspiring others to appreciate and protect our arboreal ecosystems.",
    popup: "popupcontent4"
  }
];

const seeMoreBtns = document.querySelectorAll(".seeMoreBtn");
const popups = document.querySelectorAll(".popup");

seeMoreBtns.forEach((button, index) => {
  button.addEventListener("click", function () {
    popups.forEach(popup => {
      popup.style.display = "none";
    });
    const popupId = this.getAttribute("data-popup");
    document.getElementById(popupId).style.display = "block";
  });
});

const closeButtons = document.querySelectorAll(".popup-close");
closeButtons.forEach(button => {
  button.addEventListener("click", function () {
    this.parentNode.style.display = "none";
  });
});


const AboutUs = () => {
  const [currentPopup, setCurrentPopup] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const showPopup = (popupId) => setCurrentPopup(popupId);
  const closePopup = () => setCurrentPopup(null);

  const switchSlides = (direction) => {
    let newIndex = 0;
    if (direction === 'next') {
      newIndex = (activeIndex + 1) % initialSlides.length;
    } else if (direction === 'prev') {
      newIndex = (activeIndex - 1 + initialSlides.length) % initialSlides.length;
    }
    setActiveIndex(newIndex);
  };

  useEffect(() => {
    const timer = setTimeout(() => switchSlides('next'), 7000);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <>
      <NavigationBar />
      <Row>
        <Col xs={12} md={7}>
          <div className={aboutCss.carousel}>
            <div className={aboutCss.list1}>
              {initialSlides.map((slide, index) => (
                <div className={`${aboutCss.item} ${index === activeIndex ? aboutCss.active : ''}`} key={index}>
                  <img src={slide.img} alt={`Slide ${index + 1}`} />
                  <div className={aboutCss.content}>
                    {slide.author && <div className="author">{slide.author}</div>}
                    <div className={aboutCss.title}>{slide.title}</div>
                    <div className={aboutCss.topic}>{slide.topic}</div>
                    <div className={aboutCss.des}>{slide.des}</div>
                    <div className={aboutCss.buttons}>
                      <button className="seeMoreBtn" onClick={() => showPopup(slide.popup)}>SEE MORE</button>
                    </div><br />
                    <div className={aboutCss.arrows} id={aboutCss.arrowabout}>
                      <Button variant="prev" onClick={() => switchSlides('prev')}>{'<'}</Button>
                      <Button variant="next" onClick={() => switchSlides('next')}>{'>'}</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>

        <Col xs={12} md={5}>
          <Row></Row>
          <Row>
            <div className={aboutCss.thumbnail} id={aboutCss.thumbnailabout}>
              {initialSlides.map((slide, index) => (
                <div
                  key={slide.title}
                  className={`${aboutCss.item} ${index === activeIndex ? aboutCss.active : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img src={slide.img} alt={`Thumbnail ${index + 1}`} />
                  <div className={aboutCss.content}>
                    <div className={aboutCss.title}>{slide.title}</div>
                    <div id={aboutCss.description}>{slide.topic}</div>
                  </div>
                </div>
              ))}
            </div></Row>
        </Col>
      </Row>
      <div className={aboutCss.time}></div>

      <div id={aboutCss.popupcontent1} className={`${aboutCss.popup} ${currentPopup === aboutCss.popupcontent1 ? 'active' : ''}`}>
        <span className={aboutCss.popupClose} onClick={closePopup}>&times;</span>
        <h2>Additional Information 1</h2>
        <p>This is some additional information for the first popup.</p>
        <p>lalala</p>
      </div>
      <div id={aboutCss.popupcontent2} className={`${aboutCss.popup} ${currentPopup === aboutCss.popupcontent2 ? 'active' : ''}`}>
        <span className={aboutCss.popupClose} onClick={closePopup}>&times;</span>
        <h2>Additional Information 1</h2>
        <p>This is some additional information for the first popup.</p>
        <p>test2</p>
      </div>
      <div id={aboutCss.popupcontent3} className={`${aboutCss.popup} ${currentPopup === aboutCss.popupcontent3 ? 'active' : ''}`}>
        <span className={aboutCss.popupClose} onClick={closePopup}>&times;</span>
        <h2>Additional Information 1</h2>
        <p>This is some additional information for the first popup.</p>
        <p>test 3</p>
      </div>
      <div id={aboutCss.popupcontent4} className={`${aboutCss.popup} ${currentPopup === aboutCss.popupcontent4 ? 'active' : ''}`}>
        <span className={aboutCss.popupClose} onClick={closePopup}>&times;</span>
        <h2>Additional Information 1</h2>
        <p>This is some additional information for the first popup.</p>
        <p>sleep when?</p>

      </div>

      <div className={aboutCss.weAreBlock}>

        <div id={aboutCss.aboutUsSection}>

          <div className={aboutCss.aboutUsImage}>

            <img src={img2} width="808" height="458" alt={"Indigenous Fruit Trees"} />

          </div>

          <div className={aboutCss.aboutUsInfo}>

            <h2>Indigeneous Fruit Trees</h2>

            <p>The Philippines, an archipelago renowned for its rich biodiversity, is home to a myriad of indigenous fruit trees that are both ecologically and culturally significant.
              Among these, the Philippine mango, particularly the Carabao variety, stands out for its sweetness and global recognition. The delicate, sweet-tart lanzones, especially abundant in Laguna, and the visually striking, juicy rambutan are local favorites. The durian, known as the "king of fruits" for its strong odor and creamy flesh, is especially prized in Mindanao. Duhat, or Java plum, with its sweet-tangy taste. </p>


          </div>

        </div>

        <div id={aboutCss.historySection}>

          <div className={aboutCss.historyImage}>

            <img src={img3} width="951" height="471" alt={"Indiigenous Forest Trees"} />

          </div>

          <div className={aboutCss.historyInfo}>

            <h2>Indigeneous Forest Trees</h2>

            <p>The indigenous forests of the Philippines are home to towering dipterocarps like Narra and Yakal, alongside vibrant Banaba trees and dense Kamagong. Aromatic Almaciga and sprawling Balete add to the rich tapestry of life. These trees sustain ecosystems and hold cultural significance, making their preservation vital for the country's natural heritage.</p>

          </div>

        </div>
        <div className={aboutCss.center}>
          <div className={aboutCss.team}>
            <h2 style={{ marginBottom: '100px' }}>Our Team</h2>
            <div className={aboutCss.profiles}>
              <div className={aboutCss.profile}>
                <div className={aboutCss.card}>
                  <div className={aboutCss.head}>
                    <img src={rancapImage} alt="" />
                    <div className={aboutCss.name}>Sharlyn Rancap</div>
                  </div>
                  <div className={aboutCss.content}>
                    <div className={aboutCss.role}>Team Leader</div>
                    She oversees the project progress, design the system user interface and communicate with the supervisors.
                  </div>
                  <div className={aboutCss.icons}>
                    <a href=""><i className="fa-brands fa-linkedin"></i></a>
                    <a href=""><i className="fa-brands fa-github"></i></a>
                    <a href=""><i className="fa-solid fa-envelope"></i></a>
                  </div>
                </div>

                <img src={rancapImage} alt="" id={aboutCss.picture} />
                <div className={aboutCss.details}>
                  Sharlyn Rancap
                  <span>Team Leader</span>
                </div>
              </div>

              <div className={aboutCss.profile}>
                <div className={aboutCss.card}>
                  <div className={aboutCss.head}>
                    <img src={bongatImage} alt="" />
                    <div className={aboutCss.name}>Antonio Nicholo Bongat</div>
                  </div>
                  <div className={aboutCss.content}>
                    <div className={aboutCss.role}>Programmer</div>
                    He is the programmer in-charged in coding and implementing technical aspects  of the system.
                  </div>
                  <div className={aboutCss.icons}>
                    <a href="https://www.linkedin.com/in/nicholo-bongat-b80920225/"><i className="fa-brands fa-linkedin"></i></a>
                    <a href="https://github.com/Nikoru14"><i className="fa-brands fa-github"></i></a>
                    <a href="nicholosantosbongat@gmail.com"><i className="fa-solid fa-envelope"></i></a>
                  </div>
                  <div className={aboutCss.pattern}></div>
                </div>
                <img src={bongatImage} alt="" id={aboutCss.picture} />
                <div className={aboutCss.details}>
                  Antonio Nicholo Bongat
                  <span>Programmer</span>
                </div>
              </div>

              <div className={aboutCss.profile}>
                <div className={aboutCss.card}>
                  <div className={aboutCss.head}>
                    <img src={bolinasImage} alt="" />
                    <div className={aboutCss.name}>Symon Christopher Bolinas</div>
                  </div>
                  <div className={aboutCss.content}>
                    <div className={aboutCss.role}>Graphics</div>
                    He is in-charged in designing user interface, branding elements and image embedded on the system.
                  </div>
                  <div className={aboutCss.icons}>
                    <a href=""><i className="fa-brands fa-linkedin"></i></a>
                    <a href=""><i className="fa-brands fa-github"></i></a>
                    <a href=""><i className="fa-solid fa-envelope"></i></a>
                  </div>
                  <div className={aboutCss.pattern}></div>
                </div>
                <img src={bolinasImage} alt="" id="picture" />
                <div className={aboutCss.details}>
                  Symon Christopher Bolinas
                  <span>Graphics</span>
                </div>
              </div>

              <div className={aboutCss.profile}>
                <div className={aboutCss.card}>
                  <div className={aboutCss.head}>
                    <img src={hiyasImage} alt="" />
                    <div className={aboutCss.name}>Sonny Boy Hiyas</div>
                  </div>
                  <div className={aboutCss.content}>
                    <div className={aboutCss.role}>Data Collection</div>
                    He is in-charged in data gathering and managing data for integration of information in the system content.
                  </div>
                  <div className={aboutCss.icons}>
                    <a href=""><i className="fa-brands fa-linkedin"></i></a>
                    <a href=""><i className="fa-brands fa-github"></i></a>
                    <a href=""><i className="fa-solid fa-envelope"></i></a>
                  </div>
                  <div className={aboutCss.pattern}></div>
                </div>
                <img src={hiyasImage} alt="" id={aboutCss.picture} />
                <div className={aboutCss.details}>
                  Sonny Boy Hiyas
                  <span>Data Collection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Faqs Section */}
        <div className={aboutCss.faqss}>
          <Faqs />
        </div><br /><br /><br />
        {/* Footer Section */}
        <footer>
          <Footer />
        </footer>
      </div>


    </>
  );
};

export default AboutUs;
