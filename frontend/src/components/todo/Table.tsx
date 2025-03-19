import * as React from "react";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import EditIcon from "@mui/icons-material/Edit";
import { useTodo } from "../../api/todo/todoAll";
import { Link, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import dayjs from "dayjs";
import { useDialog } from "muibox";
import { useTodoDelete } from "../../api/todo/todoDelete";

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
  const dialog = useDialog();
  const deleteTodo = useTodoDelete();

  const mappedTodo = todo.data?.data?.map((item: TodoItem) => ({
    ...item,
    title: item.title,
    dueDate: dayjs(item.due_at).format("MM/DD/YYYY"),
    priority: item.priority.toString(),
    status: item.status.toString(),
  }));

  const columns = [
    {
      name: "title",
      label: "Title",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex: number) => {
          return (
            <Link
              component={RouterLink}
              to="/admin/details"
              state={{ mode: "view", data: mappedTodo[dataIndex] }}
            >
              {mappedTodo[dataIndex].title}
            </Link>
          );
        },
      },
    },
    { name: "dueDate", label: "Due Date", options: { filter: false } },
    {
      name: "priority",
      label: "Priority",
      options: {
        filterOptions: { fullWidth: true },
        customBodyRenderLite: (dataIndex: number) => {
          const getPriorityIcon = (priority: string) => {
            switch (priority) {
              case "Critical":
                return (
                  <img src="/images/critical.svg" alt="Critical Priority" />
                );
              case "High":
                return <img src="/images/high.svg" alt="High Priority" />;
              case "Low":
                return <img src="/images/low.svg" alt="Low Priority" />;
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
              case "Completed":
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
              case "In Progress":
                return (
                  <>
                    <img src="/images/in-progress.svg" alt="In Progress" />;
                    <Typography
                      component="span"
                      sx={{
                        marginLeft: 1,
                        fontFamily: "inherit",
                        fontSize: 14,
                      }}
                    >
                      In Progress
                    </Typography>
                  </>
                );

              case "Not Started":
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
              case "Cancelled":
                return (
                  <>
                    <img src="/images/cancelled.svg" alt="Cancelled" />
                    <Typography
                      component="span"
                      sx={{
                        marginLeft: 1,
                        fontFamily: "inherit",
                        fontSize: 14,
                      }}
                    >
                      Cancelled
                    </Typography>
                  </>
                );

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
        customBodyRenderLite: (dataIndex: number) => {
          return (
            <Link
              component={RouterLink}
              to="/admin/details"
              state={{ mode: "edit", data: mappedTodo[dataIndex] }}
            >
              <EditIcon />
            </Link>
          );
        },
      },
    },
  ];

  const options: MUIDataTableOptions = {
    filterType: "dropdown",
    responsive: "vertical",
    onRowsDelete: (data) => {
      const recordMap = data.data.map(
        (record: { index: number }) => mappedTodo[record.index].slug
      );
      dialog
        .confirm(
          `${recordMap.length} tasks will be deleted. Do you want to proceed?`
        )
        .then(() => {
          console.log(recordMap);
          deleteTodo.mutate(recordMap);
        })
        .catch(() => console.log("Cancelled Deletion!"));
    },
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
