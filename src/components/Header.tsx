import React, { useState, useEffect } from "react";

const Header: React.FC = () => {
  const texts: string[] = [
    "study buddy",
    "personalized learning assistant",
    "24/7 tutor",
  ];
  const [currentText, setCurrentText] = useState<string>("");
  const [fullTextIndex, setFullTextIndex] = useState<number>(0);
  const [typingIndex, setTypingIndex] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTyping && !isPaused) {
      interval = setInterval(() => {
        if (typingIndex < texts[fullTextIndex].length) {
          // Typing characters one by one
          setCurrentText((prev) => prev + texts[fullTextIndex][typingIndex]);
          setTypingIndex((prev) => prev + 1);
        } else {
          // Full text shown, start the 4-second pause
          setIsTyping(false);
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false); // End pause
          }, 4000); // 4-second delay
        }
      }, 100); // Typing speed (100ms per character)
    } else if (!isTyping && !isPaused) {
      interval = setInterval(() => {
        if (typingIndex > 0) {
          // Deleting characters one by one
          setCurrentText((prev) => prev.slice(0, -1));
          setTypingIndex((prev) => prev - 1);
        } else {
          // Move to the next sentence
          setIsTyping(true);
          setFullTextIndex((prevIndex) => (prevIndex + 1) % texts.length); // Loop through sentences
        }
      }, 100); // Deleting speed (100ms per character)
    }

    return () => clearInterval(interval);
  }, [typingIndex, isTyping, isPaused, texts, fullTextIndex]);

  return (
    <header className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 py-16 relative overflow-hidden text-white">
      <div className="container mx-auto text-center px-6">
        {/* Main Heading with Typing Effect */}
        <h1 className="text-5xl font-extrabold mb-4">
          AI Tutor <span className="text-yellow-300">is your {currentText}</span>
        </h1>
        <p className="text-xl font-light mt-4 max-w-2xl mx-auto">
          Unlock your learning potential with a study companion that's always
          ready to help.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-20 w-40 h-40 bg-yellow-300 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute bottom-10 right-20 w-60 h-60 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl"></div>
    </header>
  );
};

export default Header;
