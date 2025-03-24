import express from "express";
import UserController from "../../../controllers/api/UserController.js";
import { validateData } from "../../../middlewares/validationMiddleware.js";
import { userSchema } from "../../../schemas/userSchema.js";

const userController = new UserController();

const router = express.Router();
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/createUser", validateData(userSchema), userController.createUser);

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
