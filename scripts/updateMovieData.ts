import { januaryMovies } from '../src/data/january';
import { updateMovieWithTMDBData } from '../src/services/tmdb';
import { Movie } from '../src/types/movie';
import * as fs from 'fs/promises';
import * as path from 'path';

async function updateMovies() {
  const updatedMovies: Movie[] = [];
  let successCount = 0;
  
  console.log('Starting to fetch movie poster data...\n');
  
  for (const movie of januaryMovies) {
    const tmdbData = await updateMovieWithTMDBData(movie);
    const updatedMovie: Movie = {
      ...movie,
      posterPath: tmdbData.posterPath
    };
    updatedMovies.push(updatedMovie);
    
    if (tmdbData.posterPath) {
      successCount++;
    }
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 250));
  }

  console.log(`\nCompleted fetching poster data:`);
  console.log(`✓ Successfully found posters: ${successCount}`);
  console.log(`✗ Missing posters: ${januaryMovies.length - successCount}\n`);

  const movieDataPath = path.join(process.cwd(), 'src', 'data', 'january.ts');
  
  // Format the movies array nicely
  const formattedMovies = JSON.stringify(updatedMovies, null, 2)
    .replace(/"([^"]+)":/g, '$1:') // Convert "key": to key:
    .replace(/"/g, "'"); // Convert double quotes to single quotes

  const movieDataContent = `import { Movie } from '@/types/movie';

export const januaryMovies: Movie[] = ${formattedMovies};`;

  await fs.writeFile(movieDataPath, movieDataContent);
  console.log('✓ Movie data updated successfully!');
  console.log('✓ Poster paths have been saved to january.ts');
}

console.log('Starting TMDB poster update script...\n');
updateMovies().catch(console.error); 