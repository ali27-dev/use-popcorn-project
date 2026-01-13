import { useEffect, useState } from "react";
import StarRating from "./StarRating";
// Initail temporary Movie Data
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];
// Initail temporary watched Movie Data
const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
// Calculating average
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// API KEY
const KEY = "c92f650b";

// APP Component
export default function App() {
  const [query, setQuery] = useState("inception");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  /*
  useEffect(function () {
    console.log("A");
  }, []);

  useEffect(function () {
    console.log("B");
  });

  console.log("C");
*/

  // Selected Movie ID
  function handleSelectedId(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  // Selected Movie Removeing ID
  function handleCloseId() {
    setSelectedId(null);
  }
  // Handling Add watched Movie
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  // Handling Delete watched Movie
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  /////////////////////////////////////////////
  ///useEffect For Getting Data from imd API///
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

      handleCloseId();
      fetchMovies();
    },
    [query]
  );

  return (
    <>
      {/* {<Navbar query={query} onSetQuery={setQuery} movies={movies} />} */}
      {/* <Box onSetIsOpen1={setIsOpen1} isOpen1={isOpen1} movies={movies} /> */}
      {/* Navbar-Component */}
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      {/* Main-Component */}
      <Main>
        {/* Box-1 */}
        <Box>
          {/* {isLoding ? <Loding /> : <MovieList movies={movies} />} */}
          {isLoding && <Loding />}
          {!isLoding && !error && (
            <MovieList movies={movies} onSelectedMovie={handleSelectedId} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        {/* Box-2 */}
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onHandleClose={handleCloseId}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              {/* MovieSummary-Component */}
              <WatchedSummary watched={watched} />
              {/* MovieList-Component */}
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
// Loading Function
function Loding() {
  return <p className="loader">Loding...</p>;
}
// Error function
function ErrorMessage({ message }) {
  return <p className="error">❌{message}</p>;
}
/////////////////////
////// Navbar //////
function Navbar({ children }) {
  return (
    <>
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}
/////////////////////
////// LOGO //////
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
/////////////////////
////// Search //////
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
//////////////////////////
////// NumberResult //////
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
///////////////////
////// Main //////
function Main({ children }) {
  return <main className="main">{children}</main>;
}
/////////////////////
////// BOX //////
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <div className="box">
        <button
          className="btn-toggle"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "-" : "+"}
        </button>
        {isOpen && children}
      </div>
    </>
  );
}
// Watched-Box
// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

////////////////////////
////// MovieList //////
function MovieList({ movies, onSelectedMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          onSelectedMovie={onSelectedMovie}
        />
      ))}
    </ul>
  );
}
////////////////////
////// Movie //////
function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />

      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
//////////////////////////
////// MovieDetails //////
function MovieDetails({ selectedId, onHandleClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [loding, setLoding] = useState(false);
  const [userRatings, setUserRating] = useState("");
  // Already Rated Movie
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  // Already Rated Movie showing Rating in UI
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRatings;
  // Destructuring Movie Details
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // Adding Movie Details
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRatings,
    };

    onAddWatched(newWatchedMovie);
    onHandleClose();
  }
  /// useEffect for Key Event ///
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onHandleClose();
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onHandleClose]
  );

  /// useEffect for fetching Movie Details ///
  useEffect(
    function () {
      async function getMovieDetails() {
        setLoding(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setLoding(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );
  // useEffect for App-Title ///
  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title} `;
      return function (param) {
        document.title = "usePopcorn";
        // console.log(`The Movie we cancel is ${title}`);
      };
    },
    [title]
  );
  return (
    <>
      <div className="details">
        {loding ? (
          <Loding />
        ) : (
          <>
            {/* MovieDetail-Header-start */}
            <header>
              <button className="btn-back" onClick={onHandleClose}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released}&bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>
            {/* MovieDetail-Header-End */}

            {/* MovieDetail-Body-start */}
            <section>
              <div className="rating">
                {!isWatched ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={setUserRating}
                    />

                    {userRatings > 0 && (
                      <button className="btn-add" onClick={handleAdd}>
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>
                    You rated this movie {watchedUserRating}
                    <span>⭐️</span>
                  </p>
                )}
              </div>
              <em>{plot}</em>
              <p>starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
            {/* MovieDetail-Body-End */}
          </>
        )}
      </div>
    </>
  );
}
////////////////////////////
////// WatchedSummary //////
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRatings));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}
//////////////////////////////
////// WatchedMovieList //////
function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
//////////////////////////
////// WatchedMovie //////
function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRatings}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>

      <button
        className="btn-delete"
        onClick={() => onDeleteWatched(movie.imdbID)}
      >
        X
      </button>
    </li>
  );
}
