import * as React from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import EditIcon from "@mui/icons-material/Edit";
import { useTodo } from "../../api/todo/todoAll";
import { Typography } from "@mui/material";

const muiCache = createCache({
  key: "mui-datatables",
  prepend: true,
});

interface TableProps {
  id: string;
}

interface TodoItem {
  title: string;
  due_at: string;
  priority: string;
  status: string;
}

const Table: React.FC<TableProps> = (props: TableProps) => {
  const todo = useTodo(props.id);

  const mappedTodo = todo.data?.data?.map((item: TodoItem) => ({
    title: item.title,
    dueDate: new Date(item.due_at).toLocaleString(),
    priority: item.priority.toString(),
    status: item.status.toString(),
  }));

  const columns = [
    { name: "title", label: "Title", options: { filter: false } },
    { name: "dueDate", label: "Due Date", options: { filter: false } },
    {
      name: "priority",
      label: "Priority",
      options: {
        filterOptions: { fullWidth: true },
        customBodyRenderLite: (dataIndex: number) => {
          const getPriorityIcon = (priority: string) => {
            switch (priority) {
              case "1":
                return <img src="/images/critical.svg" alt="High Priority" />;
              case "2":
                return <img src="/images/high.svg" alt="High Priority" />;
              case "3":
                return <img src="/images/low.svg" alt="High Priority" />;
              default:
                return null;
            }
          };
          return getPriorityIcon(mappedTodo[dataIndex].priority);
        },
      },
    },
    {
      name: "status",
      label: "Current Status",
      options: {
        filterOptions: { fullWidth: true },
        customBodyRenderLite: (dataIndex: number) => {
          const getPriorityIcon = (priority: string) => {
            switch (priority) {
              case "1":
                return (
                  <>
                    <img src="/images/complete.svg" alt="Completed" />
                    <Typography
                      component="span"
                      sx={{
                        marginLeft: 1,
                        fontFamily: "inherit",
                        fontSize: 14,
                      }}
                    >
                      Completed
                    </Typography>
                  </>
                );
              case "2":
                return <img src="/images/in-progress.svg" alt="In Progress" />;
              case "3":
                return (
                  <>
                    <img src="/images/not-started.svg" alt="Not Started" />
                    <Typography
                      component="span"
                      sx={{
                        marginLeft: 1,
                        fontFamily: "inherit",
                        fontSize: 14,
                      }}
                    >
                      Not Started
                    </Typography>
                  </>
                );
              case "4":
                return <img src="/images/cancelled.svg" alt="Cancelled" />;
              default:
                return null;
            }
          };
          return getPriorityIcon(mappedTodo[dataIndex].status);
        },
      },
    },
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

  return (
    <CacheProvider value={muiCache}>
      <ThemeProvider theme={createTheme()}>
        <MUIDataTable
          title={""}
          data={mappedTodo}
          columns={columns}
          options={options}
        />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default Table;
