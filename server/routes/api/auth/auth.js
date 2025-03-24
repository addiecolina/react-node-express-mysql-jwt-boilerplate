import express from "express";
import AuthController from "../../../controllers/api/AuthController.js";
import { validateData } from "../../../middlewares/validationMiddleware.js";
import { userSchema } from "../../../schemas/userSchema.js";

const authController = new AuthController();

const router = express.Router();
router.use(express.json());
router.use(
  express.urlencoded({
    extended: true,
  })
);

router.post("/login", validateData(userSchema), authController.login);

router.get("/verifyToken", authController.verifyTokenController);

router.get("/logout", authController.logoutController);

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
