import { useState, useEffect } from "react";

export function useLocalStorage(initalState, key) {
  // const [watched, setWatched] = useState([]);
  const [value, setValue] = useState(function () {
    const storedValues = localStorage.getItem(key);
    return storedValues ? JSON.parse(storedValues) : initalState;
  });

  /// Storing Data in Local Storage using useEffect ///
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
