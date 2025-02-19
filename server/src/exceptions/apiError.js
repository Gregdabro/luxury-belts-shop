class ApiError extends Error {
    status;
    errors;
  
    constructor(status, message, errors = []) {
      super(message);
      this.status = status;
      this.errors = errors;
    }
  
    static badRequest(message, errors = []) {
      return new ApiError(400, message, errors);
    }
  
    static unauthorized(message = "Пользователь не авторизован") {
      return new ApiError(401, message);
    }
  
    static forbidden(message = "Доступ запрещен") {
      return new ApiError(403, message);
    }
  
    static notFound(message = "Ресурс не найден") {
      return new ApiError(404, message);
    }
  
    static internal(message = "Внутренняя ошибка сервера") {
      return new ApiError(500, message);
    }
  }
  
  export default ApiError;
  