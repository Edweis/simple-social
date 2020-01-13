const API_ROOT = 'http://localhost:8000';
let headers = { 'Content-Type': 'application/json' };
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

export const remove = (url, body) =>
  fetch(API_ROOT + url, {
    method: 'DELETE',
    headers,
    body: JSON.stringify(body),
  });

export const setToken = token => {
  if (token == null) headers = { 'Content-Type': 'application/json' };
  else headers.Authorization = `Token ${token}`;
};
