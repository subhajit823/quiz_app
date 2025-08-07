import React from "react";
import QuizComponent from "./components/QuizComponent";

function App() {
  return React.createElement(
    "div",
    { className: "min-h-screen bg-gray-100 flex items-center justify-center" },
    React.createElement(QuizComponent)
  );
}

export default App;