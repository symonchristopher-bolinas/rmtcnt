import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import treeInfocss from '../styles/treeinfo.module.css';
import supabase from '../supabase'; 
import NavigationBar from "../components/NavigationBar";
import { Link, NavLink } from 'react-router-dom';

const TreeInfo = () => {
  const [searchParams] = useSearchParams();
  const treeId = searchParams.get('treeId');
  const [treeData, setTreeData] = useState(null);
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

        if (!data) {
          console.error('No data found for the tree ID:', treeId);
          return;
        }

        setTreeData(data);
        setThumbnails(data.imgUrl || []);
        setSlides([{}]);
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

  if (!treeData) {
    return <Container>Loading...</Container>;
  }

  return (
    <>
          <NavigationBar />
        

          <div className={treeInfocss.container}>
          <NavLink 
            to={{ pathname: '/', search: `?treeId=${treeId}` }} 
            className="button_view" 
            role="button"
            style={{
                position: 'absolute',
                top: '2%',
                right: '2%',
            }}>
            View on Map
            </NavLink>
          {treeData.imgurl && treeData.imgurl[0] && (
          <img src={treeData.imgurl[0]} alt="Tree Image" className={treeInfocss.responsive_image} />
        )}


            <div className={treeInfocss.text123}>
              <h2>{treeData.name}<br />({treeData.scientificname})</h2><br />
              <p><strong>Description:</strong> {treeData.description}</p>
              <p><strong>Other Names:</strong> {treeData.othernames.join(", ")}</p>
              <p><strong>Tree Cycle:</strong> {treeData.treecycle}</p>
              <p><strong>Fruiting Months:</strong> {treeData.fruitingmonths}</p>
              <p><strong>Tree Species:</strong> {treeData.treespecies}</p>
              <p><strong>Fruit Colour:</strong> {treeData.fruitcolour}</p>
            </div>
          </div>
          <div className={treeInfocss.treeinfobg}>
          <div className='row' style={{ margin: '2%', padding: '2%' }}>
            <div className='col-12 col-md-6'>
              <div className="card" style={{ textAlign: 'justify', maxWidth: '100%', backgroundColor: 'transparent' }}>
                {treeData.imgurl && treeData.imgurl[0] && (
                  <img src={treeData.imgurl[1]} alt="Tree Image" style={{ maxWidth:'100%', borderRadius:'20px'}}   />
                )}
                <div className="card-body" style={{ textAlign: 'justify', maxWidth: '100%', color: '#fff' }}>
                  <p className="card-text"><strong>Flowering Description:</strong> <br /> <br />{treeData.floweringdescription}</p>
                </div>
              </div>
            </div>

            <div className='col-12 col-md-6'>
              <div className="card" style={{ textAlign: 'justify', maxWidth: '100%', backgroundColor: 'transparent' }}>
                {treeData.imgurl && treeData.imgurl[0] && (
                  <img src={treeData.imgurl[2]} alt="Tree Image" style={{ maxWidth:'100%', borderRadius:'20px'}}  />
                )}
                <div className="card-body" style={{ textAlign: 'justify', maxWidth: '100%', color: '#fff' }}>
                  <p className="card-text"><strong>Fruiting Description:</strong> <br /> <br />{treeData.fruitingdescription}</p>
                </div>
              </div>
            </div>
          </div>

          <div className='row' style={{ margin: '2%', padding: '2%' }}>
            <div className='col-12 col-md-6'>
              <div className="card" style={{ textAlign: 'justify', maxWidth: '100%', backgroundColor: 'transparent' }}>
                {treeData.imgurl && treeData.imgurl[0] && (
                  <img src={treeData.imgurl[3]} alt="Tree Image" style={{ maxWidth:'100%', borderRadius:'20px'}}   />
                )}
                <div className="card-body" style={{ textAlign: 'justify', maxWidth: '100%', color: '#fff' }}>
                  <p className="card-text"><strong>Unripe Fruit Description:</strong> <br /> <br />{treeData.unripefruitdescription}</p>
                </div>
              </div>
            </div>

            <div className='col-12 col-md-6'>
              <div className="card" style={{ textAlign: 'justify', maxWidth: '100%', backgroundColor: 'transparent' }}>
                {treeData.imgurl && treeData.imgurl[0] && (
                  <img src={treeData.imgurl[4]} alt="Tree Image" style={{ maxWidth:'100%', borderRadius:'20px'}}  />
                )}
                <div className="card-body" style={{ textAlign: 'justify', maxWidth: '100%', color: '#fff' }}>
                  <p className="card-text"><strong>Ripe Fruit Description:</strong> <br /> <br />{treeData.ripefruitdescription}</p>
                </div>
              </div>
            </div>
          </div>
          </div>
    </>
  );
};

export default TreeInfo;
