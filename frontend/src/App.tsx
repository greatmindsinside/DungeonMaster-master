import React, { useState, useEffect } from "react";
import "./App.css";
import { generateImage } from "./openaiService";

// Define the type for gameText
type GameText = {
  [key: string]: {
    description: string;
    options: { text: string; nextLocation: string }[];
  };
};

const gameText: GameText = {
  start: {
    description: `The room is dim, lit only by the flickering light from an old, buzzing fluorescent tube in the corner. A man stands in the center, his eyes fixed upwards, staring at the slow, hypnotic rotation of a ceiling fan. Each blade cuts through the thick air with a quiet whirr, casting brief shadows that ripple across his weathered face.`,
    options: [{ text: "Go north", nextLocation: "hallway" }],
  },
  hallway: {
    description:
      "You are in a hallway. There is a door to the south and a door to the east.",
    options: [
      { text: "Go south", nextLocation: "start" },
      { text: "Go east", nextLocation: "treasureRoom" },
    ],
  },
  treasureRoom: {
    description: "You found a room filled with treasure! You win!",
    options: [{ text: "Play again", nextLocation: "start" }],
  },
};

function App() {
  const [location, setLocation] = useState("start");
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      console.log(gameText[location].description);
      
      // Fetch the generated image from the backend
      const image = await generateImage(gameText[location].description + "your in a dungeon HD");
      console.log(image);
      
      // If the image is returned as base64, set the imageUrl using the data URL format
      if (image && image.image) {
        setImageUrl(`data:image/png;base64,${image.image}`); // Assuming the image is base64-encoded PNG
      } else {
        setImageUrl(null); // Reset image URL if no image is returned
      }
    };

    fetchImage();
  }, [location]);

  const handleOptionClick = (nextLocation: string) => {
    setLocation(nextLocation);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{gameText[location].description}</p>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Scene"
            style={{ width: "50%", height: "auto" }}
          />
        ) : (
          <p>Loading image...</p> // Fallback message while the image is being fetched
        )}
        <div>
          {gameText[location].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option.nextLocation)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;