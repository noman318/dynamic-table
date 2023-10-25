/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars, array-callback-return */

import axios from "axios";
import React, { useState, useEffect, useMemo } from "react";
import CustomTableHead from "./TableHead";
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";

const Table = () => {
  const [tableData, setTableData] = useState([]);
  const [tableHead, setTableHead] = useState();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  const getData = () =>
    axios.get(`https://jsonplaceholder.typicode.com/photos`);
  const ignoreHeadCells = ["thumbnailUrl", "albumId"];

  useEffect(() => {
    const getTableData = async () => {
      const results = await getData();
      const header = results?.data[0];
      const headData = Object.keys(header);
      const newHead = headData?.filter(
        (item) => !ignoreHeadCells.includes(item)
      );
      setTableData(results?.data?.splice(0, 20));
      setTableHead(newHead);
    };
    getTableData();
  }, []);

  const filterData = (e) => {
    const fiterValue = e.target.value;
    // console.log("fiterValue", fiterValue);
    if (fiterValue === "All") {
      setFilteredData(tableData);
      return;
    }
    const filterDataFromTable = tableData?.filter(
      (data) => data.title === fiterValue
    );
    setFilteredData(filterDataFromTable);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    // console.log("searchTerm", searchTerm);
    setSearchText(searchTerm?.toLowerCase());
  };

  const getAllTitle = () => {
    let uniqueTitle = [];
    tableData?.map((data) => {
      if (data.title && uniqueTitle.indexOf(data.title) === -1) {
        uniqueTitle.push(data.title);
      }
    });
    // console.log("uniqueTitle", uniqueTitle);
    return uniqueTitle;
  };
  // getAllTitle();
  // console.log("searchText", searchText);
  // const visibleRows = useMemo(
  //   () =>
  //     stableSort(filteredData, getComparator(order, orderBy)).slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     ),
  //   [tableData, filteredData, order, orderBy, page, rowsPerPage]
  // );

  // console.log("searchedData", searchedData);

  const newVisibleRows = useMemo(() => {
    if (searchText?.length > 0) {
      const searchedData = tableData.filter((data) => {
        return tableHead.some((field) => {
          const value = data[field];
          if (
            typeof value === "string" &&
            value.toLowerCase().includes(searchText.toLowerCase())
          ) {
            return true;
          }
          return false;
        });
      });
      // setSearchResults(searchedData);
      return stableSort(searchedData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else if (filteredData.length > 0) {
      return stableSort(filteredData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    } else {
      return stableSort(tableData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );
    }
  }, [tableData, filteredData, searchText, order, orderBy, page, rowsPerPage]);
  // console.log("newVisibleRows", newVisibleRows);

  const getCellContent = (row, head) => {
    // console.log("typeofRow", row);
    // console.log("typeofRow", head);
    // console.log("typeofRowHead", row[head]);

    return <div>{row[head]}</div>;
  };
  return (
    <div>
      <h2>Table</h2>
      <Input
        // id="demo-simple-select-autowidth-label"
        placeholder="Search..."
        onChange={handleSearch}
      />

      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Title</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          // value={age}
          onChange={filterData}
          autoWidth
          label="Age"
        >
          <MenuItem value="All">All</MenuItem>
          {getAllTitle() &&
            getAllTitle()?.map((data, index) => (
              <MenuItem value={data} key={index}>
                {data}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <TableContainer>
        <table>
          <CustomTableHead
            headCells={tableHead}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {newVisibleRows?.map((row, index) => {
              return (
                <TableRow
                  hover
                  //   onClick={() => {}}
                  //   aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={`${index}`}
                  //   selected={isItemSelected}
                >
                  {tableHead?.map((head, hIndex) => (
                    <TableCell key={hIndex} id="table_height">
                      <>
                        <div className="">{getCellContent(row, head)}</div>
                      </>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableData?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </table>
      </TableContainer>
    </div>
  );
};

export default Table;
