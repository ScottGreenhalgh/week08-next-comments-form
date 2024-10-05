## Forums

To begin this project I created a new next.js application with `npx create-next-app@latest`, with TypeScript No, ESLint Yes, Tailwind CSS Yes, src directory Yes, App Router Yes, @ alias Yes. I then linked my github and commited the default unedited packages.

### Ideas

The requirements for this project was a comments form that utilised a PostgreSQL database to create comments. Seeing this I immediately wanted to integrate my existing login framework from the prior weeks react project. Since I already wanted to create a forum to expand upon my login system, this was the route I decided to follow. To start this process, I took a look at how to structure my database. I wanted to integrate my existing one-to-one login and preferences tables with any I would create. Knowing that in a forum many posts can be created with many comments, I knew that a many-to-many relationship was needed here. I then needed to outline numerous foreign keys that would link all 4 of my tables together.

### Refactoring an older project

Since I wanted to utilise my existing login system, the very first thing to do in this project was refactor my react project into a format that next was comfortable with. I first imported all the components and corresponding css files and fixed the pathing and naming to use `name.module.css`. Since react-router-dom was no longer going to be an option since next handles all this with a file structure, I decided to first focus my attention here. I replaced any useNavigation functions with the react client side alternative called useRouter from next/navigation. I also saw that redirect from next/navigation also existed, but from reading the docs, this appears to apply to server rendered components. To avoid the headache of migrating all of my components from client to server components I opted to keep them client side.

Next I created a page.js file under a file strucuture resembling each of the routes I used previously. From here I turned my attention to what was previously my express server. Express is another node module that I would no longer be using so I needed a way of translating what I was doing here to next. Since I already refactored this at the end of my react project into seperate routes this was relatively simple. I created the file path src/app/api and from here I created a folder for every route and placed a route.js file inside each. From here I copied over my previous code and reformatted it to the next structure. Not too much changed with the overall operations of the code, but I did need to modify both the parent function, which is now named after the HTTP request, and the response to `return new Response()`.

### Forms

To start work on integrating my actual forms, I created the overall layout of the pages using the file structure under src/app. I knew I needed a forums page which would display all the posts made. I then created another page.js file under a `[slug]`folder. Ranther than using some arbitrary number to designate the posts, I wanted the slug to reflect the title of the posts, allowing a user who is sent the link to understand the topic of the post before visiting. I placed this behind a folder called `p` which is short for posts and would act as a stopgap between my other pages. This is because I next created a app/forums/create page.js. If I didn't include the p folder then if someone titled their post with create it would cause a huge problem.

With the structure outlined, I next moved onto the logic. Starting with the app/forums page.js, I grabbed all the forum_posts from the sql table and used .map to apply them to the page. Then I noticed the data was rendering. Lickily I created a nice function to handle this in the past, so I inserted that and... it broke. I did some digging and noticed that last time I formatted dates the table I was pulling from had the data stored in a column with a PostgreSQL date, however this time I'm storing a PostgreSQL timestamp, which is apparently formatted completely differnet. A slight pain, but after some googling seems to be handled relatively similarly to how I did it before, so I quickly amended this. I then turned my attention to query strings. Here I used a function to check the characters and format them either ascending or descending based on the query sortBy. I also added a none option if they didn't want sorting.

### Create

Next I needed a method of creating posts to see if they actually appear on the screen correctly. To do this I simply created another client component and handled this with a form. Since I already had a couple of react forms formatted in a way that next.js likes, I could follow an identical formula to quickly make another one. I literally copied one of my existing forms and just changed the values to fit my what I wanted this form to do, which was take a title and post contents, so this didn't take too long. I then handled my database logic under app/api/forums/post, once again following the same structure I was already using to avoid messing around for too long. Heree I would grab the user_id and displayname of the sender and accompany that with the title and post written in the form and insert it into the database. This would generate the rest of the fields automatically since they all have default values.

### Slugs

