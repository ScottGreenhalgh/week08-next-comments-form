
-- Login table
CREATE TABLE login (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Preferences table
CREATE TABLE preferences ( 
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    background_url TEXT, 
    profile_img TEXT, 
    displayname VARCHAR(100),
    user_id INT UNIQUE, 
    FOREIGN KEY (user_id) REFERENCES login(id)
);

-- Forum posts table
CREATE TABLE forum_posts (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL, -- Links to the user in the login table
    username VARCHAR(100) NOT NULL, -- User who created the post
    title VARCHAR(255) NOT NULL,
    post TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES login(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE comments (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    post_id INT NOT NULL, -- Links to the forum post
    user_id INT NOT NULL, -- Links to the user in the login table
    username VARCHAR(100) NOT NULL, -- User who created the comment
    comment TEXT NOT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES login(id) ON DELETE CASCADE
);

-- Likes/Dislikes relational table for posts and comments
CREATE TABLE likes_dislikes (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL, -- Links to the user in the login table
    post_id INT, -- Can be NULL if the like/dislike is for a comment
    comment_id INT, -- Can be NULL if the like/dislike is for a post
    is_like BOOLEAN, -- TRUE for like, FALSE for dislike
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES login(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT unique_like_dislike UNIQUE (user_id, post_id, comment_id)
);


-- Grabbing preferences based on login
SELECT login.username, preferences.background_url, preferences.profile_img, preferences.displayname
FROM login
INNER JOIN preferences ON login.id = preferences.user_id
WHERE login.username = 'exampleUser';

