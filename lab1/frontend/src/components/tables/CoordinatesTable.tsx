import React from "react";
import { CommonTable } from "./ObjectTable";
import { Column } from "react-table";

export interface Coordinates {
  id: number,
  x: number,
  y: string
}

interface CoordinatesTableProps {
  data: Coordinates[];
}

const CoordinatesTable : React.FC<CoordinatesTableProps> = ({ data }) => {
  const columns : Column<Coordinates>[] = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'X', accessor: 'x' },
      { Header: 'Y', 
        accessor: 'y',
        Cell: ({ value }) => Number(value) 
      },
    ],
    []
  );
    return <CommonTable data={data} columns={columns} />;
  };

  export default CoordinatesTable;