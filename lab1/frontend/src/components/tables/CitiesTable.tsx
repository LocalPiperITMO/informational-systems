import React from "react";
import { CommonTable } from "./ObjectTable";
import { Column } from "react-table";
import dayjs from "dayjs";

export interface City {
  id: number;
  name: string;
  coordinatesId: number;
  creationDate: string;
  area: number;
  population: number;
  establishmentDate: string | null;
  capital: boolean | null;
  metersAboveSeaLevel: number | null;
  telephoneCode: number;
  climate: string;
  government: string | null;
  humanId: number | null;
}

interface CitiesTableProps {
  data: City[];
}

const CitiesTable: React.FC<CitiesTableProps> = ({ data }) => {
  const columns: Column<City>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Coordinates', accessor: 'coordinatesId' },
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
      { Header: 'Capital', accessor: 'capital' },
      { Header: 'MASL', accessor: 'metersAboveSeaLevel' },
      { Header: 'Telephone Code', accessor: 'telephoneCode'},
      { Header: 'Climate', accessor: 'climate' },
      { Header: 'Government', accessor: 'government'},
      { Header: 'Governor', accessor: 'humanId'}
    ],
    []
  );

  return <CommonTable data={data} columns={columns} />;
};

export default CitiesTable;