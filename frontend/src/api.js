const API_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/$/, "");


const request = async (
  endpoint,
  options = {}
) => {

  const response =
    await fetch(
      `${API_URL}${endpoint}`,
      {
        headers: {
          "Content-Type":
            "application/json",

          ...(options.headers || {})
        },

        ...options
      }
    );


  const result =
    await response.json()
      .catch(() => ({
        success: false,
        message:
          "Invalid server response"
      }));


  if (!response.ok) {
    throw new Error(
      result.message ||
      "Request failed"
    );
  }


  return result;
};


// ========================================
// SINGLE URL
// ========================================

export const createShortUrl = (
  originalUrl
) => {

  return request(
    "/urls",
    {
      method: "POST",

      body: JSON.stringify({
        originalUrl
      })
    }
  );
};


// ========================================
// MULTIPLE URLS
// ========================================

export const createBulkShortUrls = (
  urls
) => {

  return request(
    "/urls/bulk",
    {
      method: "POST",

      body: JSON.stringify({
        urls
      })
    }
  );
};


// ========================================
// GET URLS
// ========================================

export const getUrls = (
  search = ""
) => {

  const query = search
    ? `?search=${encodeURIComponent(
        search
      )}`
    : "";

  return request(
    `/urls${query}`
  );
};


// ========================================
// DELETE
// ========================================

export const deleteUrl = (
  id
) => {

  return request(
    `/urls/${id}`,
    {
      method: "DELETE"
    }
  );
};