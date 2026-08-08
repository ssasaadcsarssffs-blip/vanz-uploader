import axios from "axios";
import FormData from "form-data";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "POST only"
    });
  }

  try {
    const form = new FormData();

    req.pipe(form);

    const response = await axios.post(
      "https://cloud.yardansh.com/upload",
      form,
      {
        headers: form.getHeaders(),
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    const originUrl = response.data?.url;

    if (!originUrl) {
      return res.status(502).json({
        success: false,
        message: "CDN tidak mengembalikan URL"
      });
    }

    const filename = originUrl.replace(
      "https://cloud.yardansh.com/",
      ""
    );

    const url = `https://cdn.vanzz.my.id/file/${filename}`;

    return res.status(200).json({
      success: true,
      url
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Upload gagal",
      error: error.response?.data || error.message
    });
  }
}
