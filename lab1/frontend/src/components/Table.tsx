import React, { useState } from 'react';

// Mock Data for the three tables, including names
const tables = [
  {
    name: "User Information",
    data: [
      { name: 'Alice', age: 25, city: 'New York' },
      { name: 'Bob', age: 30, city: 'Los Angeles' },
      { name: 'Charlie', age: 35, city: 'Chicago' },
    ],
  },
  {
    name: "Product List",
    data: [
      { product: 'Laptop', price: 999, inStock: true },
      { product: 'Phone', price: 699, inStock: false },
      { product: 'Tablet', price: 499, inStock: true },
      { product: 'Laptop', price: 999, inStock: true },
      { product: 'Phone', price: 699, inStock: false },
      { product: 'Tablet', price: 499, inStock: true },
      { product: 'Laptop', price: 999, inStock: true },
      { product: 'Phone', price: 699, inStock: false },
      { product: 'Tablet', price: 499, inStock: true },
    ],
  },
  {
    name: "Course Offerings",
    data: [
      { course: 'Math', instructor: 'Dr. Smith', duration: '10 weeks' },
      { course: 'History', instructor: 'Prof. Johnson', duration: '8 weeks' },
      { course: 'Science', instructor: 'Dr. Brown', duration: '12 weeks' },
    ],
  },
];

const Table: React.FC = () => {
  const [currentTable, setCurrentTable] = useState(0);
  const { name: tableName, data } = tables[currentTable];

  // Function to switch to the next table
  const nextTable = () => {
    setCurrentTable((prevTable) => (prevTable + 1) % tables.length);
  };

  // Function to switch to the previous table
  const prevTable = () => {
    setCurrentTable((prevTable) => (prevTable - 1 + tables.length) % tables.length);
  };

  return (
    <div style={{ width: '500px', height: '300px', border: '1px solid black', padding: '10px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Table Name */}
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '10px' }}>
        {tableName}
      </div>

      <div style={{ overflow: 'auto', flexGrow: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th key={key} style={{ border: '1px solid black', padding: '8px' }}>
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
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
