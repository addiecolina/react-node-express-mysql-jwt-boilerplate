import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const generateGUID = () => {
  return uuidv4();
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const createUser = async (username, password) => {
  if (!username || !password) {
    return null;
  }
  const connection = pool.getConnection();
  const hashed = hashPassword(password);
  hashed.then(async (hash) => {
    try {
      const [rows] = await connection.then((establishedConnection) =>
        establishedConnection.query(
          "INSERT INTO user (u_user_id, u_name, u_password) VALUES (?, ?, ?)",
          [generateGUID(), username, hash]
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
