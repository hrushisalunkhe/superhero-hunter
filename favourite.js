function displayFavoriteSuperheroes() {
    const favoriteList = document.getElementById('favoriteList');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoriteList.innerHTML = '<p>No favorite superheroes yet.</p>';
    } else {
        favoriteList.innerHTML = '';

        favorites.forEach(hero => {

            const url = `https://gateway.marvel.com/v1/public/characters/${hero.id}?ts=1695747006616&apikey=a486bc808c8ba8212be1958366caad63&hash=065fcc3060e1707768cdf194b0c810ad&`; // Replace 'your-base-url' with the base URL of your content and add the heroId
            fetch(url)
            .then(response => response.json()) // Change to .json() if your response is JSON
            .then(data => {

                    const character = data.data.results[0];
                    const heroCard = document.createElement('div');
                    heroCard.classList.add('col-md-4', 'mb-4');
                    heroCard.innerHTML = `
                        <div class="card">
                            <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}" class="card-img-top">
                            <div class="card-body">
                                <h5 class="card-title">${character.name}</h5>
                                <p class="card-text">ID: ${character.id}</p>
                                <!-- Add more information about the favorite superhero here -->
                                <button class="btn btn-danger remove-from-favorites" data-hero-id="${character.id}">
                                    Remove from Favorites
                                </button>
                            </div>
                        </div>
                    `;

                    // Add click event listener to the "Remove from Favorites" button
                    heroCard.querySelector('.remove-from-favorites').addEventListener('click', () => {
                        // Remove the hero from favorites in local storage
                        const updatedFavorites = favorites.filter(favorite => favorite.id !== hero.id);
                        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

                        // Remove the hero card from the displayed list
                        heroCard.remove();

                        // Call the function again to refresh the displayed list
                        displayFavoriteSuperheroes();
                    });

                     favoriteList.appendChild(heroCard);
                })  
                .catch(error => {
                console.error('Error fetching content:', error);
                modalContent.innerHTML = 'Error loading content.';
                   });       
        });
    }
}

window.addEventListener('load', displayFavoriteSuperheroes);