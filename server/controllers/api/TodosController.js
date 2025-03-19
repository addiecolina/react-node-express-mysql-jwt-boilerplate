import { sendErrorResponse, sendSuccessResponse } from "../../utils/globals.js";
import {
  getTodoById,
  updateTodoById,
  createTodo,
  deleteTodosByIds,
} from "../../models/TodosModel.js";
import { verifyToken } from "../../services/jwtService.js";

class TodosController {
  async getTodos(req, res) {
    const { id } = req.params || {};
    const errorMessage = "Failed to get todos!";
    const token = verifyToken(req.cookies?.yttmrtck);

    if (!id || !token) {
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

  async createTodos(req, res) {
    const {
      title,
      description,
      priority,
      status,
      due_at,
      user_id,
      slug,
      subtasks,
    } = req.body || {};
    const errorMessage = "Failed to create todos!";
    const token = verifyToken(req.cookies?.yttmrtck);

    if (
      !title ||
      !description ||
      !priority ||
      !status ||
      !user_id ||
      !slug ||
      !due_at ||
      !token
    ) {
      return sendErrorResponse(req, res, 401, errorMessage);
    }

    try {
      const todos = await createTodo(
        title,
        description,
        priority,
        status,
        user_id,
        slug,
        due_at,
        subtasks
      );
      return sendSuccessResponse(
        req,
        res,
        "Successfully created todos!",
        todos
      );
    } catch {
      return sendErrorResponse(req, res, 401, errorMessage);
    }
  }

  async updateTodos(req, res) {
    const { title, description, priority, status, due_at, slug, completed_at } =
      req.body || {};
    const errorMessage = "Failed to update todos!";
    const token = verifyToken(req.cookies?.yttmrtck);

    if (
      !title ||
      !description ||
      !priority ||
      !status ||
      !due_at ||
      !slug ||
      !token
    ) {
      return sendErrorResponse(req, res, 401, errorMessage);
    }

    try {
      const todos = await updateTodoById(
        title,
        description,
        priority,
        status,
        due_at,
        completed_at,
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

  async deleteTodos(req, res) {
    const { slugs } = req.body || {};
    const errorMessage = "Failed to delete todos!";
    const token = verifyToken(req.cookies?.yttmrtck);

    if (!slugs || !token) {
      return sendErrorResponse(req, res, 401, errorMessage);
    }

    try {
      const todos = await deleteTodosByIds(slugs);
      return sendSuccessResponse(
        req,
        res,
        "Successfully deleted todos!",
        todos
      );
    } catch {
      return sendErrorResponse(req, res, 401, errorMessage);
    }
  }
}

export default TodosController;
