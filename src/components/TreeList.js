import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import supabase from '../supabase';

const SortButtons = ({ onSort }) => {
    const buttonStyle = {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
        margin: '4px 2px',
        borderRadius: '12px',
        cursor: 'pointer'
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <button style={buttonStyle} onClick={() => onSort('all')}>
                All
            </button>
            <button style={buttonStyle} onClick={() => onSort('forest')}>
                Forest Trees
            </button>
            <button style={buttonStyle} onClick={() => onSort('fruit')}>
                Fruit Trees
            </button>
        </div>
    );
};

const Card = ({ name, description, imgurl, buttonUrl }) => {
    return (
        <div style={{ width: '450px', margin: '10px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}>
            <div className="grid-container">
                <div><img src={imgurl} className="grid1" alt={name} style={{ width: '170px', height: '170px', objectFit: 'cover', borderRadius: '50%'}} /></div>
                <div className="grid2">
                    <h4>{name}</h4>
                </div>
                <div className="grid3" style={{ maxHeight: '100px', overflow: 'hidden', fontSize:'12px'}}>
                    <p style={{ margin: 0 }}>{description}</p>
                </div> 
                <div className='grid4'>
                    <Link to={`/TreeInfo?treeId=${buttonUrl}`} className="button_view" role="button">Read More</Link>
                </div>
            </div>
        </div>
    );
};

const CardList = ({ cards }) => {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {cards.map(card => (
                <Card key={card.speciesid} name={card.name} description={card.description} imgurl={card.imgurl && card.imgurl.length > 0 ? card.imgurl[0] : null}  buttonUrl={card.speciesid} />
            ))}
        </div>
    );
};

const TreeList = () => {
    const [searchParams] = useSearchParams();
    const [cards, setCards] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const treeId = searchParams.get('treeId');

    useEffect(() => {
        const fetchTreeData = async () => {
            try {
                let query = supabase.from('treedata').select('*');
                if (treeId) {
                    query = query.eq('speciesid', treeId);
                }
                const { data, error } = await query;
                if (error) {
                    console.error('Error fetching tree data:', error.message);
                } else {
                    setCards(data || []);
                }
            } catch (error) {
                console.error('Error fetching tree data:', error.message);
            }
        };

        fetchTreeData();
    }, [treeId]);

    const handleSort = (type) => {
        let sortedData = cards;
        setCards(sortedData);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cards.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <SortButtons onSort={handleSort} />
            <CardList cards={currentItems} />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {cards.length > itemsPerPage && (
                    <div>
                        {Array.from({ length: Math.ceil(cards.length / itemsPerPage) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                style={{
                                    margin: '5px',
                                    padding: '5px 10px',
                                    backgroundColor: currentPage === i + 1 ? '#4CAF50' : '#ddd',
                                    color: currentPage === i + 1 ? 'white' : 'black',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default TreeList;