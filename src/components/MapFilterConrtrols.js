import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import supabase from '../supabase';

function MapFilterControls({ setFilterSpecies, setFilterName, setFilterStatus, setFilterCycle }) {
    const [treeSpecies, setTreeSpecies] = useState([]);
    const [treeNames, setTreeNames] = useState([]);
    const [treeStatuses, setTreeStatuses] = useState([]);
    const [treeCycles, setTreeCycles] = useState([]);

    const [selectedSpecies, setSelectedSpecies] = useState([]);
    const [selectedNames, setSelectedNames] = useState([]);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedCycles, setSelectedCycles] = useState([]);

    const handleCheckboxClick = (e) => {
        e.stopPropagation();  // Stop the click event from propagating to the dropdown
    };

    const handleCheckboxChange = (e, item, setItems, items, filterFunc) => {
        e.stopPropagation();  // Also stop propagation here to ensure consistent behavior
        const checked = e.target.checked;
        const index = items.indexOf(item);
        let newItems = [...items];
        if (index > -1) {
            if (!checked) {
                newItems.splice(index, 1);
            }
        } else if (checked) {
            newItems.push(item);
        }
        setItems(newItems);
        filterFunc(newItems);
    };


    const fetchData = async () => {
        const { data, error } = await supabase
            .from('treedata')
            .select('treespecies, name, treestatus, treecycle');

        if (error) {
            console.error('Error fetching tree data:', error);
            return;
        }

        setTreeSpecies([...new Set(data.map(item => item.treespecies))]);
        setTreeNames([...new Set(data.map(item => item.name))]);
        setTreeStatuses([...new Set(data.map(item => item.treestatus))]);
        setTreeCycles([...new Set(data.map(item => item.treecycle))]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const clearFilters = () => {
        setSelectedSpecies([]);
        setSelectedNames([]);
        setSelectedStatuses([]);
        setSelectedCycles([]);
        setFilterSpecies([]);
        setFilterName([]);
        setFilterStatus([]);
        setFilterCycle([]);
    };

    return (
        
        <Navbar expand="lg">
            <Navbar.Brand href="/" className='overview13'>Map Overview</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <NavDropdown title="Tree Species" id="species-dropdown" className="species">
                        {treeSpecies.map(species => (
                            <NavDropdown.Item key={species} as="div" className="nav-link-custom11" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                    type="checkbox"
                                    label={species}
                                    onChange={(e) => handleCheckboxChange(e, species, setSelectedSpecies, selectedSpecies, setFilterSpecies)}
                                    checked={selectedSpecies.includes(species)}
                                />
                            </NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Tree Names" id="list-dropdown" className="list">
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {treeNames.map(name => (
                                <NavDropdown.Item key={name} as="div" className="nav-link-custom11" onClick={(e) => e.stopPropagation()}>
                                    <Form.Check
                                        type="checkbox"
                                        label={name}
                                        onChange={(e) => handleCheckboxChange(e, name, setSelectedNames, selectedNames, setFilterName)}
                                        checked={selectedNames.includes(name)}
                                    />
                                </NavDropdown.Item>
                            ))}
                        </div>
                    </NavDropdown>

                    <NavDropdown title="Tree Statuses" id="status-dropdown" className="status">
                        {treeStatuses.map(status => (
                            <NavDropdown.Item key={status} as="div" className="nav-link-custom11" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                    type="checkbox"
                                    label={status}
                                    onChange={(e) => handleCheckboxChange(e, status, setSelectedStatuses, selectedStatuses, setFilterStatus)}
                                    checked={selectedStatuses.includes(status)}
                                />
                            </NavDropdown.Item>
                        ))}
                    </NavDropdown>
                    <NavDropdown title="Tree Cycles" id="cycle-dropdown" className="cycle">
                        {treeCycles.map(cycle => (
                            <NavDropdown.Item key={cycle} as="div" className="nav-link-custom11" onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                    type="checkbox"
                                    label={cycle}
                                    onChange={(e) => handleCheckboxChange(e, cycle, setSelectedCycles, selectedCycles, setFilterCycle)}
                                    checked={selectedCycles.includes(cycle)}
                                />
                            </NavDropdown.Item >
                        ))}
                    </NavDropdown>
                    <Link to="/" style={{ padding: '10px'}} id="cycle-dropdown" className="clearfilter">Clear Filters</Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default MapFilterControls;
