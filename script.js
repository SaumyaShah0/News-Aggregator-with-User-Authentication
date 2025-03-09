// Authentication System
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    document.body.classList.toggle('logged-in', !!currentUser);
}

// Dark Mode System
function initializeDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// News API Configuration
const API_KEY = "YOUR_API_KEY"; // Enter Your Api Key
const url = "https://newsapi.org/v2/everything?q=";
let currentCategory = 'general';

// DOM Elements
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-text');
const cardsContainer = document.getElementById('cards-container');
const loadingIndicator = document.getElementById('loading');
const bookmarksContainer = document.getElementById('bookmarks-container');

// State Management
let articles = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
searchButton.addEventListener('click', handleSearch);
document.getElementById('logoutButton').addEventListener('click', handleLogout);

// Initialization
function initializeApp() {
    checkAuth();
    initializeDarkMode();
    fetchNews('india');
    setupCategoryClickHandlers();
}

// News Fetching
async function fetchNews(query) {
    try {
        showLoading();
        const response = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        const data = await response.json();
        articles = data.articles;
        bindData(articles);
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('');
    } finally {
        hideLoading();
    }
}

// Data Binding
function bindData(articles) {
    cardsContainer.innerHTML = '';
    const template = document.getElementById('template-news-card');

    articles.forEach(article => {
        if (!article.urlToImage || !article.title) return;

        const cardClone = template.content.cloneNode(true);
        fillCardData(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillCardData(cardClone, article) {
    const { urlToImage, title, source, publishedAt, description, url } = article;

    // Basic Info
    cardClone.querySelector('#news-img').src = urlToImage;
    cardClone.querySelector('#news-title').textContent = title;
    cardClone.querySelector('#news-desc').textContent = description || 'No description available.';

    // Meta Info
    const date = new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    cardClone.querySelector('.news-date').textContent = date;
    cardClone.querySelector('.news-source').textContent = source?.name || 'Unknown Source';

    // Voting System
    initializeVotingSystem(cardClone, article);

    // Bookmark System
    initializeBookmarkSystem(cardClone, article);

    // Card Click Handler
    cardClone.querySelector('.card').addEventListener('click', () => {
        window.open(url, '_blank');
    });
    // Share System
    const shareBtn = cardClone.querySelector('.share-btn');
    shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        shareArticle(article);
    });

}

// Voting System
function initializeVotingSystem(cardClone, article) {
    const articleId = article.url;
    let voteData = JSON.parse(localStorage.getItem(articleId)) || {
        upvotes: 0,
        downvotes: 0,
        userVote: null
    };

    const upvoteBtn = cardClone.querySelector('.upvote-btn');
    const downvoteBtn = cardClone.querySelector('.downvote-btn');
    const upvoteBadge = cardClone.querySelector('.upvote-badge');
    const downvoteBadge = cardClone.querySelector('.downvote-badge');

    updateVoteDisplay();

    upvoteBtn.addEventListener('click', handleVote('up'));
    downvoteBtn.addEventListener('click', handleVote('down'));

    function handleVote(type) {
        return (e) => {
            e.stopPropagation();

            if (voteData.userVote === type) {
                voteData[`${type}votes`]--;
                voteData.userVote = null;
            } else {
                if (voteData.userVote) {
                    voteData[`${voteData.userVote}votes`]--;
                }
                voteData[`${type}votes`]++;
                voteData.userVote = type;
            }

            localStorage.setItem(articleId, JSON.stringify(voteData));
            updateVoteDisplay();
            updateButtonStates();
        };
    }

    function updateVoteDisplay() {
        upvoteBadge.textContent = `▲ ${voteData.upvotes}`;
        downvoteBadge.textContent = `▼ ${voteData.downvotes}`;
    }

    function updateButtonStates() {
        upvoteBtn.classList.toggle('upvoted', voteData.userVote === 'up');
        downvoteBtn.classList.toggle('downvoted', voteData.userVote === 'down');
    }
}

// Bookmark System
function initializeBookmarkSystem(cardClone, article) {
    const bookmarkBtn = cardClone.querySelector('.bookmark-btn');
    const articleId = article.url;
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    // Initial state
    bookmarkBtn.classList.toggle('active', bookmarks.some(b => b.url === articleId));

    bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(article);
        bookmarkBtn.classList.toggle('active');
    });
}

function toggleBookmark(article) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const index = bookmarks.findIndex(b => b.url === article.url);

    if (index === -1) {
        bookmarks.push({
            url: article.url,
            title: article.title,
            description: article.description,
            urlToImage: article.urlToImage,
            source: article.source,
            publishedAt: article.publishedAt
        });
    } else {
        bookmarks.splice(index, 1);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

// Bookmarks Panel
function showBookmarks() {
    bookmarksContainer.classList.add('visible');
    renderBookmarks();
}

function hideBookmarks() {
    bookmarksContainer.classList.remove('visible');
}

function renderBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const bookmarksList = document.getElementById('bookmarks-list');

    bookmarksList.innerHTML = bookmarks.map(article => `
        <div class="bookmark-item">
            <h3>${article.title}</h3>
            ${article.description ? `<p>${article.description.substring(0, 100)}...</p>` : ''}
            <div class="bookmark-actions">
                <button onclick="window.open('${article.url}', '_blank')">Read Article</button>
                <button onclick="removeBookmark('${article.url}')">Remove</button>
            </div>
        </div>
    `).join('');
}

function removeBookmark(url) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks = bookmarks.filter(article => article.url !== url);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    renderBookmarks();
}

// Category Handling
function setupCategoryClickHandlers() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            currentCategory = this.id;
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            fetchNews(currentCategory);
        });
    });
}

// Search Handling
function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    currentCategory = 'search';
    fetchNews(query);
}

// UI Helpers
function showLoading() {
    loadingIndicator.style.display = 'flex';
}

function hideLoading() {
    loadingIndicator.style.display = 'none';
}

function showError(message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    cardsContainer.appendChild(errorEl);
}

// Logout Handling
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Utility
function reload() {
    window.location.reload();
}


// experiment-------------------------------------------------------------------
// Share Functionality
async function shareArticle(article) {
    try {
        await navigator.share({
            title: article.title,
            text: article.description,
            url: article.url
        });
    } catch (err) {
        navigator.clipboard.writeText(article.url);
        alert('Link copied to clipboard!');
    }
}
