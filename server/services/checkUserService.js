import pool from "../config/db.js";

export const checkUserExists = async (username, shouldExist = true) => {
  const userExists = await pool.query(
    "SELECT * FROM user WHERE u_name = ? LIMIT 1",
    [username]
  );

  const [rows] = userExists;

  if (Object.keys(rows).length === 0) {
    return null;
  }
  const exists = userExists.rows.length > 0;
  if (shouldExist && !exists) throw new Error("User not found");
  if (!shouldExist && exists) throw new Error("Email already registered");

  return { exists, userData: exists ? userExists.rows[0] : undefined };
};
