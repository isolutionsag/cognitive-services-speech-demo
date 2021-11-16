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
      "Authorization": autorization, //TODO:  not accepted by RequestInit (interface) -> casting at end of this function
    },
  };
  return options as RequestInit;
}
