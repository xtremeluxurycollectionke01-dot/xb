import { getAccessToken } from "@/lib/mpesa/token";

(async () => {
  const token = await getAccessToken();
  console.log("FINAL TOKEN:", token);
})();