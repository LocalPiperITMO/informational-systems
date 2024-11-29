import React from "react";
import { CommonTable } from "./ObjectTable";
import { Column } from "react-table";

export interface Imop {
  id: number,
  status: string,
  username: string,
  objectCount: number;
}

interface ImopsTableProps {
  data: Imop[];
}

const ImopsTable: React.FC<ImopsTableProps> = ({ data }) => {  
    const columns : Column<Imop>[] = React.useMemo(
      () => [
        { Header: 'ID', accessor: 'id' },
        { Header: 'Status', accessor: 'status' },
        { Header: 'User', accessor: 'username'},
        { Header: 'Object Count', accessor: 'objectCount'}
      ],
      []
    );
  
    return <CommonTable data={data} columns={columns} />;
  };

  export default ImopsTable;