// JAVASCRIPT PER JSON FETCH
document.addEventListener("DOMContentLoaded", () => {
  const articleContainer = document.querySelector(".main-content");
  const jsonDataUrl = "https://raw.githubusercontent.com/GabrieleL98/the_blog/main/articles.json";

  // Funzione per caricare articoli dal JSON
  const loadArticles = async () => {
    try {
      const response = await fetch(jsonDataUrl);
      const data = await response.json();
      
      console.log("JSON caricato con successo. Numero di articoli trovati:", data.length); // Debug: verifica JSON
      displayArticles(data);
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
        <div class="meta-info">
          <p>${article.date}, ${article.author}. <b>Tags:</b> 
          ${article.tags
            .map((tag) => `<a href="?tag=${tag}" class="tag">#${tag}</a>`)
            .join(" ")}
          </p>
        </div>
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
              .map((tag) => `<a href="?tag=${tag}" class="tag">#${tag}</a>`)
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

  // Carica gli articoli iniziali
  loadArticles();
});



<!-- JAVASCRIPT PER FILTRI -->
document.addEventListener('DOMContentLoaded', () => {
  // Otteniamo tutti i link dei tag
  const filterTags = document.querySelectorAll('.filter-tag');
  
  // Otteniamo tutti gli articoli
  const articles = document.querySelectorAll('article');
  
  // Aggiungiamo l'evento di clic per ogni tag
  filterTags.forEach(tag => {
    tag.addEventListener('click', (event) => {
      event.preventDefault();  // Impediamo il comportamento di default del link (non vogliamo che la pagina venga ricaricata)
      
      // Otteniamo il tag da mostrare
      const tagName = tag.getAttribute('href').split('=')[1];  // Otteniamo il valore del tag dalla URL

      // Nascondiamo tutti gli articoli
      articles.forEach(article => {
        // Troviamo tutti i tag nell'articolo
        const articleTags = article.querySelectorAll('.meta-details .tag');
        
        // Controlliamo se l'articolo ha il tag selezionato
        let hasTag = false;
        articleTags.forEach(articleTag => {
          if (articleTag.getAttribute('href').includes(tagName)) {
            hasTag = true;
          }
        });

        // Mostriamo o nascondiamo l'articolo in base al tag
        if (hasTag || tagName === '') {
          article.style.display = 'block';  // Mostriamo l'articolo
        } else {
          article.style.display = 'none';  // Nascondiamo l'articolo
        }
      });
    });
  });
});
