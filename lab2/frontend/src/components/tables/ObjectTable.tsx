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
      <table {...getTableProps()} className="table table-striped table-bordered table-hover">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                const { key, ...rest } = column.getHeaderProps(column.getSortByToggleProps());
                return (
                  <th key={key} {...rest}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            const { key, ...rest } = row.getRowProps();
            return (
              <tr key={key} {...rest}>
                {row.cells.map(cell => {
                  const { key, ...cellProps } = cell.getCellProps();
                  return (
                    <td key={key} {...cellProps}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

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
        <div className="d-flex flex-column" style={{ height: '100%' }}>
            <h1 className="text-center my-4">{names[currentTable]}</h1>
            <div style={{ flex: '1', overflow: 'auto' }}>
                {currentTable === 0 && <CitiesTable data={data.cities} />}
                {currentTable === 1 && <CoordinatesTable data={data.coordinates} />}
                {currentTable === 2 && <HumansTable data={data.humans} />}
            </div>
            {/* Spacer to prevent overlap with the footer */}
            <div style={{ height: '60px' }} /> {/* Adjust height as needed */}
            {/* Buttons above the footer */}
            <div className="d-flex justify-content-between my-4">
                <button className="btn btn-secondary" onClick={handlePrevious}>Previous</button>
                <button className="btn btn-secondary" onClick={handleNext}>Next</button>
            </div>
        </div>
    );
};

export default ObjectTable;
