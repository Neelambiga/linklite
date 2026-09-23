const { nanoid } = require("nanoid");

const Url = require("../models/Url");
const isValidUrl = require("../utils/validateUrl");

const getBaseUrl = (req) => {
  return (
    process.env.BASE_URL ||
    `${req.protocol}://${req.get("host")}`
  ).replace(/\/$/, "");
};


// ========================================
// CREATE SINGLE SHORT URL
// ========================================

const createShortUrl = async (req, res, next) => {
  try {
    const originalUrl =
      typeof req.body.originalUrl === "string"
        ? req.body.originalUrl.trim()
        : "";

    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required"
      });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid HTTP or HTTPS URL"
      });
    }

    let shortCode;
    let existingUrl;

    do {
      shortCode = nanoid(7);

      existingUrl = await Url.findOne({
        shortCode
      });
    } while (existingUrl);

    const url = await Url.create({
      originalUrl,
      shortCode
    });

    return res.status(201).json({
      success: true,

      data: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl:
          `${getBaseUrl(req)}/${shortCode}`,
        clicks: url.clicks,
        createdAt: url.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// CREATE MULTIPLE SHORT URLS
// ========================================

const createBulkShortUrls = async (
  req,
  res,
  next
) => {
  try {
    const { urls } = req.body;

    if (!Array.isArray(urls)) {
      return res.status(400).json({
        success: false,
        message: "urls must be an array"
      });
    }

    if (urls.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one URL"
      });
    }

    if (urls.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum 100 URLs can be processed at once"
      });
    }

    const results = [];

    for (const value of urls) {
      const originalUrl =
        typeof value === "string"
          ? value.trim()
          : "";

      if (!originalUrl) {
        results.push({
          originalUrl: value,
          success: false,
          message: "URL is empty"
        });

        continue;
      }

      if (!isValidUrl(originalUrl)) {
        results.push({
          originalUrl,
          success: false,
          message: "Invalid URL"
        });

        continue;
      }

      let shortCode;
      let existingUrl;

      do {
        shortCode = nanoid(7);

        existingUrl = await Url.findOne({
          shortCode
        });
      } while (existingUrl);

      const url = await Url.create({
        originalUrl,
        shortCode
      });

      results.push({
        success: true,
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl:
          `${getBaseUrl(req)}/${shortCode}`,
        clicks: url.clicks,
        createdAt: url.createdAt
      });
    }

    return res.status(201).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// GET ALL URLS
// ========================================

const getUrls = async (req, res, next) => {
  try {
    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";

    let filter = {};

    if (search) {
      filter = {
        $or: [
          {
            originalUrl: {
              $regex: search,
              $options: "i"
            }
          },
          {
            shortCode: {
              $regex: search,
              $options: "i"
            }
          }
        ]
      };
    }

    const urls = await Url
      .find(filter)
      .sort({
        createdAt: -1
      });

    const data = urls.map((url) => ({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl:
        `${getBaseUrl(req)}/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: url.createdAt
    }));

    return res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// GET URL BY ID
// ========================================

const getUrlById = async (
  req,
  res,
  next
) => {
  try {
    const url = await Url.findById(
      req.params.id
    );

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found"
      });
    }

    return res.json({
      success: true,

      data: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl:
          `${getBaseUrl(req)}/${url.shortCode}`,
        clicks: url.clicks,
        createdAt: url.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// DELETE URL
// ========================================

const deleteUrl = async (
  req,
  res,
  next
) => {
  try {
    const url =
      await Url.findByIdAndDelete(
        req.params.id
      );

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found"
      });
    }

    return res.json({
      success: true,
      message:
        "URL deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// REDIRECT SHORT URL
// ========================================

const redirectToOriginal = async (
  req,
  res,
  next
) => {
  try {
    const { shortCode } = req.params;

    const url =
      await Url.findOneAndUpdate(
        {
          shortCode
        },
        {
          $inc: {
            clicks: 1
          }
        },
        {
          new: true
        }
      );

    if (!url) {
      return res.status(404).send(`
        <!DOCTYPE html>

        <html>

        <head>

          <title>Link Not Found</title>

          <style>

            body {
              font-family: Arial;
              background: #f5f7fb;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }

            .box {
              background: white;
              padding: 40px;
              border-radius: 16px;
              text-align: center;
              box-shadow:
                0 15px 40px
                rgba(0,0,0,0.08);
            }

          </style>

        </head>

        <body>

          <div class="box">

            <h1>Link Not Found</h1>

            <p>
              This short URL does not exist.
            </p>

          </div>

        </body>

        </html>
      `);
    }

    return res.redirect(
      url.originalUrl
    );

  } catch (error) {
    next(error);
  }
};


module.exports = {
  createShortUrl,
  createBulkShortUrls,
  getUrls,
  getUrlById,
  deleteUrl,
  redirectToOriginal
};