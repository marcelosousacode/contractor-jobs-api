-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: localhost    Database: db_bicos
-- ------------------------------------------------------
-- Server version	8.0.28-0ubuntu0.20.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `uf` varchar(5) NOT NULL,
  `city` varchar(45) NOT NULL,
  `password` varchar(25) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (1,'Danilo Isidoro','danilo.santos.clear@gmail.com',NULL,'13999999999',NULL,'SP','Praia Grande','123','2022-04-04 00:00:00','2022-04-04 00:00:00'),(2,'Everson Pereira','everson.pereira.clear@gmail.com',NULL,'13999999999',NULL,'SP','Cubatão','123','2022-04-04 00:00:00','2022-04-04 00:00:00'),(3,'Rodrigo Moreira','rodrigo.moreira.clear@gmail.com',NULL,'13999999999',NULL,'SP','Cubatão','123','2022-04-04 00:00:00','2022-04-04 00:00:00'),(4,'Joao Moreira','joao.moreira@gmail.com','11122233344','13999999999',NULL,'SP','Santos','123','2022-04-04 20:58:24','2022-04-04 20:58:54');
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_professional_profission`
--

DROP TABLE IF EXISTS `item_professional_profission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_professional_profission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fk_professional` int NOT NULL,
  `fk_profission` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_item_professional_profission_idx` (`fk_professional`),
  KEY `fk_item_profission_professional_idx` (`fk_profission`),
  CONSTRAINT `fk_item_professional_profission` FOREIGN KEY (`fk_professional`) REFERENCES `professional` (`id`),
  CONSTRAINT `fk_item_profission_professional` FOREIGN KEY (`fk_profission`) REFERENCES `profission` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_professional_profission`
--

LOCK TABLES `item_professional_profission` WRITE;
/*!40000 ALTER TABLE `item_professional_profission` DISABLE KEYS */;
/*!40000 ALTER TABLE `item_professional_profission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_card` varchar(10) NOT NULL,
  `number` int NOT NULL,
  `expiration_at` varchar(7) NOT NULL,
  `code` int NOT NULL,
  `fk_client` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_payment_client_idx` (`fk_client`),
  CONSTRAINT `fk_payment_client` FOREIGN KEY (`fk_client`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professional`
--

DROP TABLE IF EXISTS `professional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professional` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `photo` varchar(100) DEFAULT NULL,
  `uf` varchar(5) NOT NULL,
  `city` varchar(45) NOT NULL,
  `password` varchar(25) NOT NULL,
  `rate` int DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professional`
--

LOCK TABLES `professional` WRITE;
/*!40000 ALTER TABLE `professional` DISABLE KEYS */;
INSERT INTO `professional` VALUES (1,'Mario Santos','mario.santos@gmail.com',NULL,'13999999999',NULL,'SP','Santos','123',NULL,NULL,'2022-04-04 00:00:00','2022-04-04 00:00:00'),(2,'Ricardao Santos','ricardao.santos@gmail.com',NULL,'13999999999',NULL,'SP','Praia Grande','123',NULL,NULL,'2022-04-04 00:00:00','2022-04-04 00:00:00');
/*!40000 ALTER TABLE `professional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profission`
--

DROP TABLE IF EXISTS `profission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profission`
--

LOCK TABLES `profission` WRITE;
/*!40000 ALTER TABLE `profission` DISABLE KEYS */;
/*!40000 ALTER TABLE `profission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scheduling`
--

DROP TABLE IF EXISTS `scheduling`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scheduling` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `time` datetime NOT NULL,
  `fk_professional` int NOT NULL,
  `fk_client` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_professional_idx` (`fk_professional`),
  KEY `fk_client_idx` (`fk_client`),
  CONSTRAINT `fk_client` FOREIGN KEY (`fk_client`) REFERENCES `client` (`id`),
  CONSTRAINT `fk_professional` FOREIGN KEY (`fk_professional`) REFERENCES `professional` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scheduling`
--

LOCK TABLES `scheduling` WRITE;
/*!40000 ALTER TABLE `scheduling` DISABLE KEYS */;
INSERT INTO `scheduling` VALUES (1,'2022-04-04','2022-04-04 17:58:06',1,1,'2022-04-04 00:00:00','2022-04-04 00:00:00');
/*!40000 ALTER TABLE `scheduling` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-04-04 18:06:05
