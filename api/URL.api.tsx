import { URLCreate, URLResponse } from "@/types/URL";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getURLs() {
  const response = await fetch(`${API_URL}/urls/`);
  return response;
}

export async function getURLByKeyOrAlias(keyOrAlias: string) {
  const response = await fetch(`${API_URL}/urls/${keyOrAlias}`);
  return response;
}

export async function createURL(url: URLCreate): Promise<URLResponse> {
  const response = await fetch(`${API_URL}/urls/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(url),
  });
  return response.json();
}

export async function updateURL(key: string, url: URLCreate): Promise<URLResponse> {
  const response = await fetch(`${API_URL}/urls/${key}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(url),
  });
  return response.json();
}

export async function deleteURL(key: string) {
  const response = await fetch(`${API_URL}/urls/${key}`, {
    method: "DELETE",
  });
  return response;
}
