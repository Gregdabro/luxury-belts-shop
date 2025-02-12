import ApiError from "../exceptions/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(err); // Логируем ошибку для отладки

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(500).json({ message: "Непредвиденная ошибка сервера" });
};

export default errorMiddleware;