Next I turned my attention to the page defined by the slugs. I would have the page check the params and send this to the database to find the corresponding forum_post that contains that title and apply it to the page. I would then map through it and apply it to the page. I also needed a way creating posts under this page too so I would need another form. I could've made a server rendered form here, but again following the same formula as earlier, I just made another client component. I would pass the slug to this component so that it can find which post I'm viewing using a database query. The reason I decided on this structure is because I can just freely create a form exactly how I want it to look, send some data I know the server might need and then handle any logic for anything returned quickly. With a design in mind for what data is needed where I can easily build a server side api that handles a request specifically to deal with this single scenario. If more scenarios appear, I can just make more api routes or modify existing ones.

I ran into an issue here when using `router.push(/forums/p/${slug});` to reload the page after a post was made, however it appears this doesn't trigger a full page reload in the way I expected it to. After doing some research this just changes the current route but doesn't actually reload the page. So next I found router.reload(), but this was for versions of next that are much older using next/router, however I was using next/navigation so this didn't work. After doing some further digging, next/navigation offers a similar function called .refresh(). Calling this after response.ok caused a full page refresh resolving the problem.

### Deleting posts

For the delete button I once again opted to use a client component. I decided this simply because there doesn't seem to be a specific reason to not have a form render on the client. This and I was most familiar with this method, and I like the idea of "if it isn't broken, don't fix it". Something tells me this could be forshadowing a potential problem, but regardless I proceeded. Making a new delete endpoint at api/delete that would grab the id of the currently viewed post, and taking the username of the post creator to ensure the delete request isn't made by someone who didn't create the original post. I would then also pass the title to this request to again sanity check that this is indeed what I want to delete. On the client component, I created a simple button that once clicked would run the function to make the request. I added the disable= property to the button to prevent the user from spamming the button and sending half a million requests.

When handling the delete button condictional rendering, I needed to compare the user_id of the post creator and the user_id of the user currently viewing the page. This seemed relatively simply at first, I could just conditionally render the button based on a comparison of the user_id on the post to the currentLogin from my LoginProvider, so I did this. At this point I noticed that the button wasn't rendering, what could've been the problem? Well turns out there was a small oversight with this plan. currentLogin doesn't provide an id, it instead provides the username from the login table. This was a slight pain because I was currently inside a client component where I can't directly make a fetch request to obtain the missing data. My initial thought was to just go back to the server rendered page where I'm rendering the button, making the fetch request here and passing this data down as a prop. This was however also not possible because my LoginProvider is a client component that needs access to the sessionStorage, so the server has no way of obtaining this information (at least not in a convenient way). So after weighing up my options for a while, I decided to create a new endpoint under api/userid which would have the explicit duty of just fetching this missing data. This way I can obtain the value of currentLogin make a fetch request using my authToken and returning the user_id that corresponds with that token. Back on the component, I needed to now warp this fetch request in a useEffect to it ran when the component rendered. It isn't an ideal setup but works.

### Potential issues

With the current setup, when creating comments, the slug is used as a reference instead of the post id. Since the posts routes are generated dynamically based on this slug, if multiple posts are titled identically, when I select from the table based on this slug and obtain the title, more than one entry might return:

```js
await db.query(`SELECT id FROM forum_posts WHERE LOWER(title) = $1`, [
  slug.replace(/-/g, " ").toLowerCase(),
]);
```

I'm thinking of modifying these parameters, or adding an additonal check to see if the title already exists in the table before post submission. I'll probably explore some options before completing this project if I have time, but if I can't think of anything I would love some possible suggestions. I did notice after that .toLowerCase() was redundant becuase I'm using LOWER(title) in the query so I later removed that.

## Requirements

For this project the requirements completed were:

- Displaying all posts on the page (/forums) and sorting them with search parameters.

- All 5 tables used are associated with each other using foreign keys (login, preferences, forum_posts, comments, likes_dislikes)

- A delete button is present on posts. This button conditionally renders based on the post creator.

- Comments are being saved in a dedicated comments table and is connected to the main table with foreign keys.

- Comments are post specific and accessible through dynamic routes /forums/p/{slug}

- Page redirects are present using useRouter from next/navigation since most of my components are client side. redirect() from next/navigation was also an option but seemed optimal for server rendering.

### Additional features

- Refactored login system to next

- Integrating posts, comments and delete functionality with login credentials.
