// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [protocol, setProtocol] = useState('TCP');
    const [chemistryMarks, setChemistryMarks] = useState('');
    const [physicsMarks, setPhysicsMarks] = useState('');
    const [mathsMarks, setMathsMarks] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post(`http://localhost:5000/calculate_cutoff`, {
                protocol,
                chemistry: parseInt(chemistryMarks),
                physics: parseInt(physicsMarks),
                maths: parseInt(mathsMarks),
            });
            setResult(response.data);
        } catch (err) {
            setError('Error calculating cutoff: ' + err.message);
        }
    };

    return (
        <div className="container">
            <h1>Cutoff Mark Calculation</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Protocol:</label>
                    <select value={protocol} onChange={(e) => setProtocol(e.target.value)}>
                        <option value="tcp">TCP</option>
                        <option value="udp">UDP</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Chemistry Marks:</label>
                    <input
                        type="number"
                        value={chemistryMarks}
                        onChange={(e) => setChemistryMarks(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Physics Marks:</label>
                    <input
                        type="number"
                        value={physicsMarks}
                        onChange={(e) => setPhysicsMarks(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Maths Marks:</label>
                    <input
                        type="number"
                        value={mathsMarks}
                        onChange={(e) => setMathsMarks(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Calculate Cutoff</button>
            </form>
            {result && (
                <div className={`result ${result.result.includes("Fail") ? "fail" : ""}`}>
                    <h2>Result:</h2>
                    <p>Cutoff Mark: {result.cutoff_mark.toFixed(2)}</p>
                    <p>Status: {result.result}</p>
                </div>
            )}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default App;
