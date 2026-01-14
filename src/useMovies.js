import { useEffect, useRef, useState } from "react";

// API KEY
const KEY = "c92f650b";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      // AbrotController
      const controller = new AbortController();
      // Fetching Move
      async function fetchMovies() {
        try {
          // Loading
          setIsLoding(true);
          // Handling inital Error
          setError(error.message);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with movie fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
          setError("");
        } catch (error) {
          if (error.name !== "AbortError") {
            console.log(error.message);
            setError(error.message);
          }
        } finally {
          setIsLoding(false);
        }
      }
      // searech for movie words is greater then 3 then searching movie
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      // handleCloseId();
      fetchMovies();
    },
    [query]
  );
  return { query, movies, error };
}
