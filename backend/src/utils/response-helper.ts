export class ResponseHelper {
  static success(message: string, data: any, code: number = 200) {
    return {
      data: {
        success: true,
        message: message,
        data: data,
      },
      code: code,
    };
  }

  static error(message: string, data: any = null, code: number = 500) {
    return {
      data: {
        success: false,
        message: message,
        data: data,
      },
      code: code,
    };
  }
}
