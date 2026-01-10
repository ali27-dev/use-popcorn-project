import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";
/* 
function Test() {
  const [movieRat, setMovieRat] = useState(0);
  return (
    <>
      <StarRating color="blue" maxRating={10} onSetMovieRat={setMovieRat} />
      <p>This movie was rated {movieRat} stars</p>
    </>
  );
}
  */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/*  
    <StarRating
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />

    <StarRating
      maxRating={5}
      color="red"
      size="28"
      // messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      defaultRat={3}
      className="test"
    />
    <Test />
  */}
  </React.StrictMode>
);
