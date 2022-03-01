export class ApiResponses {
  public static success(
    message: string,
    data: object = {},
    status: number = 200
  ) {
    return { message, data, status };
  }
}
