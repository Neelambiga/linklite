const isValidUrl = (value) => {
  try {
    const url = new URL(value);

    if (
      url.protocol !== "http:" &&
      url.protocol !== "https:"
    ) {
      return false;
    }

    return Boolean(url.hostname);
  } catch (error) {
    return false;
  }
};

module.exports = isValidUrl;