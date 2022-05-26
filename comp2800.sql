-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2022 at 07:40 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `comp2800`
--

-- --------------------------------------------------------

--
-- Table structure for table `bby_2_score`
--

CREATE TABLE `bby_2_score` (
  `scoreID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `scoreValue` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bby_2_timeline`
--

CREATE TABLE `bby_2_timeline` (
  `timelineID` int(11) NOT NULL,
  `userID` int(11) DEFAULT NULL,
  `caption` varchar(100) DEFAULT NULL,
  `playdate` date DEFAULT NULL,
  `playtime` time DEFAULT NULL,
  `playimage` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bby_2_timeline`
--

INSERT INTO `bby_2_timeline` (`timelineID`, `userID`, `caption`, `playdate`, `playtime`, `playimage`) VALUES
(1, '2','New highscore!', '2022-05-25', '11:02:05', "dog");


-- --------------------------------------------------------

--
-- Table structure for table `bby_2_user`
--

CREATE TABLE `bby_2_user` (
  `userID` int(255) NOT NULL,
  `adminRights` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pass` varchar(100) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bby_2_user`
--

INSERT INTO `bby_2_user` (`userID`, `adminRights`, `email`, `pass`, `firstName`, `lastName`) VALUES
(1, 'YES', 'ramsay@mail.com', '123', 'Ramsay', 'Elhalhuli'),
(2, 'NO', 'valerie@mail.com', '123', 'Valerie', 'Tan');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bby_2_score`
--
ALTER TABLE `bby_2_score`
  ADD PRIMARY KEY (`scoreID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `bby_2_timeline`
--
ALTER TABLE `bby_2_timeline`
  ADD PRIMARY KEY (`timelineID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `bby_2_user`
--
ALTER TABLE `bby_2_user`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bby_2_score`
--
ALTER TABLE `bby_2_score`
  MODIFY `scoreID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bby_2_timeline`
--
ALTER TABLE `bby_2_timeline`
  MODIFY `timelineID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bby_2_user`
--
ALTER TABLE `bby_2_user`
  MODIFY `userID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bby_2_score`
--
ALTER TABLE `bby_2_score`
  ADD CONSTRAINT `bby_2_score_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `bby_2_user` (`userID`);

--
-- Constraints for table `bby_2_timeline`
--
ALTER TABLE `bby_2_timeline`
  ADD CONSTRAINT `bby_2_timeline_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `bby_2_user` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
