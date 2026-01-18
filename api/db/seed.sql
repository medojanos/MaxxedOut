-- Users
INSERT INTO users (email, password, nickname) VALUES 
('johndoe@yahoo.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 'John'),
('janedoe@gmail.com', 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef', 'Jane'),
('bobsmith@hotmail.com', 'f1e2d3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100', 'Bob');

-- Muscle Groups
INSERT INTO muscle_groups (name) VALUES 
('Chest'), ('Back'), ('Legs'), ('Biceps'), ('Triceps'), ('Shoulders');

-- Exercises
INSERT INTO exercises (name, type) VALUES
('Bench Press', 'Compound'),
('Incline Bench Press', 'Compound'),
('Deadlift', 'Compound'),
('Squat', 'Compound'),
('Barbell Curl', 'Isolation'),
('Tricep Pushdown', 'Isolation'),
('Lateral Raise', 'Isolation'),
('Pull Up', 'Compound'),
('Leg Press', 'Compound'),
('Dumbbell Fly', 'Isolation');

-- Muscle Groups & Exercises
INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES
(1, 1, 'Primary'), -- Chest: Bench Press
(1, 2, 'Primary'), -- Chest: Incline Bench Press
(3, 4, 'Primary'), -- Legs: Squat
(2, 3, 'Primary'), -- Back: Deadlift
(4, 5, 'Primary'), -- Biceps: Barbell Curl
(5, 6, 'Primary'), -- Triceps: Pushdown
(6, 7, 'Primary'), -- Shoulders: Lateral Raise
(2, 8, 'Primary'), -- Back: Pull Up
(3, 9, 'Primary'), -- Legs: Leg Press
(1, 10, 'Secondary'); -- Chest: Dumbbell Fly

-- Plans
INSERT INTO plans (user_id, name) VALUES
(1, 'Chest & Triceps'),
(1, 'Back & Biceps'),
(2, 'Leg Day'),
(3, 'Full Body Blast');

-- Plan Exercises
INSERT INTO plans_exercises (plan_id, exercise_id, exercise_name, sets) VALUES
(1, 1, NULL, 4),
(1, 2, NULL, 3),
(1, 6, NULL, 3),
(2, 3, NULL, 3),
(2, 8, NULL, 4),
(2, 5, NULL, 3),
(3, 4, NULL, 4),
(3, 9, NULL, 3),
(4, NULL, 'Custom Pushups', 3);