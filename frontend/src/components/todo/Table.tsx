import * as React from "react";
import MUIDataTable, {
  MUIDataTableOptions,
  ExpandButton,
  MUIDataTableExpandButton,
} from "mui-datatables";
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
import { JSX } from "react/jsx-runtime";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import getFlag from "../../utils/getFlag";

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

const TodoTable: React.FC<TableProps> = (props: TableProps) => {
  const todo = useTodo(props.id);
  const dialog = useDialog();
  const deleteTodo = useTodoDelete();

  const mappedTodo = todo.data?.data?.map((item: TodoItem) => ({
    ...item,
    title: item.title,
    // dueDate: dayjs(item.due_at).format("MM/DD/YYYY"),
    priority: item.priority,
    status: item.status,
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
    {
      name: "dueDate",
      label: "Due Date",
      options: {
        filter: false,
        customBodyRenderLite: (dataIndex: number) => {
          const isDue = getFlag(
            mappedTodo[dataIndex].due_at,
            mappedTodo[dataIndex].status,
            mappedTodo[dataIndex].priority
          );

          return (
            <>
              <Typography sx={{ color: isDue, fontSize: "14px" }}>
                {dayjs(mappedTodo[dataIndex].due_at).format("MM/DD/YYYY")}
              </Typography>
              {isDue.flag && (
                <Typography sx={{ color: isDue, fontSize: "14px" }}>
                  {isDue.message}
                </Typography>
              )}
            </>
          );
        },
      },
    },
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
                    <img src="/images/in-progress.svg" alt="In Progress" />
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
      label: "Edit Item",
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
    {
      name: "subtasks",
      label: "",
      options: {
        display: false,
        filter: false,
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
    expandableRows: true,
    expandableRowsHeader: false,
    isRowExpandable: (dataIndex: number) => {
      const isExpandable =
        JSON.parse(mappedTodo[dataIndex].subtasks).length > 0;
      if (!isExpandable) {
        return false;
      }
      return true;
    },
    renderExpandableRow: (rowData) => {
      const data = JSON.parse(rowData[5]);
      return (
        <tr>
          <td colSpan={6}>
            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table style={{ textIndent: "100px" }} aria-label="simple table">
                <TableBody>
                  {data.map(
                    (
                      d: { description: string; status: string },
                      index: number
                    ) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{d.description}</TableCell>
                        <TableCell align="center">{d.status}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </td>
        </tr>
      );
    },
  };

  const components = {
    ExpandButton: function (
      props: JSX.IntrinsicAttributes & MUIDataTableExpandButton
    ) {
      if (mappedTodo && mappedTodo.length > 0) {
        const index = props?.dataIndex;
        if (
          index !== undefined &&
          mappedTodo[index]?.subtasks &&
          JSON.parse(mappedTodo[index]?.subtasks).length === 0
        )
          return <div style={{ width: "24px" }} />;
      }
      return <ExpandButton {...props} />;
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
          components={components}
        />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default TodoTable;
