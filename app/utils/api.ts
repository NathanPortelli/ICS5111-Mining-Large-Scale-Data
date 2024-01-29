export const POST = (url, body) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
};

export const GET = (url) => {
  return fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
};
