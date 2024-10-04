import React, { useEffect, useState } from 'react';

// Data structure to represent the tables
interface TableData {
  name: string;
  data: Array<Record<string, any>>;
}

const Table: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [currentTable, setCurrentTable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tableNames = ["User Information", "Product List", "Course Offerings"];

  // Function to fetch data for the tables
  const fetchData = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all([
        fetch('/api/user-info'), // Endpoint for User Information
        fetch('/api/product-list'), // Endpoint for Product List
        fetch('/api/course-offerings') // Endpoint for Course Offerings
      ]);

      if (!responses.every(res => res.ok)) {
        throw new Error("Failed to fetch data for one or more tables.");
      }

      const data = await Promise.all(responses.map(res => res.json()));

      const formattedTables = data.map((tableData, index) => {
        return {
          name: tableNames[index],
          data: tableData,
        };
      });

      setTables(formattedTables);
    } catch (err : any) {
      setError(err.message);
      setTables(tableNames.map(name => ({ name, data: [] }))); // Prepare empty data
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

  // Fixed data for the current table
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
        ) : currentTableData.data.length === 0 ? (
          <div style={{ textAlign: 'center' }}>
            No data available.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {currentTableData.data.length > 0 &&
                  Object.keys(currentTableData.data[0]).map((key) => (
                    <th key={key} style={{ border: '1px solid black', padding: '8px' }}>
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {currentTableData.data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} style={{ border: '1px solid black', padding: '8px' }}>
                      {value !== undefined ? String(value) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
