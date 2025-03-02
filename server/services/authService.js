import bcrypt from "bcrypt";
import { sign } from "./jwtService.js";
import { cryptoAESEncryption } from "./encryptionService.js";
import { getUserByEmail } from "../models/AuthModel.js";
import { convertToRoleData } from "../utils/globals.js";

export async function authenticateUser(username, password, expiryTime, role) {
  if (!username || !password || !expiryTime || !role) {
    return null;
  }

  try {
    const userRole = convertToRoleData(role);
    const user = await getUserByEmail(username, userRole ? userRole : "");
    const dbHash = user.u_password;
    console.log(user, userRole);
    if (user.u_name !== username || !dbHash) {
      return null;
    }

    //to compare php hash
    const hash = dbHash.replace(/^\$2y(.+)$/i, "$2b$1");
    const verified = await bcrypt.compare(password, hash).catch(() => false);

    if (!verified) {
      return null;
    }

    const userData = {
      id: user.u_user_id,
      name: user.u_name,
      email: user.u_email,
      mobile: user.u_mobile,
      image: user.u_image,
      role: user.u_role ? convertToRoleData(user.u_role) : "User",
      roleValue: user.u_role ? user.u_role : 0,
    };

    const encUser = await cryptoAESEncryption(JSON.stringify(userData)).catch(
      () => null
    );
    const encUserId = await cryptoAESEncryption(user.u_user_id).catch(
      () => null
    );
    //1 day
    const refreshToken = await sign(encUserId, expiryTime).catch(() => null);
    //2 minutes
    const accessToken = await sign(encUser, 2 * 60).catch(() => null);

    return {
      refreshToken: refreshToken,
      accessToken: accessToken,
      user: userData,
      authenticated: true,
    };
  } catch (error) {
    return null;
  }
}
