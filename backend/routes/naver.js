const express = require("express");
const router = express.Router();
const axios = require("axios");
const Record = require("../schema/record.js");
require("dotenv").config();

/* GET home page. */
router.get("/", async function (req, res) {
  let query = req.query.title;
  await Record.findOneAndUpdate(
    {
      searchTitle: query,
      date: { $gte: new Date().setHours(12, 0, 0, 0) },
    },
    { $inc: { count: 1 } },
    { upsert: true }
  );
  let reqOptions = {
    headers: {
      "X-Naver-Client-Id": process.env.Naver_Id,
      "X-Naver-Client-Secret": process.env.Naver_Secret,
    },
    params: {
      query: query,
    },
  };
  try {
    const newsRes = await axios.get(
      "https://openapi.naver.com/v1/search/news.json",
      reqOptions
    );
    let data = newsRes.data;
    for (var i = 0; i < data.items.length; ++i) {
      data.items[i].title = data.items[i].title
        .replace(/(<([^>]+)>)/gi, "")
        .replace(/&quot;/g, '"')
        .replace(/\"n/, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&apos;/g, "'");
    }
    const pythonRes = await axios.post("http://localhost:5000/", {
      title: query,
      data: data,
    });
    for (var i = 0; i < data.items.length; ++i) {
      data.items[i].detail = (pythonRes.data[i] * 100).toFixed(2);
    }
    data.items.sort(function (a, b) {
      return b.detail - a.detail;
    });
    return res.json(newsRes.data);
  } catch (e) {
    return res.json({
      status: 400,
      message: e,
    });
  }
});
module.exports = router;
