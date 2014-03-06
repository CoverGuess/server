CREATE TABLE IF NOT EXISTS `albums` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_url` varchar(512) NOT NULL,
  `last_update` bigint(20) NOT NULL,
  `name` varchar(256) NOT NULL,
  `artist` varchar(256) NOT NULL,
  `year` int(11) DEFAULT NULL,
  `main_song` varchar(256) DEFAULT NULL,
  `category` varchar(128) DEFAULT NULL,
  `key` varchar(512) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=70 ;