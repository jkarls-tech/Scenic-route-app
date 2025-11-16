import { GoogleGenAI, Type } from "@google/genai";
import { RoadResult, GroundingChunk, LocationQuery, Road } from '../types';

export async function findDrivingRoads(query: LocationQuery): Promise<RoadResult> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const locationPrompt = query.type === 'coords'
    ? `my current location at latitude ${query.lat} and longitude ${query.lon}`
    : `the area of "${query.address}"`;

  const prompt = `Act as an expert driving enthusiast who finds exhilarating routes for high-performance sports cars.

Based on ${locationPrompt}, identify the 3 best driving roads for a sports car enthusiast. The absolute priority is finding twisty, technical, and scenic backroads.

Your suggestions MUST adhere to the following strict criteria:
*   **No Highways or Major Roads:** Absolutely NO interstates, freeways, highways, or major multi-lane arterial roads. Your focus is exclusively on smaller, two-lane roads.
*   **Driving Experience:** Prioritize roads with challenging corners, tight turns, significant elevation changes, and beautiful scenery.
*   **Road Quality:** The roads should have good pavement quality suitable for a sports car.

Your response MUST be a JSON array of objects, where each object represents a road and has the following properties: "name", "description", "mapEmbedUrl", "startLat", "startLon", "endLat", and "endLon".
- The "name" should be a common name for the route.
- The "description" must be a JSON array of 3-4 strings, where each string is a key highlight of the drive (e.g., "Features tight hairpins", "Stunning valley views", "Excellent pavement condition").
- The "mapEmbedUrl" must be a URL suitable for use in an HTML \`iframe\` tag to display a map of the route. This URL should show the route path, not just a point.
- "startLat" and "startLon" must be the decimal latitude and longitude for the starting point of the scenic drive.
- "endLat" and "endLon" must be the decimal latitude and longitude for the ending point of the scenic drive.

Again, I must stress: Do NOT recommend any highways or major roads. Only suggest routes that a true driving enthusiast would enjoy.`;

  const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        mapEmbedUrl: { type: Type.STRING },
        startLat: { type: Type.NUMBER },
        startLon: { type: Type.NUMBER },
        endLat: { type: Type.NUMBER },
        endLon: { type: Type.NUMBER },
      },
      required: ["name", "description", "mapEmbedUrl", "startLat", "startLon", "endLat", "endLon"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const roads: Road[] = JSON.parse(response.text);
    // Grounding metadata will not be present, so sources will be an empty array.
    const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { roads, sources };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the response from the AI model. The format was invalid.");
    }
    throw new Error("Failed to get recommendations from the AI model.");
  }
}
