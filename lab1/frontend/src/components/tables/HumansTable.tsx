import React from "react";
import { CommonTable } from "./ObjectTable";
import { Column } from "react-table";

export interface Human {
  id: number,
  age: number,
  owner: string,
  modifiable: boolean
}

interface HumansTableProps {
  data: Human[];
}

const HumansTable: React.FC<HumansTableProps> = ({ data }) => {  
    const columns : Column<Human>[] = React.useMemo(
      () => [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Age', accessor: 'age' },
        { Header: 'Owner', accessor: 'owner'}
      ],
      []
    );
  
    return <CommonTable data={data} columns={columns} />;
  };

  export default HumansTable;