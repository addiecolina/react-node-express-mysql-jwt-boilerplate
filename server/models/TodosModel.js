import pool from "../config/db.js";

export const getTodoById = async (user_id) => {
  if (!user_id) {
    return null;
  }

  try {
    const [rows] = await pool.query("SELECT * from todos WHERE user_id = ?", [
      user_id,
    ]);

    if (Object.keys(rows).length === 0) {
      return null;
    }

    return rows;
  } catch (error) {
    return null;
  }
};

export const createTodo = async (
  title,
  description,
  priority,
  status,
  user_id,
  slug,
  due_at,
  subtasks
) => {
  if (
    !title ||
    !description ||
    !priority ||
    !status ||
    !due_at ||
    !slug ||
    !user_id
  ) {
    return null;
  }

  const connection = pool.getConnection();
  try {
    const [rows] = await connection.then((establishedConnection) =>
      establishedConnection.query(
        "INSERT INTO todos (title, description, priority, status, user_id, slug, due_at, subtasks) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          priority,
          status,
          user_id,
          slug,
          due_at,
          JSON.stringify(subtasks),
        ]
      )
    );
    console.log("Record Created:", rows);
    return true;
  } catch (error) {
    console.log(error);
    return null;
  } finally {
    (await connection).release();
  }
};

export const updateTodoById = async (
  title,
  description,
  priority,
  status,
  due_at,
  completed_at,
  slug,
  subtasks
) => {
  if (!title || !description || !priority || !status || !due_at || !slug) {
    return null;
  }

  try {
    const [rows] = await pool.query(
      "UPDATE todos SET title = ?, description = ?, priority = ?, status = ?, due_at = ?, subtasks = ?, completed_at = ? WHERE slug = ?",
      [
        title,
        description,
        priority,
        status,
        due_at,
        JSON.stringify(subtasks),
        completed_at,
        slug,
      ]
    );

    if (Object.keys(rows).length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    return null;
  }
};

export const deleteTodosByIds = async (slugs) => {
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return null;
  }

  try {
    const [result] = await pool.query("DELETE FROM todos WHERE slug IN (?)", [
      slugs,
    ]);

    return result.affectedRows;
  } catch (error) {
    console.log(error);
    return null;
  }
};
