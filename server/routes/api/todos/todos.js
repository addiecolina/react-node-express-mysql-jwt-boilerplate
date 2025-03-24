import express from "express";
import TodosController from "../../../controllers/api/TodosController.js";
import { validateData } from "../../../middlewares/validationMiddleware.js";
import { todoFormSchema } from "../../../schemas/todoSchema.js";
import { responseInterceptor } from "../../../middlewares/responseMiddleware.js";

const todosController = new TodosController();

const router = express.Router();
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);
router.use(function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: "No credentials sent!" });
  }
  next();
});

router.use(responseInterceptor);
router.get("/getTodos/:id", todosController.getTodos);
router.post(
  "/createTodos",
  validateData(todoFormSchema),
  todosController.createTodos
);
router.put(
  "/updateTodos",
  validateData(todoFormSchema),
  todosController.updateTodos
);
router.delete("/deleteTodos", todosController.deleteTodos);

router.get("*", function (req, res) {
  res.status(404).json({
    success: false,
    message: "",
    data: null,
    error: {
      code: 404,
      message: "Page not found!",
    },
  });
});

export default router;
