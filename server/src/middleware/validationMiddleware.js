import { body, validationResult } from "express-validator";
import ApiError from "../exceptions/apiError.js";

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Форматируем ошибки в более понятный формат
        const formattedErrors = errors.array().map(err => ({
            field: err.path,
            message: err.msg
        }));
        return next(ApiError.badRequest("Ошибка валидации", formattedErrors));
    }
    next();
};

export const registerValidation = [
    body("email")
        .isEmail()
        .withMessage("Некорректный email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Пароль должен содержать минимум 6 символов")
        .trim(),
    body("name")
        .notEmpty()
        .withMessage("Имя обязательно")
        .trim()
        .escape(),
    validateRequest
];

export const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Некорректный email")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Пароль обязателен")
        .trim(),
    validateRequest
];
