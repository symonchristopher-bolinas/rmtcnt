import React, { useState, useEffect } from 'react';
import '../styles/treeform.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import supabase from '../supabase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'

function TreeForm() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [treeId, setTreeId] = useState('');
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [description, setDescription] = useState('');
  const [otherNames, setOtherNames] = useState('');
  const [treeCycle, setTreeCycle] = useState('');
  const [fruitingMonths, setFruitingMonths] = useState('');
  const [treeStatus, setTreeStatus] = useState('');
  const [treeSpecies, setTreeSpecies] = useState('');
  const [fruitColor, setFruitColor] = useState('');
  const [pestIdentified, setPestIdentified] = useState('');
  const [floweringDescription, setFloweringDescription] = useState('');
  const [fruitingDescription, setFruitingDescription] = useState('');
  const [unripeFruitDescription, setUnripeFruitDescription] = useState('');
  const [ripeFruitDescription, setRipeFruitDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Assuming you will handle file inputs as well
  const [treeImage, setTreeImage] = useState(null);
  const [floweringImage, setFloweringImage] = useState(null);
  const [fruitingImage, setFruitingImage] = useState(null);
  const [unripeFruitImage, setUnripeFruitImage] = useState(null);
  const [ripeFruitImage, setRipeFruitImage] = useState(null);
  const [imgUrls, setImgUrls] = useState([]);

  const steps = 4;
  const [error, setError] = useState('');
  const containerStyle = {
    width: '80%',
    border: '1px solid #ccc',
    padding: '50px',
    marginTop: '5%',
    backgroundColor: 'white',
  };
  const [formValid, setFormValid] = useState(false);

  // Function to check if all required fields are filled
  const checkFormValidity = () => {
    // Check if all required fields have values
    const requiredFields = [treeId, name, scientificName, description];
    const isValid = requiredFields.every(field => field.trim() !== '');
    setFormValid(isValid);
  };

  // Run checkFormValidity whenever any of the form fields change
  useEffect(() => {
    checkFormValidity();
  }, [treeId, name, scientificName, description]);

  const next = () => {
    if (formValid) {
      setCurrent(current + 1);
    } else {
      toast.error('Please fill all required fields');
    }
  };

  const previous = () => {
    setCurrent(current - 1);
  };

  const processArrayInput = (input) => {
    return input.split(/,|\s+/).filter(Boolean); // split by comma or spaces and remove empty strings
  };

  const uploadImage = async (file, treeId, suffix) => {
    if (!file || !treeId) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${treeId}_${suffix}.${fileExt}`;
    const filePath = `${treeId}/${fileName}`;  // Organize files in folders by treeId

    const { error } = await supabase.storage
      .from('tree-imgs')
      .upload(filePath, file, {
        upsert: true // This will replace the file if it already exists
      });

    if (error) {
      console.error('Error uploading image:', error.message);
      return null;
    }

    return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/tree-imgs/${filePath}`;
  };

  const deleteFolder = async (treeId) => {
    const folderPath = `${treeId}/`;

    const { data: fileList, error: listError } = await supabase.storage
      .from('tree-imgs')
      .list(folderPath);

    if (listError) {
      console.error('Error listing files for deletion:', listError.message);
      return;
    }

    if (fileList && fileList.length > 0) {
      const deletePromises = fileList.map(file =>
        supabase.storage
          .from('tree-imgs')
          .remove(`${folderPath}${file.name}`)
      );

      const results = await Promise.all(deletePromises);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        console.error('Errors occurred during folder deletion:', errors);
      } else {
        console.log(`All files in folder ${treeId} deleted successfully.`);
      }
    }
  };


  const submit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Upload images and store their URLs
      const imageSuffixes = ['TREE_IMG', 'FLOWERING_IMG', 'FRUITING_IMG', 'UNRIPE_IMG', 'RIPE_IMG'];
      // Upload images and store their URLs
      const imagesToUpload = [treeImage, floweringImage, fruitingImage, unripeFruitImage, ripeFruitImage];
      const uploadedImageUrls = await Promise.all(imagesToUpload.map((file, index) => {
        if (file) return uploadImage(file, treeId, imageSuffixes[index]);
        return Promise.resolve(null);
      }));

      setImgUrls(uploadedImageUrls.filter(url => url !== null)); // Filter out any nulls


      // Assuming otherNames is a comma-separated string like "name1, name2"
      const otherNamesArray = otherNames.split(',').map(name => name.trim()).filter(name => name.length > 0);
      // Assuming otherNames is a comma-separated string like "name1, name2"
      const pestIdentfiedArray = pestIdentified.split(',').map(name => name.trim()).filter(name => name.length > 0);

      // Check if `speciesid` exists and decide on action
      const { data, error } = await supabase
        .from('treedata')
        .select('*')
        .eq('speciesid', treeId);

      // Check for errors first
      if (error) {
        toast.error(`Error fetching data: ${error.message}`);
        throw new Error(error);
        return;
      }


      if (data.length > 0) {
        // Update existing record
        const { data: updateData, error: updateError } = await supabase
          .from('treedata')
          .update({
            imgurl: uploadedImageUrls,
            name: name,
            scientificname: scientificName,
            description: description,
            othernames: otherNamesArray,
            treecycle: treeCycle,
            fruitingmonths: fruitingMonths,
            treestatus: treeStatus,
            treespecies: treeSpecies,
            fruitcolour: fruitColor,
            pestidentified: pestIdentfiedArray,
            floweringdescription: floweringDescription,
            fruitingdescription: fruitingDescription,
            unripefruitdescription: unripeFruitDescription,
            ripefruitdescription: ripeFruitDescription
          })
          .eq('speciesid', treeId);

        if (updateError) {
          toast.error(`Update failed: ${updateError.message}`);
          throw new Error(updateError.message)
        } else {
          toast.success('Tree data updated successfully');
        }
      } else {
        // Insert new record
        const { data: insertData, error: insertError } = await supabase
          .from('treedata')
          .insert([{
            speciesid: treeId,
            imgurl: uploadedImageUrls,
            name: name,
            scientificname: scientificName,
            description: description,
            othernames: otherNamesArray,
            treecycle: treeCycle,
            fruitingmonths: fruitingMonths,
            treestatus: treeStatus,
            treespecies: treeSpecies,
            fruitcolour: fruitColor,
            pestidentified: pestIdentfiedArray,
            floweringdescription: floweringDescription,
            fruitingdescription: fruitingDescription,
            unripefruitdescription: unripeFruitDescription,
            ripefruitdescription: ripeFruitDescription
          }]);

        if (insertError) {
          toast.error(`Insert failed: ${insertError.message}`);
          throw new Error(insertError.message)
        } else {
          toast.success('Tree data added successfully');

        }
      }
    } catch (error) {
      console.error('Error:', error);
      await deleteFolder(treeId);
    } finally {
      setIsLoading(false);
      toast.success('redirecting...', { autoClose: 5000 })
      setTimeout(() => navigate(`/TreeInfo?treeId=${treeId}`), 5000);
    }
  };

  const setProgressBar = (curStep) => {
    const percent = ((curStep - 1) / (steps - 1)) * 100;
    return percent + '%';
  };

  return (
    <Container style={containerStyle}>
      <Row>
        <Col>
          <div id="heading">Add New Tree Species</div>
          <p id='paragraphh'>Fill all form fields to go to next step</p>
          {isLoading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <form id="msform" onSubmit={submit}>
              <ul id="progressbar">
                <li className={current === 1 ? 'active' : ''}><strong>First</strong></li>
                <li className={current === 2 ? 'active' : ''}><strong>Second</strong></li>
                <li className={current === 3 ? 'active' : ''}><strong>Third</strong></li>
                <li className={current === 4 ? 'active' : ''}><strong>Finish</strong></li>
              </ul>
              <div className="progress">
                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: setProgressBar(current) }} aria-valuemin="0" aria-valuemax="100"></div>
              </div>

              <br />

              {current === 1 && (
                <fieldset>
                  <div className="form-card">
                    <label htmlFor="tree-id">TreeId:</label>
                    <input type="text" className="fieldlabels" id="tree-id" value={treeId} onChange={e => setTreeId(e.target.value)} placeholder="Tree ID" />
                    <label htmlFor="name">Name:</label>
                    <input type="text" className="fieldlabels" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                    <label htmlFor="scientificName">Scientific Name:</label>
                    <input type="text" className="fieldlabels" id="scientificName" value={scientificName} onChange={e => setScientificName(e.target.value)} placeholder="Scientific Name" required />
                    <label htmlFor="description">Description:</label>
                    <input type="text" className="fieldlabels" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
                    <label htmlFor="otherNames">Other Names (separate by comma):</label>
                    <input type="text" className="fieldlabels" id="otherNames" value={otherNames} onChange={e => setOtherNames(e.target.value)} placeholder="Other Names" />
                    <label className="fieldlabels">Tree Image:</label>
                    <input type="file" id="treeImage" onChange={e => setTreeImage(e.target.files[0])} accept="image/*" />
                  </div>
                  <button type="button" className="next action-button" onClick={next}>Next</button>
                </fieldset>
              )}

              {current === 2 && (
                <fieldset>
                  <div className="form-card">
                    <label htmlFor="treeCycle">Tree Cycle:</label>
                    <select className="form-control" id="treeCycle" value={treeCycle} onChange={e => setTreeCycle(e.target.value)} required>
                      <option value="">Select</option>
                      <option value="Annual">Annual</option>
                      <option value="Biennial">Biennial</option>
                      <option value="Perennial">Perennial</option>
                    </select>
                    <label htmlFor="fruitingMonths">Fruiting Months:</label>
                    <input type="text" className="fieldlabels" id="fruitingMonths" value={fruitingMonths} onChange={e => setFruitingMonths(e.target.value)} />
                    <label htmlFor="treeStatus">Tree Status:</label>
                    <select className="form-control" id="treeStatus" value={treeStatus} onChange={e => setTreeStatus(e.target.value)} required>
                      <option value="">Select</option>
                      <option value="Healthy">Healthy</option>
                      <option value="Fruiting">Fruiting</option>
                      <option value="Matured">Matured</option>
                      <option value="Infected">Infected</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                    <label htmlFor="treeSpecies">Tree Species:</label>
                    <select className="form-control" id="treeSpecies" value={treeSpecies} onChange={e => setTreeSpecies(e.target.value)} required>
                      <option value="">Select</option>
                      <option value="Indigenous Fruit Tree">Indigenous Fruit Tree</option>
                      <option value="Indigenous Forest Tree">Indigenous Forest Tree</option>
                    </select>
                    <label htmlFor="fruitColor">Fruit Color:</label>
                    <input type="color" className="fieldlabels" id="fruitColor" value={fruitColor} onChange={e => setFruitColor(e.target.value)} placeholder="Fruit Color" />


                  </div>
                  <button type="button" className="next action-button" onClick={next}>Next</button>
                  <button type="button" className="previous action-button-previous" onClick={previous}>Previous</button>
                </fieldset>
              )}

              {current === 3 && (
                <fieldset>
                  <div className="form-card">
                    <label htmlFor="pestIdentified">Pest Identified:</label>
                    <input type="text" id="pestIdentified" value={pestIdentified} onChange={e => setPestIdentified(e.target.value)} required placeholder="Pest Identified" />
                    <label htmlFor="floweringDescription">Flowering Description:</label>
                    <textarea id="floweringDescription" value={floweringDescription} onChange={e => setFloweringDescription(e.target.value)} rows="4" required placeholder="Description"></textarea>
                    <label htmlFor="floweringImage">Choose Flowering Picture:</label>
                    <input type="file" id="floweringImage" onChange={e => setFloweringImage(e.target.files[0])} accept="image/*" required />
                  </div>
                  <button type="button" className="next action-button" onClick={next}>Next</button>
                  <button type="button" className="previous action-button-previous" onClick={previous}>Previous</button>
                </fieldset>
              )}

              {current === 4 && (
                <fieldset>
                  <div className="form-card">
                    <label htmlFor="fruitingDescription">Fruiting Description:</label>
                    <textarea id="fruitingDescription" value={fruitingDescription} onChange={e => setFruitingDescription(e.target.value)} rows="4" required placeholder="Description"></textarea>
                    <label htmlFor="fruitingImage">Choose Fruiting Picture:</label>
                    <input type="file" id="fruitingImage" onChange={e => setFruitingImage(e.target.files[0])} accept="image/*" required />
                    <label htmlFor="unripeFruitDescription">Unripe Fruit Description:</label>
                    <textarea id="unripeFruitDescription" value={unripeFruitDescription} onChange={e => setUnripeFruitDescription(e.target.value)} rows="4" required placeholder="Description"></textarea>
                    <label htmlFor="unripeFruitImage">Choose Unripe Fruit Picture:</label>
                    <input type="file" id="unripeFruitImage" onChange={e => setUnripeFruitImage(e.target.files[0])} accept="image/*" required />
                    <label htmlFor="ripeFruitDescription">Ripe Fruit Description:</label>
                    <textarea id="ripeFruitDescription" value={ripeFruitDescription} onChange={e => setRipeFruitDescription(e.target.value)} rows="4" required placeholder="Description"></textarea>
                    <label htmlFor="ripeFruitImage">Choose Ripe Fruit Picture:</label>
                    <input type="file" id="ripeFruitImage" onChange={e => setRipeFruitImage(e.target.files[0])} accept="image/*" required />
                  </div>
                  <button type="submit" className="action-button">Submit</button>
                  <button type="button" className="previous action-button-previous" onClick={previous}>Previous</button>
                </fieldset>
              )}
            </form>
          )}
        </Col>
      </Row>
      {error && <p className="error">{error}</p>}
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </Container>
  );
}

export default TreeForm;