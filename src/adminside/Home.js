import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import MapFilterControls from '../components/MapFilterConrtrols';
import Map from '../components/Map';
import Sidebar from '../adminside/Sidebar';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap';
import Button from 'react-crud-table/build/Button';
import supabase from '../supabase';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/adminhome.css';

function Home() {
    const [searchParams] = useSearchParams();
    const treeId = searchParams.get('treeId');
    const [treeData, setTreeData] = useState(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [slides, setSlides] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);
    const [speciesList, setSpeciesList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState(new Date());
    const [numberOfUsers, setNumberOfUsers] = useState(0);
    const [numberOfPins, setNumberOfPins] = useState(0);
    const [speciesColorMap, setSpeciesColorMap] = useState({});

    useEffect(() => {
        const fetchUserCount = async () => {
            const { data, error } = await supabase
                .from('accounts') // Adjust the table name as per your schema
                .select('id', { count: 'exact' });

            if (error) {
                console.error('Error fetching user count:', error);
                return;
            }

            setNumberOfUsers(data.length);
        };

        const fetchPinsCount = async () => {
            let pinsQuery = supabase.from('treepins').select('treeinstanceid', { count: 'exact' });

            if (treeId) {
                pinsQuery = pinsQuery.eq('speciesid', treeId);
            }

            const { count, error } = await pinsQuery;

            if (error) {
                console.error('Error fetching pins count:', error);
                return;
            }

            setNumberOfPins(count);
        };


        fetchUserCount();
        fetchPinsCount();
    }, [treeId, numberOfPins]);

    const navigate = useNavigate();

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

        const fetchSpeciesList = async () => {
            const { data, error } = await supabase
                .from('treedata')
                .select('speciesid, name')
                .order('name');

            if (error) {
                console.error('Error fetching species list:', error);
                return;
            }

            if (data) {
                setSpeciesList(data);
            }
        };

        fetchTreeData();
        fetchSpeciesList();
    }, [treeId]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredSpecies = speciesList.filter(species =>
        species.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const fetchSpeciesColorMap = async () => {
            const { data, error } = await supabase
                .from('treedata')
                .select('speciesid, color')
                .order('speciesid');

            if (error) {
                console.error('Error fetching species color map:', error);
                return;
            }

            const colorMap = data.reduce((acc, item) => {
                acc[item.speciesid] = item.color;
                return acc;
            }, {});

            setSpeciesColorMap(colorMap);
        };

        fetchSpeciesColorMap();
    }, []);

    return (
            <div className="App">
                <Sidebar />
                <section className="tree-section">
                    <br />
                    <br />
                    <Row>
                        <Col md={10}>
                            {/* Map Section */}
                            <div className='mapContainerAdminMap'>
                                <Map />
                            </div>
                        </Col>
                        <Col md={2}><br /><br /><br /><br />
                            <div>
                                <Row>
                                    <Col md={1}></Col>
                                    <Col md={10}>
                                        <Link href={`/Home`} className="submitbtnadminmap" style={{ textDecoration: 'none', color: 'black' }}>View All Pins</Link>
                                    </Col>
                                    <Col md={1}></Col>
                                </Row>
                                <br />
                                <Row>
                                </Row>
                                <br />
                                <Form>
                                    <FormControl
                                        type="text"
                                        placeholder="Search species"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                    />
                                </Form>
                                <Row style={{ padding: '5%', textAlign: 'center', justifyContent: 'center', margin: '5%', maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                                    {filteredSpecies.map(species => (
                                        <Link key={species.id} to={`/Home?treeId=${species.speciesid}`} className='ahrefadminmap' style={{ backgroundColor: speciesColorMap[species.speciesid] }}>{species.name}</Link>
                                    ))}
                                </Row>

                            </div>
                        </Col>
                        <Row style={{ marginTop: '-8%' }}>
                            <div className="dashboard-footer">
                                <div className="dashboard-cards">
                                    <div className='dash-cards'>
                                        <img src='https://relaxed-joliot-41cdfa.netlify.app/.netlify/functions/counter?id=1399' style={{ width: '150px' }}></img>
                                    </div>
                                    <div className="dash-cards">
                                        <h3>Users</h3>
                                        <h1>{numberOfUsers}</h1>
                                    </div>
                                    <div className="dash-cards">
                                        <h3>Trees</h3>
                                        <h1>{numberOfPins}</h1>
                                    </div>
                                </div>
                            </div>
                        </Row>
                    </Row>

                </section>
            </div>
    );
}

export default Home;
