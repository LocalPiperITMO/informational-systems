import React, { useEffect, useState } from 'react';

interface TableData {
  name: string;
  data: any[]; // Using any[] is okay since we are dealing with dynamically shaped data
}

const Table: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [currentTable, setCurrentTable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tableNames = ["Cities", "Coordinates", "Humans"];

  // Function to fetch data for the tables using POST requests
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Cities
      const citiesResponse = await fetch('http://localhost:8080/api/data/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}) // Send an empty body or any required payload
      });

      const citiesData = citiesResponse.status == 200 ? await citiesResponse.json() : { cities: [] };

      // Fetch Coordinates
      const coordinatesResponse = await fetch('http://localhost:8080/api/data/coordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      const coordinatesData = coordinatesResponse.status == 200 ? await coordinatesResponse.json() : { coordinates: [] };

      // Fetch Humans
      const humansResponse = await fetch('http://localhost:8080/api/data/humans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });
      
      const humansData = humansResponse.status == 200 ? await humansResponse.json() : { humans: [] };

      // Create an array of formatted tables
      const formattedTables = [
        { name: tableNames[0], data: citiesData.cities },
        { name: tableNames[1], data: coordinatesData.coordinates },
        { name: tableNames[2], data: humansData.humans },
      ];

      setTables(formattedTables);
    } catch (err: any) {
      setError(err.message); // Handle errors gracefully
      setTables(tableNames.map(name => ({ name, data: [] }))); // Fallback for empty data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const nextTable = () => {
    setCurrentTable((prevTable) => (prevTable + 1) % tables.length);
  };

  const prevTable = () => {
    setCurrentTable((prevTable) => (prevTable - 1 + tables.length) % tables.length);
  };

  // Current table data
  const currentTableData = tables[currentTable];

  return (
    <div style={{ width: '500px', height: '300px', border: '1px solid black', padding: '10px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed Table Name */}
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px', position: 'sticky', top: 0, background: 'white', zIndex: 2 }}>
        {currentTableData ? currentTableData.name : ''}
      </div>

      <div style={{ overflow: 'auto', flexGrow: 1 }}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center' }}>
            Error: {error}
          </div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {currentTableData.data.length > 0
                    ? Object.keys(currentTableData.data[0]).map((key) => (
                      <th key={key} style={{ border: '1px solid black', padding: '8px' }}>
                        {key}
                      </th>
                    ))
                    : tableNames[currentTable] === "Cities"
                      ? ["id", "name", "area", "population", "capital", "telephoneCode", "climate"].map((key, index) => (
                        <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
                          {key}
                        </th>
                      ))
                      : tableNames[currentTable] === "Coordinates"
                      ? ["id", "x", "y"].map((key, index) => (
                        <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
                          {key}
                        </th>
                      ))
                      : ["id", "age"].map((key, index) => (
                        <th key={index} style={{ border: '1px solid black', padding: '8px' }}>
                          {key}
                        </th>
                      ))
                  }
                </tr>
              </thead>
              <tbody>
                {currentTableData.data.length === 0 ? (
                  <tr>
                    <td colSpan={Object.keys(currentTableData).length} style={{ textAlign: 'center' }}>
                      No data available.
                    </td>
                  </tr>
                ) : (
                  currentTableData.data.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, i) => (
                        <td key={i} style={{ border: '1px solid black', padding: '8px' }}>
                          {value !== undefined ? String(value) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '100%', zIndex: 1 }}>
        <button onClick={prevTable} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', margin: '0 10px' }}>
          ◀
        </button>
        <button onClick={nextTable} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', margin: '0 10px' }}>
          ▶
        </button>
      </div>
    </div>
  );
};

export default Table;
