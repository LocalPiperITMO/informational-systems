import React, { useState, useEffect } from "react";
import { useTable, Column } from "react-table";
import CitiesTable, { City } from "./CitiesTable";
import CoordinatesTable, { Coordinates } from "./CoordinatesTable";
import HumansTable, { Human } from "./HumansTable";
import { fetchCitiesData, fetchCoordinatesData, fetchHumansData } from "../../services/dataService";

interface CommonTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
}

export const CommonTable = <T extends object>({ data, columns }: CommonTableProps<T>) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const ObjectTable: React.FC = () => {
  const [currentTable, setCurrentTable] = useState(0);
  const [currentName, setCurrentName] = useState(0);
  const names = ["Cities", "Coordinates", "Humans"];
  const [data, setData] = useState<{ cities: City[]; coordinates: Coordinates[]; humans: Human[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const cities = await fetchCitiesData();
      const coordinates = await fetchCoordinatesData();
      const humans = await fetchHumansData();
      setData({ cities, coordinates, humans });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNext = () => {
    setCurrentTable((currentTable + 1) % names.length);
    setCurrentName((currentName + 1) % names.length);
  };

  const handlePrevious = () => {
    setCurrentTable((currentTable - 1 + names.length) % names.length);
    setCurrentName((currentName - 1 + names.length) % names.length);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{names[currentName]}</h1>
      { data ? (
        <>
          {currentName === 0 && <CitiesTable data={data.cities} />}
          {currentName === 1 && <CoordinatesTable data={data.coordinates} />}
          {currentName === 2 && <HumansTable data={data.humans} />}
        </>
      ) : (
        <div>No data available</div>
      )}
      <div>
        <button onClick={handlePrevious}>◀</button>
        <button onClick={handleNext}>▶</button>
      </div>
    </div>
  );
};

export default ObjectTable;
