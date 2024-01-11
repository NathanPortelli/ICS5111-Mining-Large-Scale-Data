export type ErrorMessageResponse = {
    message: string;
};
  
export function errorResponse(error: ErrorMessageResponse, status = 400) {
  return new Response(JSON.stringify(error), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function createdResponse(body: any) {
  return new Response(JSON.stringify(body), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export function okResponse(body: any) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}