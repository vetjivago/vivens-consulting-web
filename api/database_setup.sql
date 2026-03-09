CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Usuário Admin padrão gerado:
-- Email: admin@vivenslab.com
-- Senha: admin
INSERT INTO `users` (`id`, `email`, `password`) VALUES ('d9b2d63d-a233-4123-8478-36e4eb304d9a', 'admin@vivenslab.com', '$2y$10$TqgK8/22vS99Zz2I5lJvReM6Ea6lQ8q7q9aN7L/N7.b0eXpQeO2X2');
