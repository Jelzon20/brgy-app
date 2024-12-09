import React from 'react'
import { useState, useEffect } from "react";
import moment from "moment/moment.js";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SearchIcon } from "../Icons/icons";
import DownloadBtn from "../components/DownloadBtn.jsx";
import DebouncedInput from "../components/DebouncedInput.jsx";
import { Toaster, toast } from 'sonner'


export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [data] = useState(() => [...residents]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [fileNameDate, setFileNameDate] = useState('');
  const columnHelper = createColumnHelper();
  

  const columns = [

    columnHelper.accessor(residents => residents.resident_photo, {

      cell: (info) => (
        <img
          src={info?.getValue()}
          alt="..."
          className="mr-10 rounded-full w-10 h-10 object-cover"
        />
      ),
      header: "Resident Photo",
    }),
    columnHelper.accessor(residents => residents.first_name, {
      cell: (info) => <span className='mr-10'>{info.getValue()}</span>,
      header: "First name",
    }),
  ];


  useEffect(() => {
    const getResidents = async () => {
      try {
        const res = await fetch(`/api/resident/getResidents`);
        const data = await res.json();
        if (res.ok) {
          setResidents(data.residents);
        }
      } catch (error) {
        toast.error(data.message)
      }
    };
    getResidents();
  },[]);

  console.log(residents);

  const table = useReactTable({
    data: residents,
    columns,
    state: {
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const date = new Date();
    setFileNameDate(moment(date).format('MM/DD/YYYY'));
  }, [residents]);

  return (
    <div className="p-2 max-w-full mx-auto text-white fill-gray-400">
    <Toaster richColors position="top-center" expand={true} />

    <div className="flex justify-between mb-2">
      <div className="w-full flex items-center gap-1">
        <SearchIcon />
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 bg-transparent outline-none border-b-2 w-1/5 focus:w-1/3 duration-300 border-indigo-500 text-gray-900 dark:text-white"
          placeholder="Search all columns..."
        />
      </div>
      <DownloadBtn data={residents} fileName={fileNameDate + " - residents"} />
    </div>
    <table className="border border-gray-700 w-full text-left">
      <thead className="bg-indigo-600">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="capitalize px-3.5 py-2">
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>


        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row, i) => (
            <tr
              key={row.id}
              className={`
                ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                `}
            >

              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3.5 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr className="text-center h-32 text-gray-900 dark:text-white">
            <td colSpan={12}>No Record Found!</td>
          </tr>
        )}
      </tbody>
    </table>
    
    {/* pagination */}
    <div className="flex items-center justify-end mt-2 gap-2 text-gray-900 dark:text-white">
      <button
        onClick={() => {
          table.previousPage();
        }}
        disabled={!table.getCanPreviousPage()}
        className="p-1 border border-gray-300 px-2 disabled:opacity-30"
      >
        {"<"}
      </button>
      <button
        onClick={() => {
          table.nextPage();
        }}
        disabled={!table.getCanNextPage()}
        className="p-1 border dark:border-gray-300 px-2 disabled:opacity-30"
      >
        {">"}
      </button>

      <span className="flex items-center gap-1">
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        | Go to page:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="border p-1 rounded w-16 bg-transparent"
        />
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        className="p-2 bg-transparent"
      >
        {[10, 20, 30, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  </div>
  )
}
