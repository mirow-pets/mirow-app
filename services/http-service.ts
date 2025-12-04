import AsyncStorage from "@react-native-async-storage/async-storage";

import { ENV } from "@/env";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const requestOptions = async (
  method: Method,
  body?: unknown,
  contentType: string = "application/json"
) => {
  const accessToken = await AsyncStorage.getItem("accessToken");

  let options = {
    method: method,
    headers: {
      ...(accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {}),
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    },
    body: (contentType === "application/json"
      ? JSON.stringify(body)
      : body) as string,
  };

  return options;
};

const request = async (
  path: string,
  method: Method,
  body?: unknown,
  contentType?: string
) => {
  const url = `${ENV.API_BASE_URL}${path}`;
  const options = await requestOptions(method, body, contentType);
  console.log("Requesting to:", method, url, options.headers, body);

  const result = await fetch(url, options);

  if (result.ok) {
    if (contentType) {
      return JSON.parse(await result.text());
    }
    return result.json();
  } else {
    const data = await result.json();
    console.log(`Error body on ${url}:`, data.error);
    if (data.error) throw data.error;
    throw data;
  }
};

export const Get = (endpoint: string) => request(endpoint, "GET");

export const Post = (endpoint: string, body?: unknown, contentType?: string) =>
  request(endpoint, "POST", body, contentType);

export const Put = (endpoint: string, body?: unknown) =>
  request(endpoint, "PUT", body);

export const Patch = (endpoint: string, body?: unknown) =>
  request(endpoint, "PATCH", body);

export const Delete = (endpoint: string, body?: unknown) =>
  request(endpoint, "DELETE", body);
