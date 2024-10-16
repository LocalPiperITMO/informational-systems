// src/components/tables/ObjectTable.tsx
import React, { useState } from "react";
import CitiesTable from "./CitiesTable";
import CoordinatesTable from "./CoordinatesTable";
import HumansTable from "./HumansTable";
import { Column, useTable } from "react-table";

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

interface ObjectTableProps {
    data: {
        cities: any[];
        coordinates: any[];
        humans: any[];
    };
}

const ObjectTable: React.FC<ObjectTableProps> = ({ data }) => {
    const [currentTable, setCurrentTable] = useState(0);
    const names = ["Cities", "Coordinates", "Humans"];

    const handleNext = () => {
        setCurrentTable((currentTable + 1) % names.length);
    };

    const handlePrevious = () => {
        setCurrentTable((currentTable - 1 + names.length) % names.length);
    };

    return (
        <div>
            <h1>{names[currentTable]}</h1>
            {currentTable === 0 && <CitiesTable data={data.cities} />}
            {currentTable === 1 && <CoordinatesTable data={data.coordinates} />}
            {currentTable === 2 && <HumansTable data={data.humans} />}
            <div>
                <button onClick={handlePrevious}>◀</button>
                <button onClick={handleNext}>▶</button>
            </div>
        </div>
    );
};

export default ObjectTable;
