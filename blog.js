// JAVASCRIPT PER JSON FETCH
document.addEventListener("DOMContentLoaded", () => {
  const articleContainer = document.querySelector(".main-content");
  const tagContainer = document.querySelector(".tag-filter"); // Sidebar per i filtri
  const jsonDataUrl = "https://raw.githubusercontent.com/GabrieleL98/nemosia-website/refs/heads/master/articles.json";

  // Funzione per caricare articoli dal JSON
  const loadArticles = async (filterTag = null) => {
    try {
      const response = await fetch(jsonDataUrl);
      const data = await response.json();
      
      console.log("JSON caricato con successo. Numero di articoli trovati:", data.length); // Debug: verifica JSON

      // Se c'è un filtro applicato, filtriamo gli articoli
      const filteredArticles = filterTag
        ? data.filter(article => article.tags.includes(filterTag))
        : data;

      displayArticles(filteredArticles); // Visualizza gli articoli filtrati
      displayFilters(data); // Mostra i filtri
    } catch (error) {
      console.error("Errore nel caricamento degli articoli:", error);
    }
  };

  // Funzione per mostrare articoli nella home
  const displayArticles = (articles) => {
    articleContainer.innerHTML = ""; // Svuota il contenitore

    console.log("Rendering articoli..."); // Debug: inizio del rendering
    articles.forEach((article) => {
      console.log("Rendering articolo con ID:", article.id, "Titolo:", article.title); // Debug: ogni articolo

      const articleElement = document.createElement("article");
      articleElement.innerHTML = `
        <img src="${article.image}" alt="${article.title}" />
        <h2 class="article-title">
          <a href="#" data-id="${article.id}">${article.title}</a>
        </h2>
        <p class="justify-text">${article.description}</p>
        <hr>
        <div class="meta-info">
          <p>${article.date}, ${article.author}. <b>Tags:</b> 
          ${article.tags
            .map((tag) => `<a href="?tag=${tag}" class="tag">${tag}</a>`)
            .join(" ")}
          </p>
        </div>
        <hr>
      `;
      articleContainer.appendChild(articleElement);
    });

    console.log("Numero di articoli renderizzati nel DOM:", articleContainer.children.length); // Debug: verifica DOM

    // Aggiungi l'evento clic ai titoli
    const articleLinks = document.querySelectorAll(".article-title a");
    articleLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const articleId = link.dataset.id;
        showFullArticle(articles, articleId);
      });
    });
  };

   // Funzione per generare i filtri dalla lista dei tag
  const generateFilters = (articles) => {
    const tags = new Set(); // Set per evitare duplicati
    articles.forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag));
    });

    filterContainer.innerHTML = ''; // Pulisce i filtri esistenti

    tags.forEach((tag) => {
      const tagLink = document.createElement('a');
      tagLink.href = `?tag=${tag}`;
      tagLink.classList.add('filter-tag');
      tagLink.textContent = `#${tag}`;
      filterContainer.appendChild(tagLink);
    });

    // Aggiungere il bottone per rimuovere i filtri
    const removeFiltersButton = document.createElement('button');
    removeFiltersButton.classList.add('remove-filters'); // Aggiungi una classe per lo stile
    removeFiltersButton.textContent = 'Rimuovi i filtri';
    filterContainer.appendChild(removeFiltersButton);

    removeFiltersButton.addEventListener('click', () => {
      window.location.href = window.location.pathname; // Rimuove i filtri, ricaricando la pagina senza query
    });
  };
  
  // Funzione per mostrare un articolo completo
  const showFullArticle = (articles, articleId) => {
    console.log("Mostrando articolo con ID:", articleId); // Debug: verifica ID
    const article = articles.find((a) => a.id === articleId);

    if (article) {
      articleContainer.innerHTML = `
        <article>
          <img src="${article.image}" alt="${article.title}" />
          <h2 class="article-title">${article.title}</h2>
          <p>${article.content}</p>
          <div class="meta-info">
            <p>${article.date}, ${article.author}. <b>Tags:</b> 
            ${article.tags
              .map((tag) => `<a href="?tag=${tag}" class="tag">${tag}</a>`)
              .join(" ")}
            </p>
          </div>
          <button id="back-to-list" class="back_button">Torna alla lista</button>
        </article>
      `;

      // Pulsante per tornare alla lista
      document
        .getElementById("back-to-list")
        .addEventListener("click", () => loadArticles());
    } else {
      console.error("Articolo non trovato con ID:", articleId); // Debug: articolo non trovato
    }
  };

  // Carica gli articoli iniziali senza filtri
  loadArticles();
});
