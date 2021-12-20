export function createPostRequest(
  data: any,
  contentType: string = "application/json",
  autorization?: string
): RequestInit {
  const body = JSON.stringify(data);
  const options = {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": contentType,
      "Authorization": autorization,
    },
  };
  return options as RequestInit;
}
