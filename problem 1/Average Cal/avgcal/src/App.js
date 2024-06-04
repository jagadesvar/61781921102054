import React, { useState } from 'react';
import './App.css';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);
  const [loading, setLoading] = useState(false);
  const [typeId, setTypeId] = useState('primes'); 

  const fetchData = () => {
    setLoading(true);
    fetch(`http://localhost:9876/${typeId}`)
      .then(response => response.json())
      .then(data => {
        setNumbers(data.numbers);
        setAvg(data.numbers.reduce((a, b) => a + b, 0) / data.numbers.length);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator</h1>
        <div>
          <label>
            Select Number Type:
            <select value={typeId} onChange={e => setTypeId(e.target.value)}>
              <option value="primes">Primes</option>
              <option value="fibonacci">Fibonacci</option>
              <option value="even">Even</option>
              <option value="random">Random</option>
            </select>
          </label>
          <button onClick={fetchData}>Fetch Data</button>
        </div>
        {loading ? <p>Loading...</p> : (
          <div>
            <h2>Numbers: {numbers.join(', ')}</h2>
            <h2>Average: {avg.toFixed(2)}</h2>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
