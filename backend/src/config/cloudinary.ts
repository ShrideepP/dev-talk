import { encodeBase64 } from "hono/utils/encode";
import { v2 as cloudinary } from "cloudinary";

export const uploader = async (file: File, contentType: "image" | "video") => {
  const byteArrayBuffer = await file.arrayBuffer();
  const base64 = encodeBase64(byteArrayBuffer);

  return await cloudinary.uploader.upload(
    `data:${file.type};base64,${base64}`,
    {
      resource_type: "auto",
      folder: `dev-talk/${contentType}s`,
    }
  );
};
