import express from "express";
import TodosController from "../../../controllers/api/TodosController.js";

const todosController = new TodosController();

const router = express.Router();
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.get("/getTodos/:id", todosController.getTodos);
router.post("/createTodos", todosController.createTodos);
router.put("/updateTodos", todosController.updateTodos);

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
