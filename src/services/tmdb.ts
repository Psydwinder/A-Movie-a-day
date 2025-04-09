const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function getMovieDetails(movieId: number) {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,release_dates`
  );
  const data = await response.json();
  
  // Get UK certification
  const ukRelease = data.release_dates?.results?.find(
    (r: any) => r.iso_3166_1 === 'GB'
  );
  const certification = ukRelease?.release_dates?.[0]?.certification;

  return {
    runtime: data.runtime,
    release_date: data.release_date,
    certification,
    cast: data.credits?.cast || []
  };
}

export async function searchMovie(title: string, year: number) {
  try {
    console.log(`Searching for movie: ${title} (${year})`);
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}`
    );
    const data = await response.json();
    
    if (!response.ok) {
      console.error('TMDB API Error:', data);
      return null;
    }

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      const details = await getMovieDetails(movie.id);
      
      console.log(`Found movie: ${title}`, {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        details
      });

      return {
        ...movie,
        ...details
      };
    } else {
      console.log(`No results found for: ${title}`);
      return null;
    }
  } catch (error) {
    console.error(`Error searching for movie ${title}:`, error);
    return null;
  }
}

export async function updateMovieWithTMDBData(movie: {
  title: string;
  releaseYear: number;
}) {
  try {
    console.log(`\nFetching TMDB data for: ${movie.title}`);
    const tmdbMovie = await searchMovie(movie.title, movie.releaseYear);
    
    if (tmdbMovie) {
      console.log(`✓ Got data for ${movie.title}:`, {
        poster_path: tmdbMovie.poster_path,
        runtime: tmdbMovie.runtime,
        certification: tmdbMovie.certification
      });
      
      return {
        posterPath: tmdbMovie.poster_path || null,
      };
    } else {
      console.log(`✗ No data found for ${movie.title}`);
      return { posterPath: null };
    }
  } catch (error) {
    console.error(`Error fetching TMDB data for ${movie.title}:`, error);
    return { posterPath: null };
  }
} 