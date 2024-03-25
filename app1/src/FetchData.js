import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FetchData() {
  const [data, setData] = useState([]);
  const apilink = 'https://77.92.189.102/iit_vertical_precast/api/v1/Erp.BO.PartSvc/Parts';
  const [filteredData, setFilteredData] = useState([]);
  const [filterPartNum, setFilterPartNum] = useState('');
  const [editPartDescription, setEditPartDescription] = useState('');
 
  const [filterId, setFilterId] = useState('');
  const username = 'manager';
  const password = 'manager';
  const basicAuth = 'Basic ' + btoa(username + ':' + password);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apilink, {
          headers: {
            Authorization: basicAuth
          }
        });
        setData(response.data);
        setFilteredData(response.data['value'])
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilterPartNum(event.target.value);
    const filtered = data.value.filter(part => part.PartNum.includes(event.target.value));
    setFilteredData(filtered);
    setFilterId(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    const { value } = event.target;
    setEditPartDescription(value);
    
  };

  const handleSaveDescription = async (PartNum) => {
    try {
 

      const response = await axios.patch(apilink+`(EPIC06,${PartNum})`,{
        PartDescription: editPartDescription
      }, {
        headers: {
          Authorization: basicAuth
        }
      });

      setData(response.data);
      setFilteredData(response.data.value);
    } catch (error) {
      console.error('Error updating part description:', error);
    }
  };

  return (
    <div>
      <h1>API Data:</h1>
      <input
        type="text"
        value={filterPartNum}
        onChange={handleFilterChange}
        placeholder="Filter by Part Number..."
      />
      {data ? (
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>PartNum</th>
              <th>PartDescription</th>
              <th>ClassID</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((part, index) => (
              <tr key={index}>
                <td>{part.Company}</td>
                <td>{part.PartNum}</td>
                <td>
                  <input
                    type="text"
                    value={part.PartDescription}
                    onChange={(e)=>{handleDescriptionChange(e)}}
                    placeholder="Edit part description..."
                  />
                </td>
                <td>{part.ClassID}</td>
                <td><button onClick={handleSaveDescription(part.PartNum)}>save</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default FetchData;
