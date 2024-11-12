import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import infoTreecss from '../styles/infotree.module.css';
import supabase from '../supabase'; // Ensure this points to your initialized Supabase client

const InfoTree = () => {
  const [searchParams] = useSearchParams();
  const treeId = searchParams.get('treeId');
  const [treeInfo, setTreeInfo] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    const fetchTreeData = async () => {
      if (treeId) {
        const { data, error } = await supabase
          .from('treedata')
          .select('*')
          .eq('speciesid', treeId)
          .single();

        if (error) {
          console.error('Error fetching tree info:', error);
          return;
        }

        setTreeInfo(data);
        setThumbnails(data.imgurl || []);
        setSlides([
          {
            content1: (
              <div>
                <h2 className={infoTreecss.nametree} style={{ marginBottom: '30px', fontSize: "50px" }}><strong></strong>{data.name}</h2>
                <p style={{ fontSize: '25px' }}><i><strong>Scientific Name:</strong> {data.scientificname}</i></p>
                <p><strong>Description:</strong> {data.description}</p>
                <p><strong>Other Names:</strong> {data.othernames.join(", ")}</p>
                <p><strong>Tree Cycle:</strong> {data.treecycle}</p>
                <p><strong>Fruiting Months:</strong> {data.fruitingmonths}</p>
                <p><strong>Tree Status:</strong> {data.treestatus}</p>
                <p><strong>Tree Species:</strong> {data.treespecies}</p>
                <p><strong>Fruit Colour:</strong> {data.fruitcolour}</p>
                <p><strong>Pests Identified:</strong> {data.pestidentified.join(", ")}</p>
              </div>
            ),
          },
          {
            content1: (
              <div>
                <h2 className={infoTreecss.nametree} style={{ marginBottom: '30px', fontSize: "50px" }}><strong></strong>{data.name}</h2>
                <h2>Flowering Description</h2>
                <p><strong></strong> {data.floweringdescription}</p>
              </div>
            ),
          },
          {
            content1: (
              <div>
                <h2 className={infoTreecss.nametree} style={{ marginBottom: '30px', fontSize: "50px" }}><strong></strong>{data.name}</h2>
                <h2>Fruiting Description</h2>
                <p><strong></strong> {data.fruitingdescription}</p>
              </div>
            ),
          },
          {
            content1: (
              <div>
                <h2 className={infoTreecss.nametree} style={{ marginBottom: '30px', fontSize: "50px" }}><strong></strong>{data.name}</h2>
                <h2>Unripe Fruit Description</h2>
                <p><strong></strong> {data.unripefruitdescription}</p>
              </div>
            ),
          },
          {
            content1: (
              <div>
                <h2 className={infoTreecss.nametree} style={{ marginBottom: '30px', fontSize: "50px" }}><strong></strong>{data.name}</h2>
                <h2>Ripe Fruit Description</h2>
                <p><strong></strong> {data.ripefruitdescription}</p>
              </div>
            ),
          },
        ]);
      }
    };

    fetchTreeData();
  }, [treeId]);

  const handleNext = () => {
    setActiveSlideIndex((prevIndex) => (prevIndex + 1) % (thumbnails.length || 1));
  };

  const handlePrev = () => {
    setActiveSlideIndex((prevIndex) => (prevIndex - 1 + (thumbnails.length || 1)) % (thumbnails.length || 1));
  };

  if (!treeInfo) {
    return <Container>Loading...</Container>;
  }

  return (
    <>

      <div className={infoTreecss.infotreepage}>

        <Row>
          <Col md={7} sm={12} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className={infoTreecss.content2} style={{ justifyContent: 'center', alignItems: 'center' }}>
              <h2>{slides[activeSlideIndex] && slides[activeSlideIndex].title}</h2>
              <p className={infoTreecss.paradescrip}>{slides[activeSlideIndex] && slides[activeSlideIndex].content1}</p>
            </div>

          </Col>
          <Col md={4} sm={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2%' }}>
            <div className={infoTreecss.arrows} id={infoTreecss.arrowinfo}>
              <Button variant="secondary" onClick={handlePrev}>{'<'}</Button>
              <Button variant="secondary" onClick={handleNext}>{'>'}</Button>

              <div className={infoTreecss.sliderBg}><img src={thumbnails[activeSlideIndex]} alt="Slide" style={{ width: '100%', height: '530px', objectFit: 'cover', maxHeight: '70vh', borderRadius: '5%' }} />
              </div></div>
          </Col>
        </Row>
        <Row>
          <a href='/' style={{textAlign:'center'}}>View Map</a>
        </Row>

      </div>
    </>
  );
};

export default InfoTree;
