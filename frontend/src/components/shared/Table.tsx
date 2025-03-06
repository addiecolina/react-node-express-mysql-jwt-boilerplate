import * as React from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import EditIcon from "@mui/icons-material/Edit";
import { useTodo } from "../../api/todo/todoAll";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

interface TableProps {
  id: string;
}

const Table: React.FC<TableProps> = (props: TableProps) => {
  const todo = useTodo(props.id);
  console.log(todo);
  const columns = [
    { name: "Title", options: { filter: false } },
    { name: "Task", options: { filter: false } },
    { name: "Priority", options: { filterOptions: { fullWidth: true } } },
    { name: "Current State", options: { filterOptions: { fullWidth: true } } },
    {
      name: "",
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRenderLite: (dataIndex: number, rowIndex: number) => {
          return (
            <EditIcon
              sx={{ cursor: "pointer" }}
              onClick={() => console.log("foo", dataIndex, rowIndex)}
            />
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
