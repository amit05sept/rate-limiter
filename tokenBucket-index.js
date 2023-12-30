const TokenBucket= require("./tokenBucketRate-Limiter.js");
const express = require("express");
const app = express();

const bucket = new TokenBucket(5, 5, 10); // (capacity , refillamount , refilltime);

function rateLimiter(req, res, next) {
  try {
    const userId = req.headers["user-id"];
    bucket.handlerRequest(userId);
  } catch (err) {
    res.status(429).json({
      msg: "failure",
      error: `${err.message}`,
    });
    return;
  }
  next();
}

app.use(rateLimiter);

app.get("/api", (req, res) => {
  res.json({
    msg: "API DATA",
  });

});

app.listen(3000);
