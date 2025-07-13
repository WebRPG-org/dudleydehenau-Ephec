CREATE TABLE `scapegame`.`user` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userFName` varchar(50) NOT NULL,
  `userLName` varchar(50) NOT NULL,
  `userBirth` date NOT NULL,
  `userPassword` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`userId`)
);

CREATE TABLE `scapegame`.`level` (
  `levelId` int NOT NULL AUTO_INCREMENT,
  `levelName` varchar(100) NOT NULL,
  `userId` int NOT NULL,
  `difficulty` TINYINT NOT NULL,
  `theme` VARCHAR(50) NOT NULL,
  `likes` INT NOT NULL DEFAULT 0,
  `publication_date` DATE NOT NULL,
  `views` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`levelId`),
  CONSTRAINT `userLevelFK` FOREIGN KEY (`userId`) REFERENCES `scapegame`.`user` (`userId`)
);

CREATE TABLE `scapegame`.`scoreboard` (
  `levelId` int NOT NULL,
  `userId` int NOT NULL,
  `scoreBTime` int DEFAULT NULL,
  PRIMARY KEY (`userId`,`levelId`),
  CONSTRAINT `levelScoreFK` FOREIGN KEY (`levelId`) REFERENCES `scapegame`.`level` (`levelId`),
  CONSTRAINT `userScoreFK` FOREIGN KEY (`userId`) REFERENCES `scapegame`.`user` (`userId`)
);

CREATE TABLE `scapegame`.`commentary` (
  `userId` int NOT NULL,
  `levelId` int NOT NULL,
  `commentaryId` int NOT NULL AUTO_INCREMENT,
  `commentaryText` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`commentaryId`),
  CONSTRAINT `comLevelFK` FOREIGN KEY (`levelId`) REFERENCES `scapegame`.`level` (`levelId`),
  CONSTRAINT `comUserFK` FOREIGN KEY (`userId`) REFERENCES `scapegame`.`user` (`userId`)
);

INSERT INTO `scapegame`.`level` (`levelId`,`levelName`, `userId`, `difficulty`, `theme`, `likes`, `publication_date`, `views`)
VALUES (1,'chambre', 1, 5, 'casse-tete', 10, '2024-03-13', 100),
       (2,'prison', 1, 3, 'jeux-video', 5, '2024-05-13', 50),
       (3,'chateau', 1, 4, 'jeux-video', 7, '2024-03-27', 70),
       (4,'espace', 1, 2, 'culture', 3, '2024-01-13', 30),
       (5,'hopital', 1, 1, 'dev', 1, CURDATE(), 10),
       (6,'jardin', 1, 5, 'dev', 15, CURDATE(), 150);