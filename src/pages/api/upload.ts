import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import https from "https";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to handle file uploads manually
  },
};

async function uploadToOpenAI(filePath: string, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const boundary = `----WebKitFormBoundary${Date.now()}`;
    const headers = {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    };

    const options = {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/files",
      method: "POST",
      headers,
    };

    const request = https.request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        if (response.statusCode === 200) {
          const responseData = JSON.parse(data);
          resolve(responseData.id); // Return the file ID
        } else {
          reject(new Error(`Failed to upload file: ${data}`));
        }
      });
    });

    request.on("error", (error) => {
      reject(error);
    });

    // Create multipart form-data payload
    const formDataStart = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`;
    const formDataEnd = `\r\n--${boundary}--\r\n`;

    request.write(formDataStart);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(request, { end: false });
    fileStream.on("end", () => {
      request.end(formDataEnd);
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const busboy = new Busboy({ headers: req.headers });
  const uploadDir = "./uploads";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let filePath = "";
  let fileName = "";

  busboy.on("file", (fieldname, file, filename) => {
    fileName = filename;
    filePath = `${uploadDir}/${filename}`;
    const writeStream = fs.createWriteStream(filePath);
    file.pipe(writeStream);
  });

  busboy.on("finish", async () => {
    try {
      // Upload file to OpenAI
      const fileId = await uploadToOpenAI(filePath, fileName);

      // Cleanup uploaded file
      fs.unlinkSync(filePath);

      return res.status(200).json({ success: true, fileId });
    } catch (error) {
      console.error("Error uploading file to OpenAI:", error);
      return res.status(500).json({ success: false, error: "Failed to upload file to OpenAI" });
    }
  });

  req.pipe(busboy);
}
