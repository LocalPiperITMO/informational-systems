import React from "react";
import { CommonTable } from "./ObjectTable";
import { Column } from "react-table";
import dayjs from "dayjs";

export interface City {
  id: number;
  name: string;
  coordinates: { id: number; x: number; y: number };
  creationDate: string;
  area: number;
  population: number;
  establishmentDate: string | null;
  capital: boolean | null;
  metersAboveSeaLevel: number | null;
  telephoneCode: number;
  climate: string;
  government: string | null;
  human: { id: number, age: number } | null;
}

interface CitiesTableProps {
  data: City[];
}

const CitiesTable: React.FC<CitiesTableProps> = ({ data }) => {
  const columns: Column<City>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Coordinates ID', accessor: row => `${row.coordinates.id}` },
      { 
        Header: 'Creation Date', 
        accessor: 'creationDate',
        Cell: ({ value }) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      { Header: 'Area', accessor: 'area'},
      { Header: 'Population', accessor: 'population' },
      { 
        Header: 'Establishment Date', 
        accessor: 'establishmentDate',
        Cell: ({ value }) => value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : ''
      },
      { 
        Header: 'Capital', 
        accessor: 'capital',
        Cell: ({ value }) => value ? 'Yes' : 'No' 
      },
      { Header: 'MASL', accessor: 'metersAboveSeaLevel' },
      { Header: 'Telephone Code', accessor: 'telephoneCode'},
      { Header: 'Climate', accessor: 'climate' },
      { Header: 'Government', accessor: 'government'},
      { Header: 'Governor ID', accessor: row => `${row.human? row.human.id : 'Not provided'}`}
    ],
    []
  );

  return <CommonTable data={data} columns={columns} />;
};

export default CitiesTable;