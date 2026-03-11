-- phpMyAdmin SQL Dump
-- Database: `josel054_vivens_db`

CREATE TABLE IF NOT EXISTS `ava_courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `instructor` VARCHAR(255),
  `thumbnail_url` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ava_modules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `order_index` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`course_id`) REFERENCES `ava_courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ava_lessons` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `module_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `video_url` VARCHAR(255),
  `content_text` TEXT,
  `duration_minutes` INT DEFAULT 0,
  `order_index` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`module_id`) REFERENCES `ava_modules`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ava_user_progress` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,  -- Assuming links to existing users table
  `course_id` INT NOT NULL,
  `lesson_id` INT NOT NULL,
  `completed` TINYINT(1) DEFAULT 0,
  `last_accessed` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `user_lesson_unique` (`user_id`, `lesson_id`),
  FOREIGN KEY (`course_id`) REFERENCES `ava_courses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`lesson_id`) REFERENCES `ava_lessons`(`id`) ON DELETE CASCADE
  -- Assuming users table exists, but not adding FK to avoid errors if it's named differently
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert some dummy data
INSERT INTO `ava_courses` (`title`, `description`, `instructor`, `thumbnail_url`) VALUES
('Ciência de Animais de Laboratório', 'Curso completo sobre bem-estar e ética.', 'Dra. Marina Silva', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'),
('Introdução aos 3Rs', 'Fundamentos da substituição, redução e refinamento.', 'Equipe Vivens', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop');

-- Assuming Course ID 1 is the above
INSERT INTO `ava_modules` (`course_id`, `title`, `order_index`) VALUES
(1, 'Módulo 1: Fundamentos', 1),
(1, 'Módulo 2: Legislação', 2);

INSERT INTO `ava_lessons` (`module_id`, `title`, `video_url`, `content_text`, `duration_minutes`, `order_index`) VALUES
(1, '1.1 Introdução à Ética Animal', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Nesta aula introdutória, abordaremos os conceitos fundamentais sobre ética e uso de animais na ciência.', 15, 1),
(1, '1.2 Histórico dos 3Rs', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Como os princípios dos 3Rs foram criados e sua evolução.', 22, 2);
