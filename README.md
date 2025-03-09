# News Aggregator with User Authentication

## Overview
This is a simple **News Aggregator Web App** that fetches real-time news using the **News API**. Users can **sign up, log in, search for news**, filter by category, **bookmark articles**, and switch between **light and dark mode**.

**This project is not complete, but it's working.**

## Features
- **User Authentication:** Signup and login functionality using LocalStorage.
- **News Fetching:** Retrieves live news articles via the **News API**.
- **Search & Category Filters:** Users can search for news or filter by topics like **Cricket, Finance, Politics, Tech**.
- **Bookmarks:** Save favorite articles for later.
- **Voting System:** Upvote/downvote news articles.
- **Dark Mode Support:** Toggle between light and dark mode.

## Installation & Setup
1. Clone this repository:
   ```sh
   git clone https://github.com/your-repo/news-aggregator.git
   ```
2. Navigate to the project folder:
   ```sh
   cd news-aggregator
   ```
3. Open `index.html` in a browser to run the app.

## Usage
- **Sign Up/Login:** Create an account or log in with existing credentials.
- **Search News:** Use the search bar to find articles by keyword.
- **Browse Categories:** Click on category links to filter news.
- **Bookmark Articles:** Click the bookmark icon to save articles.
- **Vote on Articles:** Upvote or downvote news items.
- **Dark Mode:** Toggle dark mode using the moon/sun icon.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Storage:** LocalStorage (for authentication and preferences)
- **API:** [NewsAPI](https://newsapi.org/)

## File Structure
```
📂 news-aggregator
├── index.html       # Main page
├── login.html       # Login page
├── signup.html      # Signup page
├── style.css        # Main styles
├── login.css        # Authentication styles
├── script.js        # News fetching & UI handling
├── auth.js          # Authentication logic
```

## Future Improvements
- **Backend integration** for secure authentication.
- **Database support** for user accounts and bookmarks.
- **More news sources** and additional categories.

## License
This project is open-source and available under the **MIT License**.

