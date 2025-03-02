import { sendErrorResponse, sendSuccessResponse } from "../../utils/globals.js";
import { createUser } from "../../models/CreateUserModel.js";

class UserController {
  async createUser(req, res) {
    const { username, password } = req.body || {};
    const errorMessage = "Failed to create user!";

    if (!username || !password) {
      return sendErrorResponse(req, res, 401, errorMessage);
    }

    const user = await createUser(username, password);

    // if (!user) {
    //   return sendErrorResponse(req, res, 401, errorMessage);
    // }
    return sendSuccessResponse(req, res, "Successfully created user!", user);
  }
}

export default UserController;
