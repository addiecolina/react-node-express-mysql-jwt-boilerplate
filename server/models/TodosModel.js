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

export const updateTodoById = async (
  title,
  description,
  priority,
  status,
  due_at,
  slug
) => {
  if (!title || !description || !priority || !status || !due_at || !slug) {
    return null;
  }

  try {
    const [rows] = await pool.query(
      "UPDATE todos SET title = ?, description = ?, priority = ?, status = ?, due_at = ? WHERE slug = ?",
      [title, description, priority, status, due_at, slug]
    );

    if (Object.keys(rows).length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    return null;
  }
};
