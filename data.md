CREATE TABLE intervenants (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    key VARCHAR(255) NOT NULL,
    creationdate DATE NOT NULL,
    enddate DATE NOT NULL,
    availability JSON
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO intervenants (email, firstname, lastname, key, creationdate, enddate, availability)
VALUES
('laura.martin@unilim.fr', 'Laura', 'Martin', 'laura-key', '2022-01-10', '2023-01-10', '{}'),  -- Expiré
('jean.dupont@unilim.fr', 'Jean', 'Dupont', 'jean-key', '2023-03-22', '2025-03-22', '{}'),  -- Expiré
('maria.lopez@unilim.fr', 'Maria', 'Lopez', 'maria-key', '2023-11-10', '2024-11-10', '{}'),  -- Expiré
('paul.garcia@unilim.fr', 'Paul', 'Garcia', 'paul-key', '2023-06-05', '2026-06-05', '{}'),  -- Expiré
('isabelle.roux@unilim.fr', 'Isabelle', 'Roux', 'isabelle-key', '2022-11-15', '2023-11-15', '{}'),  -- Expiré
('jacques.bernard@unilim.fr', 'Jacques', 'Bernard', 'jacques-key', '2023-10-05', '2024-10-05', '{}'),  -- Expiré
('nathalie.jones@unilim.fr', 'Nathalie', 'Jones', 'nathalie-key', '2024-01-10', '2025-01-10', '{}'),  -- Valide
('olivier.lemoine@unilim.fr', 'Olivier', 'Lemoine', 'olivier-key', '2024-02-15', '2025-02-15', '{}'),  -- Valide
('emilie.durand@unilim.fr', 'Emilie', 'Durand', 'emilie-key', '2024-03-05', '2025-03-05', '{}'),  -- Valide
('antoine.dupuis@unilim.fr', 'Antoine', 'Dupuis', 'antoine-key', '2023-08-15', '2024-08-15', '{}'),  -- Expiré

('yannick.boudon@unilim.fr', 'Yannick', 'Boudon', 'yannick-key', '2024-05-01', '2025-05-01', '{}'),  -- Valide
('sophie.ribeiro@unilim.fr', 'Sophie', 'Ribeiro', 'sophie-key', '2024-06-15', '2025-06-15', '{}'),  -- Valide
('sebastien.rodriguez@unilim.fr', 'Sébastien', 'Rodriguez', 'sebastien-key', '2024-08-12', '2025-08-12', '{}'),  -- Valide
('lucie.bourdon@unilim.fr', 'Lucie', 'Bourdon', 'lucie-key', '2022-02-02', '2023-02-02', '{}'),  -- Expiré
('marc.tanguy@unilim.fr', 'Marc', 'Tanguy', 'marc-key', '2024-04-10', '2025-04-10', '{}'),  -- Valide
('julie.leclercq@unilim.fr', 'Julie', 'Leclercq', 'julie-key', '2023-12-18', '2024-12-18', '{}'),  -- Expiré
('chris.meyer@unilim.fr', 'Chris', 'Meyer', 'chris-key', '2024-07-20', '2025-07-20', '{}'),  -- Valide
('aline.girard@unilim.fr', 'Aline', 'Girard', 'aline-key', '2024-09-30', '2025-09-30', '{}'),  -- Valide
('george.martinez@unilim.fr', 'George', 'Martinez', 'george-key', '2023-07-18', '2024-07-18', '{}');  -- Expiré


INSERT INTO users (email, firstname, lastname, password)
VALUES
('user@nextmail.com', 'User', 'Next', '$2b$10$wciirz73qduyU9NY57uw7ugHjUQH.flZ6Z0UvYcHMuLH2lM0AAvFm');