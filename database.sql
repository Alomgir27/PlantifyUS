-- Users Table
CREATE TABLE Users (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    image VARCHAR(255),
    bio TEXT,
    location_point POINT,
    badges TEXT, -- Storing badge IDs as a JSON array
    type ENUM('user', 'moderator', 'admin'),
    uuid VARCHAR(255),
    pushToken VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Organizations Table
CREATE TABLE Organizations (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    bio TEXT,
    location_point POINT,
    badges TEXT, -- Storing badge IDs as a JSON array
    isVerified BOOLEAN,
    type VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Events Table
CREATE TABLE Events (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    location_point POINT,
    requirements JSON, -- Storing requirements as JSON object
    landsDescription TEXT,
    status ENUM('pending', 'approved', 'rejected', 'completed'),
    author_id INT,
    organization_id INT,
    collectedFunds DECIMAL(10, 2),
    isVerified BOOLEAN,
    type VARCHAR(255),
    whoVerified_id INT,
    hostDetails_day VARCHAR(255),
    hostDetails_month VARCHAR(255),
    hostDetails_year VARCHAR(255),
    hostDetails_length VARCHAR(255),
    hostDetails_startTime VARCHAR(255),
    hostDetails_text TEXT,
    hostDetails_message TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(id),
    FOREIGN KEY (organization_id) REFERENCES Organizations(id),
    FOREIGN KEY (whoVerified_id) REFERENCES Users(id)
);

-- Trees Table
CREATE TABLE Trees (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    scientificName VARCHAR(255),
    description TEXT,
    benefits TEXT,
    requirements JSON, -- Storing requirements as JSON object
    uploadBy_id INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (uploadBy_id) REFERENCES Users(id)
);

-- Donations Table
CREATE TABLE Donations (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    amount DECIMAL(10, 2),
    event_id INT,
    type VARCHAR(255),
    trees INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(id)
);

-- Posts Table
CREATE TABLE Posts (
    id INT PRIMARY KEY,
    author_id INT,
    text TEXT,
    event_id INT,
    isVerified BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(id),
    FOREIGN KEY (event_id) REFERENCES Events(id)
);

-- Favourites Table
CREATE TABLE Favourites (
    id INT PRIMARY KEY,
    type VARCHAR(255),
    event_id INT,
    tree_id INT,
    organization_id INT,
    user_id INT,
    post_id INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(id),
    FOREIGN KEY (tree_id) REFERENCES Trees(id),
    FOREIGN KEY (organization_id) REFERENCES Organizations(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (post_id) REFERENCES Posts(id)
);

-- Notifications Table
CREATE TABLE Notifications (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    message TEXT,
    read BOOLEAN,
    type VARCHAR(255),
    user_id INT,
    event_id INT,
    organization_id INT,
    post_id INT,
    image VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (event_id) REFERENCES Events(id),
    FOREIGN KEY (organization_id) REFERENCES Organizations(id),
    FOREIGN KEY (post_id) REFERENCES Posts(id)
);

-- Badges Table
CREATE TABLE Badges (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    image VARCHAR(255),
    description TEXT,
    type VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Progress Table
CREATE TABLE Progress (
    id INT PRIMARY KEY,
    event_id INT,
    type VARCHAR(255),
    treesPlanted INT,
    moneyCollected DECIMAL(10, 2),
    moneyNeeds DECIMAL(10, 2),
    volunteers INT,
    treesNeeds INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES Events(id)
);

-- Comments Table
CREATE TABLE Comments (
    id INT PRIMARY KEY,
    text TEXT,
    author_id INT,
    upvotes TEXT, -- Storing upvote user IDs as a JSON array
    downvotes TEXT, -- Storing downvote user IDs as a JSON array
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES Users(id)
);



1. One-to-Many Relationships:
   - Users to Events (Author)
   - Users to Posts (Author)
   - Users to Favourites (User)
   - Users to Notifications (User)
   - Organizations to Events (Organization)
   - Organizations to Users (Admin)
   - Organizations to Users (Moderators)
   - Organizations to Users (Volunteers)
   - Events to Donations (Event)
   - Events to Favourites (Event)
   - Events to Notifications (Event)
   - Trees to Favourites (Tree)
   - Comments to Users (Author)
   - Comments to Posts (Post)

2. Many-to-One Relationships:
   - Events to Users (Author)
   - Events to Users (Who Verified)
   - Events to Organizations (Organization)
   - Trees to Users (Upload By)
   - Donations to Events (Event)
   - Posts to Users (Author)
   - Posts to Events (Event)
   - Favourites to Events (Event)
   - Favourites to Trees (Tree)
   - Favourites to Organizations (Organization)
   - Favourites to Users (User)
   - Favourites to Posts (Post)
   - Notifications to Users (User)
   - Notifications to Events (Event)
   - Notifications to Organizations (Organization)
   - Notifications to Posts (Post)

3. Many-to-Many Relationships (through Junction Tables):
   - Users to Users (Friends)
   - Users to Events (Events Attending)
   - Users to Badges (Badges)
   - Organizations to Events (Events)
   - Events to Users (Attendees)
   - Events to Users (Upvotes)
   - Events to Users (Downvotes)
   - Posts to Users (Upvotes)
   - Posts to Users (Downvotes)
   - Posts to Comments (Comments)
   - Comments to Comments (Reply To)

