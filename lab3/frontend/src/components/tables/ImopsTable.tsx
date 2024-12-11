import React from "react";
import { CommonTable } from "./ObjectTable";
import { Column } from "react-table";
import { toast } from "react-toastify";

export interface Imop {
  id: number;
  status: string;
  username: string;
  filename: string;
  uuid: string;
  objectCount: number;
}

interface ImopsTableProps {
  data: Imop[];
}

const ImopsTable: React.FC<ImopsTableProps> = ({ data }) => {
  // Columns for the table
  const columns: Column<Imop>[] = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Status", accessor: "status" },
      { Header: "User", accessor: "username" },
      { Header: "Filename", accessor: "filename" },
      { Header: "Object Count", accessor: "objectCount" },
      {
        Header: "Actions",
        id: "download",
        Cell: ({ row }: { row: any }) => (
          <button
          className="btn btn-primary" 
          onClick={() => handleDownload(row.original.id, row.original.filename)}>
            Download
          </button>
        ),
      },
    ],
    []
  );

  // Handle file download
  const handleDownload = async (id: number, filename: string) => {
    try {
      // Get token from local storage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
  
      // Request the file from the backend
      const response = await fetch(`http://localhost:8080/api/file/downloadScript?id=${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Add token in the Authorization header
        },
      });
  
      // Check if the response is successful
      if (!response.ok) {
        toast.error(`Failed to download file: ${response.statusText}`);
        return;
      }
      
      // Read the response as a Blob
      const blob = await response.blob();
  
      // Create a URL for the file
      const url = window.URL.createObjectURL(blob);
  
      // Create an anchor element and programmatically click it
      const a = document.createElement("a");
      a.href = url;
      a.download = filename; // Suggested filename
      document.body.appendChild(a);
      a.click();
  
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("File downloaded!")
    } catch (error) {
      toast.error("Error downloading the file")
      alert("Failed to download file. Please try again.");
    }
  };
  

  return <CommonTable data={data} columns={columns} />;
};

export default ImopsTable;
