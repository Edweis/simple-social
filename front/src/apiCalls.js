const API_ROOT = 'http://localhost:8000';
const headers = { 'Content-Type': 'application/json' };
export const get = url =>
  fetch(API_ROOT + url, {
    method: 'GET',
    headers,
  });

export const post = (url, body) =>
  fetch(API_ROOT + url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
export const setToken = token => {
  if (token == null) headers.Authorization = null;
  headers.Authorization = `Token ${token}`;
};
