function startApp() {
    const result = document.querySelector('#resultado');
    const form = document.querySelector('#formulario');
    const paginationDiv = document.querySelector('#paginacion');
    const key = '46760508-18ff50aabb2880d111d64566a';

    let terminoBusqueda = '';
    let currentPage = 1;
    let totalPages;

    form.addEventListener('submit', validateForm);

    function validateForm(e) {
        e.preventDefault();
        terminoBusqueda = document.querySelector('#termino').value.trim();

        if (terminoBusqueda === '') {
            showAlert('Agrega un término de búsqueda');
            return;
        }

        currentPage = 1; // Reiniciar a la primera página en cada nueva búsqueda
        searchImages();
    }

    function showAlert(message) {
        const alert = document.querySelector('.bg-red-100');
        if (!alert) {
            const alert = document.createElement('P');
            alert.classList.add('bg-red-200', 'border-red-400', 'text-red-800', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
            alert.innerHTML = `
                <span class="block sm:inline">${message}</span>
            `;
            form.appendChild(alert);
            setTimeout(() => {
                alert.remove();
            }, 2500);
        }
    }

    function searchImages() {
        const url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&per_page=6&page=${currentPage}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                totalPages = calculatePages(data.totalHits);
                showImages(data.hits);
                showPagination();
            });
    }

    function showImages(images) {
        result.innerHTML = '';
        images.forEach(image => {
            const { previewURL, likes, views, largeImageURL } = image;
            result.innerHTML += `
                <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4 ">
                    <div class="relative bg-white rounded-lg shadow-md overflow-hidden">
                        <img class="w-full h-48 object-cover" src="${previewURL}" alt="imagen">
                        <div class=" content-center justify-center absolute bottom-16 left-0 right-0 p-4 text-white">
                            <p class="font-bold ">${likes} <span class="font-light">Me Gusta</span></p>
                            <p class="font-bold">${views} <span class="font-light">Vistas</span></p>
                        </div>
                        <a class="absolute bottom-0 right-0 w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-2 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
                    </div>
                </div>
            `;
        });
    }
    

    function calculatePages(totalResults) {
        return Math.ceil(totalResults / 6);
    }

    function showPagination() {
        paginationDiv.innerHTML = '';
        const previousButton = document.createElement('button');
        previousButton.textContent = 'Anterior';
        previousButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'mr-2', 'rounded', 'hover:bg-blue-600', 'font-semibold');
        previousButton.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                searchImages();
            }
        };

        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'ml-2', 'rounded', 'hover:bg-blue-600', 'font-semibold');
        nextButton.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                searchImages();
            }
        };

        if (currentPage > 1) {
            paginationDiv.appendChild(previousButton);
        }
        if (currentPage < totalPages) {
            paginationDiv.appendChild(nextButton);
        }
    }
}

document.addEventListener('DOMContentLoaded', startApp);
