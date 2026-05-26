require("dotenv").config();
const { getAccessToken } = require("./lib/mpesa/token");

(async () => {
  try {
    const token = await getAccessToken();
    console.log("FINAL TOKEN:", token);
  } catch (err) {
    console.error("FAILED:", err);
  }
})();