import * as React from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import EditIcon from "@mui/icons-material/Edit";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

const Table: React.FC = () => {
  const columns = [
    { name: "Title", options: { filter: false } },
    { name: "Task", options: { filter: false } },
    { name: "Priority", options: { filterOptions: { fullWidth: true } } },
    { name: "Current State", options: { filterOptions: { fullWidth: true } } },
    {
      name: "Edit",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex: number, rowIndex: number) => {
          return (
            <EditIcon onClick={() => console.log("foo", dataIndex, rowIndex)} />
          );
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    filterType: "dropdown",
    responsive: "vertical",
  };

  const data = [
    ["Task 1", "First Task", "Critical", "Completed"],
    ["Task 2", "Second Task", "High", "Pending"],
    ["Task 3", "Third Task", "Medium", "Completed"],
    ["Task 4", "Fourth Task", "Low", "In-Progress"],
  ];

  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={createTheme()}>
        <MUIDataTable
          title={""}
          data={data}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default Table;
