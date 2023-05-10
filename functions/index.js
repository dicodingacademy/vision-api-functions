import { ImageAnnotatorClient } from "@google-cloud/vision";
import { onRequest } from "firebase-functions/v2/https";

export const ocr = onRequest(async (request, response) => {
  try {
    const visionClient = new ImageAnnotatorClient();
    const visionResponse = await visionClient.annotateImage({
      image: {
        content: request.body,
      },
      features: [
        {
          type: "TEXT_DETECTION",
        },
      ],
    });

    response.json({
      success: true,
      text: visionResponse[0].fullTextAnnotation.text,
    });
  } catch (error) {
    response.status(400).json({
      success: false,
      error: error.message,
    });
  }
});
