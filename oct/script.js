document.addEventListener('DOMContentLoaded', function () {
    const API_KEY = '683d96387e767b542036c834aeb06770';
    const BASE_URL = 'https://api.themoviedb.org/3';
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // Base URL for movie posters
    const modal = document.getElementById('movieModal');
    const movieTitle = document.getElementById('movieTitle');
    const movieDescription = document.getElementById('movieDescription');
    const movieDetails = document.getElementById('movieDetails');
    const movieTrailer = document.getElementById('movieTrailer');
    const ageRatingImage = document.getElementById('ageRatingImage');
    const closeBtn = document.querySelector('.close');

    let assignedMovies = []; // Array to store unique movie data for each door

    // Function to fetch all unique horror movies once and assign them to doors
    async function fetchAndAssignMovies() {
        let movies = [];
        let page = 1;

        while (movies.length < 100) {
            try {
                const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27&sort_by=popularity.desc&page=${page}`);
                const data = await response.json();
                movies = movies.concat(data.results);
                page++;
            } catch (error) {
                console.error('Error fetching movies:', error);
                break;
            }
        }

          // Filter movies to only include those with trailers and valid age ratings
            const filteredMovies = [];
            for (let movie of movies) {
                const details = await getMovieDetails(movie.id);
                const trailer = await getMovieTrailer(movie.id);
                if (trailer && details.certification !== null) { // Only include if trailer and age rating exist
                    filteredMovies.push({
                        title: movie.title,
                        description: movie.overview,
                        runtime: details.runtime,
                        releaseYear: details.release_date.split('-')[0],
                        cast: details.cast.slice(0, 5).map(cast => cast.name).join(', '),
                        ageRating: mapToBritishRating(details.certification),
                        trailer: trailer,
                        poster: movie.poster_path // Store the poster path
                    });
                }
                if (filteredMovies.length >= 31) break; // Stop once we have enough movies
            }

                // Shuffle the filtered movies
                assignedMovies = shuffleArray(filteredMovies).slice(0, 31);
            }

    // Function to get movie details, including cast and age rating
    async function getMovieDetails(movieId) {
        try {
            const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,releases`);
            const data = await response.json();
            const certification = data.releases.countries.find(c => c.iso_3166_1 === 'GB')?.certification || 'NR';
            return {
                runtime: data.runtime,
                release_date: data.release_date,
                cast: data.credits.cast,
                certification: certification
            };
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return {};
        }
    }

    function mapToBritishRating(britishRating) {
        switch (britishRating) {
            case 'U':
                return { rating: 'U', image: '../img/ratings/Rating-01.png' };
            case 'PG':
                return { rating: 'PG', image: '../img/ratings/Rating-02.png' };
            case '12A':
            case '12':
                return { rating: '12A', image: '../img/ratings/Rating-03.png' };
            case '15':
                return { rating: '15', image: '../img/ratings/Rating-04.png' };
            case '18':
                return { rating: '18', image: '../img/ratings/Rating-05.png' };
            default:
                return { rating: 'NR', image: '../img/ratings/Rating-06.png' };
        }
    }
    

    // Function to get trailer for a movie
    async function getMovieTrailer(movieId) {
        try {
            const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
            const data = await response.json();
            const trailers = data.results.filter(video => video.type === 'Trailer' && video.site === 'YouTube');
            return trailers.length > 0 ? trailers[0].key : null;
        } catch (error) {
            console.error('Error fetching movie trailer:', error);
            return null;
        }
    }

     // Function to shuffle an array (Fisher-Yates Shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
                            
    // Assign movies to doors after fetching
    fetchAndAssignMovies().then(() => {
        document.querySelectorAll('.door').forEach((door, index) => {
            door.addEventListener('click', function () {
                if (assignedMovies[index]) {
                    const movie = assignedMovies[index];
                    movieTitle.textContent = movie.title;
                    movieDescription.textContent = movie.description;
                    movieDetails.innerHTML = `
                        <p><strong>Release Year:</strong> ${movie.releaseYear}</p>
                        <p><strong>Runtime:</strong> ${movie.runtime} minutes</p>
                        <p><strong>Cast:</strong> ${movie.cast}</p>
                    `;
            
                    movieTrailer.src = `https://www.youtube.com/embed/${movie.trailer}`;
                

                    // Display the appropriate BBFC rating image
                    ageRatingImage.src = movie.ageRating.image;
                    ageRatingImage.alt = movie.ageRating.rating;

                    // Update the door with the movie poster
                    door.style.backgroundImage = `url(${IMAGE_BASE_URL}${movie.poster})`;
                    door.style.backgroundSize = 'cover';
                    door.style.backgroundPosition = 'center';
                    door.textContent = ''; // Remove the door number text

                    
                    modal.style.display = 'flex';
                } else {
                    console.error(`No movie assigned for door ${index + 1}`);
                }
            });
        });
    });

    // Close modal when the close button is clicked
    closeBtn.addEventListener('click', function () {
        modal.style.display = 'none';
        movieTrailer.src = '';
    });

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            movieTrailer.src = '';
        }
    });
});

document.getElementById('backToMonthSelector').addEventListener('click', function() {
    window.location.href = '../index.html'; // Replace 'month_selector.html' with the actual URL
});