import React from "react";
import { CommonTable } from "./ObjectTable";
import { Column } from "react-table";

export interface City {
  id: number;
  name: string;
  coordinates_id: number;
  creation_date: Date;
  area: number;
  population: number;
  establishment_date: Date | null;
  capital: boolean | null;
  meters_above_sea_level: number | null;
  telephone_code: number;
  climate: string;
  government: string | null;
  human_id: number | null;
}

interface CitiesTableProps {
  data: City[];
}

const CitiesTable: React.FC<CitiesTableProps> = ({ data }) => {
  const columns: Column<City>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Coordinates', accessor: 'coordinates_id' },
      { Header: 'Creation Date', accessor: 'creation_date' },
      { Header: 'Area', accessor: 'area'},
      { Header: 'Population', accessor: 'population' },
      { Header: 'Establishment Date', accessor: 'establishment_date' },
      { Header: 'Capital', accessor: 'capital' },
      { Header: 'MASL', accessor: 'meters_above_sea_level' },
      { Header: 'Telephone Code', accessor: 'telephone_code'},
      { Header: 'Climate', accessor: 'climate' },
      { Header: 'Government', accessor: 'government'},
      { Header: 'Governor', accessor: 'human_id'}
    ],
    []
  );

  return <CommonTable data={data} columns={columns} />;
};

export default CitiesTable;