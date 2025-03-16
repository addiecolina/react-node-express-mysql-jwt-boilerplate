import { sendErrorResponse, sendSuccessResponse } from "../../utils/globals.js";
import { getTodoById, updateTodoById } from "../../models/TodosModel.js";

class TodosController {
  async getTodos(req, res) {
    console.log("req", req.params);
    const { id } = req.params || {};
    const errorMessage = "Failed to get todos!";

    if (!id) {
      return sendErrorResponse(req, res, 401, errorMessage);
    }

    try {
      const todos = await getTodoById(id);
      return sendSuccessResponse(
        req,
        res,
        "Successfully fetched todos!",
        todos
      );
    } catch {
      return sendErrorResponse(req, res, 401, errorMessage);
    }
  }

  async updateTodos(req, res) {
    const { title, description, priority, status, due_at, slug } =
      req.body || {};
    const errorMessage = "Failed to update todos!";

    if (!title || !description || !priority || !status || !due_at || !slug) {
      return sendErrorResponse(req, res, 401, errorMessage);
    }

    try {
      const todos = await updateTodoById(
        title,
        description,
        priority,
        status,
        due_at,
        slug
      );
      return sendSuccessResponse(
        req,
        res,
        "Successfully updated todos!",
        todos
      );
    } catch {
      return sendErrorResponse(req, res, 401, errorMessage);
    }
  }
}

export default TodosController;
