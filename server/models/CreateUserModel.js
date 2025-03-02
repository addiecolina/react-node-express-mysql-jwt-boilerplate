import pool from "../config/db.js";
import bcrypt from "bcrypt";

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createUser = async (username, password) => {
  if (!username || !password) {
    return null;
  }
  const hashed = hashPassword(password);
  const connection = pool.getConnection();

  hashed.then(async (hash) => {
    try {
      console.log(username, hash);
      const [rows] = await connection.then((establishedConnection) =>
        establishedConnection.query(
          "INSERT INTO user (u_user_id, u_name, u_email, u_password) VALUES (?, ?, ?, ?)",
          [
            `UID${Math.floor(100000000 * 899999999)}`,
            username,
            "test@test.com",
            hash,
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
  });
};
