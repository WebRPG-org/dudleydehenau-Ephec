CREATE TABLE [User] (
    userId INT PRIMARY KEY,
    userFName VARCHAR(50),
    userLName VARCHAR(50),
    userBirth DATE,
    userPassword VARCHAR(50)
);

CREATE TABLE [Level] (
    levelId INT PRIMARY KEY,
    levelName VARCHAR(100),
    levelCreator VARCHAR(100),
    FK_User INT,
    FOREIGN KEY (FK_User) REFERENCES [User](userId) ON DELETE SET NULL
);

CREATE TABLE [ScoreBoard] (
    levelId INT,
    userId INT,
    scoreBTime DATETIME,
    FOREIGN KEY (levelId) REFERENCES [Level](levelId) ON DELETE SET NULL,
    FOREIGN KEY (userId) REFERENCES [User](userId) ON DELETE CASCADE
);
CREATE TABLE [Commentary] (
    userId INT,
    levelId INT,
    commentaryId INT,
    commentaryText VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, levelId, commentaryId),
    FOREIGN KEY (userId) REFERENCES [User](userId) ON DELETE CASCADE,
    FOREIGN KEY (levelId) REFERENCES [Level](levelId) ON DELETE CASCADE
);