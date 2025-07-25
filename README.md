# DCU_news_app

This full stack application scrapes the latest Reddit posts related to the DC Universe and presents them in an interactive dashboard. Users can filter by subreddit, keyword, tags and dates, or users can view character-specific news pages. Authenticated users can save personalized pages for quick access

Features:
- The ability to scrape latest Reddit post for DC-related content from verified subreddits 
- filter post by subreddit, keyword, date, and tags 
- User authentication (register,login,logout)
- save and view personalized character pages 
- delete individual post or delete all post from database 
- Embedded Reddit videos and images 
- Dynamic sidebar for quick navigation 
- Token-based authentication with refresh token support

Tech Stack:

- Frontend 
  - React using javascript 
  - axios for API calls 
  - Material UI for styling 
  - React Router 

- Backend 
  - Fastapi using python 
  - MongoDB using PyMongo
  - Pydantic for request validation
  - AsyncPRAW for Reddit scraping 
  - JWT for authentication 

- Deployment
  - Frontend: Vercel
  - Backend: Render
  - Database: MongoDB Atlas
  
How it works:
- Backend 
  - We use Asyncpraw to fetch post from a specific subreddit, in each subreddit they have community pinned post, which we skip to get the most recent post. The scrapper extracts useful metadata like the title, link, author, media URLS (image,video and audio), and tags. Also, if the post has a Reddit hosted video, we extract the fallback audio Url for the full playback support.
  - After we scraped the reddit, the posts that we gather is passed through a function where its saves to MongoDB database, for each post we check to see if the link is already in the database, if found then we skipp as it indicates that the post is a duplicate, it checks to see that the subreddit that the post is from the verified accounts ensuring that we get quality DCU news. after that we save the post to the database, with extra metadata like the time it was scraped at and the tag that the post may have like news or specific characters that the subreddit might have. It then finally converts the autogenerated MongoDB _id into a string instead of an object for the frontend for deleting individual post (using the post id)
  - Once we save the scraped post to MongoDB database, we have a file that has all our function need to for the frontend logic like, like fetching all the post, filtering the database to get post based on subreddit, date range, and keyword/tag. Also, we have deletion functions for deleting by the post id and deleting all post in the database. 
  - Before the frontend logic functions, we have a serialize post function that converse the MongoDB documents into JSON responses with fields like {"id": "829189030912780802" ... } making sure that the frontend can access the data gathered. 
  - After we get regular functions, we have two files for out RESTAPI endpoints for the Fastapi for the reddit functions and the other for the user authentication. The reddit routes file converts the function that we made earlier into the REST api for the Fast API. As for the user authentication, we have REST api functions for register users, logging in , refreshing tokens because when using JWT, their access tokens are self-contained and have a time limit of about 15 minutes so by having two tokens, an access token and a refresh token we can maintain security with the access token and also have user convenience with the refresh token. We then have REST api functions for saving character pages, actually getting character pages, resetting users password and logging out.
  - Those two files are then connected to a main file that makes a Fast API server and uses fast api's middleware to connect to the React Frontend
  - I also have two schemas files, one for the reddit post and the other for user authentication so that we can validate incoming request from the frontend before it reaches any of the logic, by making sure that what the data should be and what types of data the logic receives.
- Frontend
  - The frontend is built using React.js and styled with Material UI to make a responsive and modern interface. It uses axios to connect to the FastAPI Backend making the REST api request to interact with the Reddit post data and user authentication.
  - We have an authentication pages, like the login page, where the user can input their information, email and password and then axios sends a POST request to the backend, if the information is valid the server returns an access token and refresh token. The access token is stored in the MongoDB for authenticating protecting routes.
  - We have a register page that allows users to input their email, username and password, to make a new account with server and that information is saved to the MongoDB. The reset password page allows the user to reset or change their password. 
  - Tokens are stored in cookies to ensure that there is secured communication between client and server. 
  - We have a navigation and user pages, where the user can access other pages using a sidebar to view other pages like the dashboard, saved character pages and other pages. 
  - After the user logins in, they are sent to the main page or the dashboard page. In the dashboard page, the user can trigger the reddit scrape from the verified subreddit, the ability to view all the post in a Reddit style card format. The users can filter the posts by the subreddit, keyword and tags, or by a data range with the ability to input the wanted information. also the haev the ablity to click on the trash icon on each post and delete it. It does it buy getting the post_id of the card you are clicking the trash icon on and sending it to the backend to be deleted and the user can delete every post 
  - Each Reddit post card components are reusable and minc the Reddit post that the user would see in Reddit, they can support displaying images, or Reddit hosting video, shows the date, title and tag
  - For the saved character page, users can have the ability to save a page for a specific DCU characters like Superman or Batman, and by doing that you will get only that characters news in those dedicated pages. Each page the user saves is stored in the database that is tied to the user account. 
  - It uses central Axios instance to handle the API request 
  - if the access token expires the frontend automatically hit our refresh route using your stored refresh token to re-authenticate without the need to have the user login in again.  

Live Demo:
DCU NEWS APP: https://dcu-news-app.vercel.app/

Motivation:
As a passionate fan of the DC Universe and someone constantly browsing Reddit for the latest updates, I noticed a recurring problem: there was no centralized, clean, and interactive way to track news and updates across multiple DC-related subreddits. Whether it was film announcements, comic leaks, or fan discussions, I had to jump between subreddits, filter out irrelevant content, and try to piece together a timeline of what was going on. Also wanted to make a hands-on project using real world tech stack to strengthen my resume. By developing this app, I not only deepened my knowledge of full-stack web development, authentication, and API design, but also making something that I can use and others like me use 

Future Enhancements: 
- fix the timeline functionality, the model, router, and frontend 
- add alert into the UI telling the user what they have done like telling the user what post they deleted and the filter they are searching
- delete all post that are from a specific subreddit 
- give the user the ability to customize the dashboard page like the ui color or the background as well as do so for the character page 
- add the username to the top of the website to show what account the user is signed into 
- fix the tag component so that they match the tags from the actual Reddit post 
- 