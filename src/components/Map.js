import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { NavLink, Link, useSearchParams } from 'react-router-dom';
import ReactMapGL, { NavigationControl, Marker, Popup, Source, Layer } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { debounce } from "lodash";
import '../styles/tree.css'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import TreeList from './TreeList';
import supabase from '../supabase'
import { useAuth } from '../AuthContext';
import MapFilterControls from './MapFilterConrtrols';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const mapStyles = {
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    street: 'mapbox://styles/mapbox/streets-v12',
    dark: 'mapbox://styles/mapbox/dark-v11'
};

const Map = ({ userRole }) => {
    const [filterSpecies, setFilterSpecies] = useState([]);
    const [filterName, setFilterName] = useState([]);
    const [filterStatus, setFilterStatus] = useState([]);
    const [filterCycle, setFilterCycle] = useState([]);
    const [viewport, setViewport] = useState({
        latitude: 14.4134583,
        longitude: 121.4459429,
        zoom: 16.5,
        width: "100vw",
        height: "100vh",
    });
    const [selectedTree, setSelectedTree] = useState(null);
    const [treePins, setTreePins] = useState([]);
    const [treeDetails, setTreeDetails] = useState({});
    const [mapStyle, setMapStyle] = useState(mapStyles.satellite);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [searchParams] = useSearchParams();
    const treeId = searchParams.get('treeId');
    const [editedTree, setEditedTree] = useState(null);
    const [speciesColorMap, setSpeciesColorMap] = useState({});

    const { user, setUser, isAdmin } = useAuth();

    useEffect(() => {
        const storedUser = localStorage.getItem('admin');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [setUser]);

    const handleViewportChange = useCallback(debounce((newViewport) => {
        setViewport(newViewport);
    }, 1), []);

    const fetchTreeData = async () => {
        let { data: pinsData, error: pinsError } = await supabase
            .from('treepins')
            .select(`
            *,
            treedata:speciesid (treecycle, treespecies, name, treestatus)
            `)
            .eq('pinverified', true);

        console.log(pinsData);

        if (!pinsError && pinsData) {
            setTreePins(pinsData);
        } else {
            console.error("Error fetching data: ", pinsError);
        }
        let { data: detailsData, error: detailsError } = await supabase
            .from('treedata')
            .select('*');

        if (!pinsError && !detailsError) {
            setTreePins(pinsData);

            const detailsMap = detailsData.reduce((acc, detail) => {
                acc[detail.speciesid] = detail;
                return acc;
            }, {});

            const newSpeciesColorMap = detailsData.reduce((acc, detail) => {
                if (detail.color && detail.speciesid) {
                    acc[detail.speciesid] = detail.color;
                }
                return acc;
            }, {});


            setSpeciesColorMap(newSpeciesColorMap);
            setTreeDetails(detailsMap);
        } else {
            console.error(pinsError || detailsError);
        }
    };

    const handleMarkerClick = (event, treePin) => {
        setEditedTree({ ...selectedTree });
        event.preventDefault();
        const treeDetail = treeDetails[treePin.speciesid];

        if (treeDetail) {
            setSelectedTree({
                ...treePin,
                details: treeDetail,
            });
        }
    };

    useEffect(() => {
        fetchTreeData();
    }, []);

    useEffect(() => {
        if (selectedTree) {
            console.log(selectedTree);
        }
    }, [selectedTree]);

    const queryTreePins = useMemo(() => {
        return treeId ? treePins.filter(pin => pin.speciesid === treeId) : treePins;
    }, [treePins, treeId]);

    // useMemo hook to filter tree pins based on selected filter arrays
    const filteredPins = useMemo(() => {
        return queryTreePins.filter(pin => {
            const speciesMatch = !filterSpecies.length || filterSpecies.includes(pin.treedata.treespecies);
            const nameMatch = !filterName.length || filterName.includes(pin.treedata.name);
            const statusMatch = !filterStatus.length || filterStatus.includes(pin.treedata.treestatus);
            const cycleMatch = !filterCycle.length || filterCycle.includes(pin.treedata.treecycle);
            return speciesMatch && nameMatch && statusMatch && cycleMatch;
        });
    }, [queryTreePins, filterSpecies, filterName, filterStatus, filterCycle]);

    const deleteTag = async () => {
        if (selectedTree) {
            const { data, error } = await supabase
                .from('treepins')
                .delete()
                .eq('treeinstanceid', selectedTree.treeinstanceid);

            if (error) {
                console.error('Error deleting tag:', error);
            } else {
                console.log('Tag deleted successfully');
                setSelectedTree(null);
                fetchTreeData();
            }
        }
    };

    const saveEditedTag = async () => {
        try {
            console.log("Saving edited tree...");
            console.log("Edited Tree:", editedTree);
            const { error } = await supabase
                .from('treepins')
                .update({
                    latitude: editedTree.latitude,
                    longitude: editedTree.longitude,
                    plantername: editedTree.plantername,
                    status: editedTree.status,
                })
                .eq('treeinstanceid', editedTree.treeinstanceid);

            if (error) {
                console.error('Error updating tree pin:', error.message);
            } else {
                console.log('Tree pin updated successfully');
                console.log("Updated Tree Pin:", editedTree);
                setEditedTree(null);
                fetchTreeData();
                setTreePins(prevTreePins => {
                    const updatedTreePins = prevTreePins.map(pin => {
                        if (pin.treeinstanceid === editedTree.treeinstanceid) {
                            return editedTree;
                        } else {
                            return pin;
                        }
                    });
                    return updatedTreePins;
                });
            }
        } catch (error) {
            console.error('Error saving edited tree pin:', error.message);
        }
    };

    const filteredGeoJSONData = (speciesId) => ({
        type: 'FeatureCollection',
        features: filteredPins.filter(pin => pin.speciesid === speciesId).map(pin => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [pin.longitude, pin.latitude]
            }
        }))
    });

    return (
        <>
            <MapFilterControls
                setFilterSpecies={setFilterSpecies}
                setFilterName={setFilterName}
                setFilterStatus={setFilterStatus}
                setFilterCycle={setFilterCycle}
            />

            <br></br>
            <ReactMapGL
                {...viewport}
                mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                mapStyle={mapStyle}
                attributionControl={false}
                onMove={handleViewportChange}
                style={{ borderRadius: '30px' }}
            >
                <div style={{ position: 'absolute', right: 10, top: 10 }}>
                    <NavigationControl />
                </div>

                {!showHeatmap && filteredPins.map((pin, index) => (
                    <Marker key={index} latitude={pin.latitude} longitude={pin.longitude}>
                        <div onClick={(event) => handleMarkerClick(event, pin)} style={{ cursor: 'pointer', opacity:'0.7'}}>
                            <i className="fa-solid fa-location-pin fa-2x" style={{ color: speciesColorMap[pin.speciesid] || 'black' }}></i>
                        </div>
                    </Marker>
                ))}

                {showHeatmap && (
                    Object.entries(speciesColorMap).map(([speciesId, color]) => (
                        <Source key={speciesId} type="geojson" data={filteredGeoJSONData(speciesId)}>
                            <Layer
                                type="heatmap"
                                paint={{
                                    'heatmap-weight': 1,
                                    'heatmap-intensity': [
                                        'interpolate',
                                        ['linear'],
                                        ['zoom'],
                                        0, 0.5,
                                        22, 1
                                    ],
                                    'heatmap-color': [
                                        'interpolate',
                                        ['linear'],
                                        ['heatmap-density'],
                                        0, 'rgba(255, 255, 255, 0)',
                                        0.1, `${color.replace('rgb', 'rgba').slice(0, -1)}, 0.3)`,
                                        0.3, `${color.replace('rgb', 'rgba').slice(0, -1)}, 0.4)`,
                                        0.5, `${color.replace('rgb', 'rgba').slice(0, -1)}, 0.45)`,
                                        0.7, `${color.replace('rgb', 'rgba').slice(0, -1)}, 0.75)`,
                                        0.8, `${color.replace('rgb', 'rgba').slice(0, -1)}, 0.90)`,
                                        0.9, `${color.replace('rgb', 'rgba').slice(0, -1)}, 0.95)`,
                                        1, `${color.replace('rgb', 'rgba').slice(0, -1)}, 1)`  // Fully opaque at highest density
                                    ],
                                    'heatmap-radius': [
                                        'interpolate',
                                        ['linear'],
                                        ['zoom'],
                                        0, 10,
                                        15, 50
                                    ],
                                    'heatmap-opacity': 1
                                }}
                            />
                        </Source>
                    ))
                )}


                {selectedTree && (
                    <Popup
                        latitude={selectedTree.latitude}
                        longitude={selectedTree.longitude}
                        plantername={selectedTree.plantername}
                        status={selectedTree.status}
                        onClose={() => setSelectedTree(null)}
                        closeOnClick={false}
                        anchor="top"
                        style={{ maxHeight: '400px', overflowY: 'auto' }}
                    >
                        <style>
                            {`

                            `}
                        </style>
                        <div className="card_1">
                            <h3 className="card_tree">{selectedTree.details.name || 'Tree Details'}</h3>
                            <p><strong>Scientific Name:</strong>{selectedTree.details.scientificname}</p>
                            <p><strong>Description: </strong>{selectedTree.details.description}</p>
                            <p><strong>Name of Plnter: </strong>{selectedTree.plantername}</p>
                            <p><strong>Date Pinned: </strong>{selectedTree.dateadded}</p>
                            <p><strong>Status: </strong>{selectedTree.status}</p>
                            {isAdmin && user && (
                                <div>
                                    <button onClick={deleteTag}>Delete Tag</button>
                                    <button onClick={() => setEditedTree(selectedTree)}>Edit Tag</button>
                                </div>
                            )}<div class="buttonpopup">
                            <Link to={`/TreeInfo?treeId=${selectedTree.speciesid}`} className="button_view" role="button">Read More</Link>
                            </div>
                        </div>
                        {editedTree && selectedTree.treeinstanceid === editedTree.treeinstanceid && (
                            <form onSubmit={saveEditedTag}>
                                <div>
                                    <label>Latitude:</label><br />
                                    <input
                                        type="numeric"
                                        value={editedTree?.latitude || ''}
                                        onChange={(e) => setEditedTree({ ...editedTree, latitude: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Longitude:</label><br />
                                    <input
                                        type="numeric"
                                        value={editedTree?.longitude || ''}
                                        onChange={(e) => setEditedTree({ ...editedTree, longitude: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Planter Name:</label><br />
                                    <input
                                        type="text"
                                        value={editedTree?.plantername || ''}
                                        onChange={(e) => setEditedTree({ ...editedTree, plantername: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label>Status:</label><br />
                                    <input
                                        type="text"
                                        value={editedTree?.status || ''}
                                        onChange={(e) => setEditedTree({ ...editedTree, status: e.target.value })}
                                    />
                                </div><br />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditedTree(null)}>Cancel</button>
                            </form>


                        )}
                    </Popup>
                )}
            </ReactMapGL>
            <div className='map-layer-control' style={{ display: 'flex', gap: '20px' }}>
                <div className="heatmap-toggle" style={{ zIndex: 100000, position: 'relative', color: 'white', }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={showHeatmap}
                            onChange={e => setShowHeatmap(e.target.checked)}
                            style={{ marginRight: '10px' }}
                        />
                        Show Heatmap
                    </label>
                </div>
                <div className="style-toggle" style={{ zIndex: 100000, marginLeft: 'auto', color: 'white' }} >
                    <div className="toggles">
                        <label style={{ marginRight: '20px' }}>
                            <input
                                type="radio"
                                name="mapStyle"
                                value={mapStyles.satellite}
                                checked={mapStyle === mapStyles.satellite}
                                onChange={() => setMapStyle(mapStyles.satellite)}
                            />
                            Satellite View
                        </label>
                        <label style={{ marginRight: '20px' }}>
                            <input
                                type="radio"
                                name="mapStyle"
                                value={mapStyles.street}
                                checked={mapStyle === mapStyles.street}
                                onChange={() => setMapStyle(mapStyles.street)}
                            />
                            Street View
                        </label>
                        <label style={{ marginRight: '20px' }} >
                            <input
                                type="radio"
                                name="mapStyle"
                                value={mapStyles.dark}
                                checked={mapStyle === mapStyles.dark}
                                onChange={() => setMapStyle(mapStyles.dark)}
                            />
                            Dark Street View
                        </label>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Map;