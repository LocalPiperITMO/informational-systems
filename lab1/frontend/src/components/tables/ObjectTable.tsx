// src/components/tables/ObjectTable.tsx
import React, { useState } from "react";
import { Column, useTable, useSortBy, useGlobalFilter, TableInstance } from "react-table";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/ObjectTable.css';
import CitiesTable from "./CitiesTable";
import CoordinatesTable from "./CoordinatesTable";
import HumansTable from "./HumansTable";

interface CommonTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
}

export const CommonTable = <T extends object>({ data, columns }: CommonTableProps<T>) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  }: TableInstance<T> = useTable<T>(
    { columns, data },
    useGlobalFilter,
    useSortBy
  );

  return (
    <div className="table-responsive">
      <input
        type="text"
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className="form-control mb-3"
      />
      <table {...getTableProps()} className="table table-striped table-bordered">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
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
    </div>
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
            <div className="button-group">
                <button className="btn btn-primary" onClick={handlePrevious}>◀</button>
                <button className="btn btn-primary" onClick={handleNext}>▶</button>
            </div>
        </div>
    );
};

export default ObjectTable;
