import pool from "../config/db.js";

export const createUser = async (username, password) => {
  if (!username || !password) {
    return null;
  }
  const connection = pool.getConnection();

  try {
    const [rows] = await connection.then((establishedConnection) =>
      establishedConnection.query(
        "INSERT INTO user (u_user_id, u_name, u_email, u_password) VALUES (?, ?, ?, ?)",
        [
          `UID${Math.floor(100000000 * 899999999)}`,
          username,
          "test@test.com",
          password,
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
