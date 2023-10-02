
const searchBar = document.getElementById('search-bar');
const heroList = document.getElementById('hero-list');
const heroImage = document.getElementById('hero-image');
const heroDescription = document.getElementById('hero-description');



async function fetchSuperheroes(searchText) {
    try {
        const response = await fetch(`https://gateway.marvel.com/v1/public/characters?ts=1695747006616&apikey=a486bc808c8ba8212be1958366caad63&hash=065fcc3060e1707768cdf194b0c810ad&nameStartsWith=${searchText}`);
        const data = await response.json();

        // Check if the response contains data
        if (data && data.data && data.data.results) {
            const superheroes = data.data.results;

            heroList.innerHTML = '';

            superheroes.forEach(hero => {
                const card = document.createElement('div');
                card.classList.add('col-md-3', 'mb-4');
                card.innerHTML = `
                    <div class="col">
                        <div class="card">
                            <div class="bg-image hover-overlay ripple" data-mdb-ripple-color="light">
                                <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" class="img-fluid"/>
                                <a href="#!">
                                    <div class="mask" style="background-color: rgba(251, 251, 251, 0.15);"></div>
                                </a>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${hero.name}</h5>
                                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ajax-modal"
                                        data-hero-id="${hero.id}">
                                    Details
                                </button>

                                <!-- Add to Favorites Button -->
                                <button class="btn btn-primary add-to-favorites" data-hero-id="${hero.id}">
                                    Add to Favorites
                                </button>
                                <!-- Remove from Favorites Button -->
                                <button class="btn btn-danger remove-from-favorites" data-hero-id="${hero.id}" style="display: none;">
                                    Remove from Favorites
                                </button>
                            </div>
                        </div>
                    </div>
                `;

                // Add click event listener to the "Add to Favorites" button
                card.querySelector('.add-to-favorites').addEventListener('click', () => {
                    const favoriteHero = {
                        id: hero.id,
                        name: hero.name,
                        // Add other properties you want to store in local storage
                    };

                    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
                    const isAlreadyFavorite = favorites.some(favorite => favorite.id === favoriteHero.id);

                    if (!isAlreadyFavorite) {
                        favorites.push(favoriteHero);
                        localStorage.setItem('favorites', JSON.stringify(favorites));

                        // Show the "Remove from Favorites" button and hide the "Add to Favorites" button
                        card.querySelector('.add-to-favorites').style.display = 'none';
                        card.querySelector('.remove-from-favorites').style.display = 'inline-block';
                    }
                });

                // Add click event listener to the "Remove from Favorites" button
                card.querySelector('.remove-from-favorites').addEventListener('click', () => {
                    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

                    // Remove the hero from favorites
                    favorites = favorites.filter(favorite => favorite.id !== hero.id);
                    localStorage.setItem('favorites', JSON.stringify(favorites));

                    // Show the "Add to Favorites" button and hide the "Remove from Favorites" button
                    card.querySelector('.add-to-favorites').style.display = 'inline-block';
                    card.querySelector('.remove-from-favorites').style.display = 'none';
                });

                heroList.appendChild(card);
            });
        } else {
            console.error('Error fetching superhero data');
        }
    } catch (error) {
        console.error('Error fetching superhero data:', error);
    }
}

//----------


//-----------
// JavaScript to load content into the modal via Ajax
function loadAjaxContent(heroId) {
    // Construct the URL with the hero.id
    const url = `https://gateway.marvel.com/v1/public/characters/${heroId}?ts=1695747006616&apikey=a486bc808c8ba8212be1958366caad63&hash=065fcc3060e1707768cdf194b0c810ad&`; // Replace 'your-base-url' with the base URL of your content and add the heroId
    const modalContent = document.getElementById('ajax-modal-content');

    // Using the Fetch API for the Ajax request
    fetch(url)
        .then(response => response.json()) // Change to .json() if your response is JSON
        .then(data => {
            // Update the modal content with the fetched data

            //modalContent.innerHTML = data;
            const character = data.data.results[0];

            
            // Function to display "No data available" in black text
            function displayNoData() {
                return '<span style="color: black;">No data available</span>';
            }

            modalContent.innerHTML = `
            <div class="text-center">
                    <div class="d-flex flex-column align-items-center">
                        <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" class="rounded-circle img-fluid" style="width: 150px; height: 150px;">
                        <p style="color: crimson; font-size: 18px; margin-top: 10px;">${character.name}</p>
                    </div>
                </div>
                <h4 style="color: darkred;">Comics:</h4>
                <ul>
                    ${character.comics.items.length > 0 ? 
                        character.comics.items.map(comic => `<li style="color: lightcoral;">${comic.name}</li>`).join('')
                        : `<li>${displayNoData()}</li>`
                    }
                </ul>
                <h4 style="color: darkred;">Series:</h4>
                <ul>
                    ${character.series.items.length > 0 ? 
                        character.series.items.map(series => `<li style="color: lightcoral;">${series.name}</li>`).join('')
                        : `<li>${displayNoData()}</li>`
                    }
                </ul>
                <h4 style="color: darkred;">Stories:</h4>
                <ul>
                    ${character.stories.items.length > 0 ? 
                        character.stories.items.map(story => `<li style="color: lightcoral;">${story.name}</li>`).join('')
                        : `<li>${displayNoData()}</li>`
                    }
                </ul>
                <h4 style="color: darkred;">Events:</h4>
                <ul>
                    ${character.events.items.length > 0 ? 
                        character.events.items.map(event => `<li style="color: lightcoral;">${event.name}</li>`).join('')
                        : `<li>${displayNoData()}</li>`
                    }
                </ul>
                
                <!-- Close button -->
                <!--   <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> -->
   
        `;


        })
        .catch(error => {
            console.error('Error fetching content:', error);
            modalContent.innerHTML = 'Error loading content.';
        });
}

// Add an event listener to trigger content loading when the modal is shown
document.getElementById('ajax-modal').addEventListener('show.bs.modal', function(event) {
    // Get the hero.id from the button's data attribute
    const heroId = event.relatedTarget.getAttribute('data-hero-id');
    
    // Call loadAjaxContent with the heroId
    loadAjaxContent(heroId);
});



// Function to display hero details
function showHeroDetails(hero) {
    heroImage.src = `${hero.thumbnail.path}.${hero.thumbnail.extension}`;
    heroImage.alt = hero.name;
    heroDescription.textContent = hero.description || 'Description not available';
    heroDetailsModalLabel.textContent = hero.name;
    heroDetailsModal.show(); // Show the modal

}

searchBar.addEventListener('input', () => {
    const searchText = searchBar.value.toLowerCase();
    fetchSuperheroes(searchText);
});

// Initial fetch to display all superheroes
fetchSuperheroes('');
