import { ImageAnnotatorClient } from "@google-cloud/vision";
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { FirebaseFunctionsRateLimiter } from "firebase-functions-rate-limiter";

initializeApp();

const limiter = FirebaseFunctionsRateLimiter.withRealtimeDbBackend(
  {
    name: "rate_limiter_collection",
    maxCalls: 200,
    periodSeconds: 5,
  },
  getDatabase()
);

export const ocr = onRequest({ cors: true, maxInstances: 1 }, async (request, response) => {
  await limiter.rejectOnQuotaExceededOrRecordUsage();

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
