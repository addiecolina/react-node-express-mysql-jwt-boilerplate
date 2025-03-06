import { sendErrorResponse, sendSuccessResponse } from "../../utils/globals.js";
import { createUser } from "../../models/CreateUserModel.js";
import { checkUserExists } from "../../services/checkUserService.js";

class UserController {
  async createUser(req, res) {
    const { username, password } = req.body || {};
    const errorMessage = "Failed to create user!";

    if (!username || !password) {
      return sendErrorResponse(req, res, 401, errorMessage);
    }

    try {
      console.log("Checking user exists:", username);
      await checkUserExists(username, false);
      const user = await createUser(username, password);
      return sendSuccessResponse(req, res, "Successfully created user!", user);
    } catch {
      return sendErrorResponse(req, res, 401, "User already exists!");
    }
  }
}

export default UserController;
