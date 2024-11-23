document.addEventListener("DOMContentLoaded", () => {
  const articleContainer = document.querySelector(".main-content");
  const jsonDataUrl = "https://raw.githubusercontent.com/GabrieleL98/nemosia-website/refs/heads/master/articles.json";
  const filterContainer = document.querySelector('.tag-filter');

  // Funzione per caricare articoli dal JSON
  const loadArticles = async () => {
    try {
      const response = await fetch(jsonDataUrl);
      const data = await response.json();

      console.log("JSON caricato con successo. Numero di articoli trovati:", data.length);
      displayArticles(data);
      generateFilters(data);
      filterArticlesByTag(data); // Aggiungi il filtraggio subito dopo il caricamento degli articoli
    } catch (error) {
      console.error("Errore nel caricamento degli articoli:", error);
    }
  };

  // Funzione per mostrare articoli nella home
  const displayArticles = (articles) => {
    articleContainer.innerHTML = ""; // Svuota il contenitore

    articles.forEach((article) => {
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
    const tagButton = document.createElement('button');
    tagButton.classList.add('filter-tag');
    tagButton.textContent = `#${tag}`;
    tagButton.setAttribute('data-tag', tag);

    // Aggiungi evento click per attivare/disattivare i filtri
    tagButton.addEventListener('click', () => {
      tagButton.classList.toggle('active'); // Attiva/disattiva la classe
      updateArticleFilters(); // Filtra gli articoli
    });

    filterContainer.appendChild(tagButton);
  });
};

// Funzione per aggiornare gli articoli in base ai filtri attivi
const updateArticleFilters = () => {
  const activeTags = Array.from(
    document.querySelectorAll('.filter-tag.active')
  ).map((button) => button.getAttribute('data-tag'));

  // Mostra/nasconde gli articoli in base ai tag attivi
  const articles = document.querySelectorAll('.article');
  articles.forEach((article) => {
    const articleTags = article.getAttribute('data-tags').split(',');
    const isVisible = activeTags.every((tag) => articleTags.includes(tag));
    article.style.display = isVisible ? 'block' : 'none';
  });
};

    // Aggiungere il bottone per rimuovere i filtri
   // const removeFiltersButton = document.createElement('button');
   // removeFiltersButton.classList.add('remove-filters'); // Aggiungi una classe per lo stile
  //  removeFiltersButton.textContent = 'Rimuovi i filtri';
  //  filterContainer.appendChild(removeFiltersButton);

  //  removeFiltersButton.addEventListener('click', () => {
  //    window.location.href = window.location.pathname; // Rimuove i filtri, ricaricando la pagina senza query
 //   });
 // };

  // Funzione per filtrare gli articoli in base al tag selezionato
  const filterArticlesByTag = (articles) => {
    const urlParams = new URLSearchParams(window.location.search);
    const tagFilter = urlParams.get('tag'); // Ottieni il tag dalla query string

    if (tagFilter) {
      // Filtra gli articoli che contengono il tag selezionato
      const filteredArticles = articles.filter((article) => 
        article.tags.includes(tagFilter)
      );
      displayArticles(filteredArticles); // Mostra solo gli articoli filtrati
    }
  };

  // Funzione per mostrare un articolo completo
  const showFullArticle = (articles, articleId) => {
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

      document
        .getElementById("back-to-list")
        .addEventListener("click", () => loadArticles());
    }
  };

  // Carica gli articoli iniziali
  loadArticles();
});
