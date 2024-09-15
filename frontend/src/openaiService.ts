export const generateImage = async (prompt: string) => {
  try {
    const response = await fetch("http://localhost:5000/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }), // Send the prompt to the backend
    });

    if (!response.ok) {
      throw new Error("Image generation failed");
    }

    const data = await response.json();
    return data; // The backend should return the base64 image
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
