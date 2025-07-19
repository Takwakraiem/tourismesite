-- Insert countries
INSERT INTO countries (id, name, slug, description, image, gradient) VALUES
('country_tunisia', 'Tunisie', 'tunisia', 'Découvrez la perle du Maghreb', '/placeholder.svg?height=300&width=400', 'from-red-500 to-yellow-500'),
('country_morocco', 'Maroc', 'morocco', 'L''empire des mille et une nuits', '/placeholder.svg?height=300&width=400', 'from-green-500 to-red-500'),
('country_maghreb', 'Circuit Maghreb', 'maghreb', 'Explorez tout le Maghreb', '/placeholder.svg?height=300&width=400', 'from-blue-500 to-purple-500');

-- Insert sample programs
INSERT INTO programs (id, title, slug, description, short_description, location, duration, price, max_participants, country_id, status) VALUES
('prog_oasis', 'Circuit des Oasis', 'circuit-des-oasis', 'Partez à la découverte des magnifiques oasis du sud tunisien dans ce circuit exceptionnel de 5 jours.', 'Découvrez les oasis du sud tunisien', 'Tozeur - Douz', '5 jours', 450, 12, 'country_tunisia', 'PUBLISHED'),
('prog_medina', 'Médina de Tunis', 'medina-de-tunis', 'Explorez la médina historique de Tunis, patrimoine mondial de l''UNESCO.', 'Explorez la médina historique', 'Tunis', '2 jours', 180, 15, 'country_tunisia', 'PUBLISHED'),
('prog_sahara', 'Sahara Adventure', 'sahara-adventure', 'Une aventure inoubliable dans le désert du Sahara avec nuit sous les étoiles.', 'Aventure dans le désert', 'Douz - Ksar Ghilane', '7 jours', 680, 10, 'country_tunisia', 'PUBLISHED');

-- Insert sample guides
INSERT INTO guides (id, name, email, specialty, bio, rating, total_reviews, experience, languages, country_id) VALUES
('guide_ahmed', 'Ahmed Ben Ali', 'ahmed@polyglotte.com', 'Histoire & Culture', 'Guide expérimenté spécialisé dans l''histoire et la culture tunisienne.', 4.9, 145, 8, ARRAY['Français', 'Arabe', 'Anglais'], 'country_tunisia'),
('guide_fatima', 'Fatima Zahra', 'fatima@polyglotte.com', 'Nature & Aventure', 'Passionnée de nature et d''aventure, spécialiste des circuits désert.', 4.8, 98, 6, ARRAY['Français', 'Arabe'], 'country_tunisia');

-- Insert admin user (password: admin123)
INSERT INTO users (id, name, email, password, role) VALUES
('admin_user', 'Administrateur', 'admin@polyglotte.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/hL/.LVtOy', 'ADMIN');
