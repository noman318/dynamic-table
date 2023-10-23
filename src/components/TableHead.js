/* eslint-disable no-unused-vars, array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */

import {
  Box,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React from "react";
import { visuallyHidden } from "@mui/utils";

const CustomTableHead = ({ order, orderBy, headCells, onRequestSort }) => {
  const ignoreHeadCells = ["thumbnailUrl", "albumId"];
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const newHeadCells = headCells?.filter(
    (item) => !ignoreHeadCells.includes(item.label)
  );
  return (
    <TableHead>
      <TableRow>
        {headCells?.map((headCell, index) => (
          <TableCell
            key={index}
            // align={headCell?.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell?.id ? order : false}
            sx={{
              fontSize: "20px",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell}
              direction={orderBy === headCell ? order : "asc"}
              onClick={createSortHandler(headCell)}
            >
              {headCell}
              {orderBy === headCell ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default CustomTableHead;
