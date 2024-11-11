import React, { useState } from 'react';
import axios from 'axios';

function CutoffApp() {
  const [scores, setScores] = useState({ chemistry: '', physics: '', maths: '' });
  const [result, setResult] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScores({ ...scores, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/calculate_cutoff', {
        chemistry: parseInt(scores.chemistry),
        physics: parseInt(scores.physics),
        maths: parseInt(scores.maths),
      });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error calculating cutoff', error);
      setResult('Error calculating cutoff');
    }
  };

  return (
    <div>
      <h2>Cutoff Mark Calculation</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Chemistry:
          <input type="number" name="chemistry" value={scores.chemistry} onChange={handleChange} required />
        </label>
        <label>
          Physics:
          <input type="number" name="physics" value={scores.physics} onChange={handleChange} required />
        </label>
        <label>
          Maths:
          <input type="number" name="maths" value={scores.maths} onChange={handleChange} required />
        </label>
        <button type="submit">Calculate Cutoff</button>
      </form>
      {result && <h3>Result: {result}</h3>}
    </div>
  );
}

export default CutoffApp;
