import React, { useState, useEffect } from 'react';
import NavigationBar from "../components/NavigationBar";
import addTreeCss from '../styles/addtree.module.css';
import supabase from '../supabase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTree = () => {
  const [treeData, setTreeData] = useState([]);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Bearing');
  const [planterName, setPlanterName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [pinVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTreeData = async () => {
      const { data, error } = await supabase
        .from('treedata')
        .select('speciesid, name');

      if (error) {
        console.error('Error fetching tree data:', error);
      } else {
        setTreeData(data);
      }
    };

    fetchTreeData();
  }, []);

  const getNewTreeInstanceId = async (speciesId, longitude, latitude) => {
    const { data, error } = await supabase
      .from('treepins')
      .select('treeinstanceid')
      .eq('speciesid', speciesId)
      .eq('longitude', parseFloat(longitude))
      .eq('latitude', parseFloat(latitude))
      .limit(1);

    if (error) {
      toast.error('Failed to generate new tree instance ID.');
      return '';
    }

    if (data.length > 0) {
      toast.error('Tree pin already exists.');
      return '';
    }

    const { data: lastData, error: lastError } = await supabase
      .from('treepins')
      .select('treeinstanceid')
      .like('treeinstanceid', `${speciesId}%`)
      .order('treeinstanceid', { ascending: false })
      .limit(1);

    if (lastError) {
      toast.error('Failed to generate new tree instance ID.');
      return '';
    }

    const lastInstanceId = lastData.length ? lastData[0].treeinstanceid : `${speciesId}_00000`;
    const underscoreIndex = lastInstanceId.indexOf('_');
    const lastNumericPart = parseInt(lastInstanceId.substring(underscoreIndex + 1), 10);
    const newNumericPart = lastNumericPart + 1;
    const newInstanceId = `${speciesId}_${newNumericPart.toString().padStart(5, '0')}`;
    return newInstanceId;
  };

  const isValidLongitude = (longitude) => {
    return !isNaN(parseFloat(longitude)) && isFinite(longitude) && longitude >= -180 && longitude <= 180;
  };

  const isValidLatitude = (latitude) => {
    return !isNaN(parseFloat(latitude)) && isFinite(latitude) && latitude >= -90 && latitude <= 90;
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isValidLongitude(longitude) || !isValidLatitude(latitude)) {
      toast.error('Invalid longitude or latitude value.');
      setIsLoading(false);
      return;
    }

    try {
      const newInstanceId = await getNewTreeInstanceId(selectedSpeciesId, longitude, latitude);

      if (!newInstanceId) {
        setIsLoading(false);
        return;
      }

      const { error } = await supabase
        .from('treepins')
        .insert([{
          treeinstanceid: newInstanceId,
          speciesid: selectedSpeciesId,
          status: selectedStatus,
          plantername: planterName,
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
          dateadded: dateAdded ? new Date(dateAdded).toISOString() : null,
          pinverified: pinVerified
        }]);

      if (error) {
        throw error;
      }

      toast.success('New tree pin added successfully, Wait for Admin to Verify your Pin');

      setSelectedSpeciesId('');
      setSelectedStatus('');
      setPlanterName('');
      setLongitude('');
      setLatitude('');
      setDateAdded('');

    } catch (error) {
      console.log(error);
      toast.error('Failed to add new tree pin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavigationBar />
      <div className={addTreeCss.container}>
        <div className={addTreeCss.card3}>
          <h1 className={addTreeCss.addtree}>Add Tree</h1>
          <form onSubmit={handleSubmit}>
            <div className={addTreeCss['form-row']}>
              <div className="col-md-6">
                <div className={addTreeCss.formGroup}>
                  <label htmlFor="inputSpecies">Choose Species</label>
                  <select
                    id="inputSpecies"
                    className="form-control"
                  >
                    <option value="">Choose...</option>
                    <option value="FIT">Indigenous Fruit Tree</option>
                    <option value="FST  ">Indigenous Forest Tree</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className={addTreeCss.formGroup}>
                  <label htmlFor="inputStatus">Choose Status</label>
                  <select
                    id="inputStatus"
                    className="form-control"
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                  >
                    <option value="Bearing">Bearing</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Growing">Growing</option>
                    <option value="Matured">Matured</option>
                    <option value="Infected">Infected</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
              <div className={addTreeCss.formGroup}>
              <label for="inputTreeName">Name of Tree</label>
              <select id="inputTreeName" className={addTreeCss['form-control']}
                value={selectedSpeciesId}
                onChange={e => setSelectedSpeciesId(e.target.value)}
              >
                <option value="">Choose...</option>
                {treeData.map((species) => (
                  <option key={species.speciesid} value={species.speciesid}>
                    {species.name}
                  </option>
                ))}
              </select>
              </div></div>
              <div className="col-md-6">
                <div className={addTreeCss.formGroup}>
                  <label htmlFor="inputPlanterName">Name of Planter</label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputPlanterName"
                    value={planterName}
                    onChange={e => setPlanterName(e.target.value)}
                    placeholder="Name of the planter"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className={addTreeCss.formGroup}>
                  <label htmlFor="inputLongitude">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="form-control"
                    id="inputLongitude"
                    value={longitude}
                    onChange={e => setLongitude(e.target.value)}
                    placeholder="Longitude"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className={addTreeCss.formGroup}>
                  <label htmlFor="inputLatitude">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="form-control"
                    id="inputLatitude"
                    value={latitude}
                    onChange={e => setLatitude(e.target.value)}
                    placeholder="Latitude"
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className={addTreeCss.formGroup}>
                  <label htmlFor="inputDateAdded">Date Added</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="inputDateAdded"
                    value={dateAdded}
                    onChange={e => setDateAdded(e.target.value)}
                    placeholder="Date Added"
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className={addTreeCss.btn} disabled={isLoading}>Submit</button>
            </div>
            {error && <p className="error">{error}</p>}
            {/* ToastContainer for displaying Toast notifications */}
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          </form>
        </div>
      </div>

    </>
  );
};

export default AddTree;
