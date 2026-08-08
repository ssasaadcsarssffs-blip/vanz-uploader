import axios from "axios";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "POST only" });
  }

  try {
    const response = await axios.post(
      "https://cloud.yardansh.com/upload",
      req,
      {
        headers: {
          "content-type": req.headers["content-type"]
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    if (!response.data?.url) {
      return res.status(502).json({ success: false, message: "CDN tidak mengembalikan URL" });
    }

    return res.status(200).json({
      success: true,
      url: response.data.url
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Upload gagal" });
  }
}
