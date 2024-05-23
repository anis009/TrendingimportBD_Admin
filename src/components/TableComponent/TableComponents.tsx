import React from 'react';
import { useTable, useSortBy, usePagination, Column } from 'react-table';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface IRequestCallBack {
  departure: string;
  arrival: string;
  // Add other properties as needed
}

interface TableComponentProps {
  columns: any;
  data: any[];
  className: any;
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of using 'rows', we use page here
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our initial page index
    },
    useSortBy,
    usePagination,
  );

  // Render the UI for your table
  return (
    <>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead className="bg-gray-800 text-black dark:text-white">
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-4 py-2 text-left cursor-pointer"
                >
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
          {page.map((row: any) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td {...cell.getCellProps()} className="px-4 py-2">
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr className="my-4" />
      <div className="pagination  flex  justify-between py-5 items-center">
        <div className="flex items-center">
          <button
            type="button"
            className={`
    disabled:opacity-25 px-2 py-1 rounded-md outline-none
    hover:bg-gray-200 focus:outline-none focus:ring-0 text-sm disabled:cursor-not-allowed
    ${
      canPreviousPage
        ? 'bg-green-500 text-black dark:bg-white dark:text-black'
        : 'bg-green-700 text-white'
    }
    focus:ring-offset-2 ${
      canPreviousPage ? 'focus:ring-primary-500' : 'focus:ring-white'
    }
  `}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            First Page
          </button>

          <button
            type="button"
            className={`disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ml-3 disabled:bg-purple-800 bg-purple-950 px-2 py-1 rounded-md hover:bg-purple-400 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-primary-500 ${
              !canPreviousPage ? 'disabled' : ''
            }`}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <FaAngleLeft className="w-5 h-5 text-white" />
          </button>
          <button
            type="button"
            className={`disabled:opacity-50 px-2 py-1 disabled:bg-purple-500 ml-2 rounded-md bg-purple-950 hover:bg-purple-500 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary-500 ${
              !canNextPage ? 'disabled' : ''
            }`}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <FaAngleRight className="w-5 h-5 text-white" />
          </button>
          <button
            type="button"
            className={`
    disabled:opacity-50 px-2 py-1 ml-3 rounded-md text-sm hover:bg-gray-200 focus:outline-none focus:ring-0 focus:ring-offset-2 focus:ring-primary-500
    ${
      canNextPage
        ? 'bg-green-500 text-black dark:bg-white dark:text-black'
        : 'bg-green-700 text-white'
    }
  `}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            Last Page
          </button>

          <span className="text-sm font-medium px-2">
            Page {pageIndex + 1} of {pageCount}
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Items per page</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium mx-2">|</span>
          <span className="text-sm font-medium">Go to page:</span>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-16"
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default TableComponent;
