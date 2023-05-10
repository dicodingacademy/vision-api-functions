import { GoogleAuth } from "google-auth-library";
import { ImageAnnotatorClient } from "@google-cloud/vision";

export async function recognizeText(base64Image) {
  const auth = new GoogleAuth({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  });
  const visionClient = new ImageAnnotatorClient({ auth });
  const response = await visionClient.annotateImage({
    image: {
      content: base64Image,
    },
    features: [
      {
        type: "TEXT_DETECTION",
      },
    ],
  });

  return response[0].fullTextAnnotation.text;
}
