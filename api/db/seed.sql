-- Users
INSERT INTO users (email, password, nickname) VALUES 
('johndoe@yahoo.com', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 'John');

-- Muscle Groups
INSERT INTO muscle_groups (name) VALUES 
('Chest'), ('Back'), ('Legs'), ('Biceps'), ('Triceps'), ('Shoulders');

-- Exercises
INSERT INTO exercises (name, type) VALUES
('Squat', 'Compound'),
('Bench Press', 'Compound'),
('Deadlift', 'Compound'),
('Incline Bench Press', 'Compound'),
('Barbell Curl', 'Isolation'),
('Tricep Pushdown', 'Isolation'),
('Lateral Raise', 'Isolation'),
('Pull Up', 'Compound'),
('Leg Press', 'Compound'),
('Dumbbell Fly', 'Isolation');

-- Muscle Groups & Exercises
INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES
(2, 1, 'Primary'), -- Chest: Bench Press
(4, 2, 'Primary'), -- Chest: Incline Bench Press
(2, 4, 'Primary'), -- Legs: Squat
(3, 3, 'Primary'), -- Back: Deadlift
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
(1, 'Leg Day'),
(1, 'Full Body Blast');

-- Plan Exercises
INSERT INTO plans_exercises (plan_id, exercise_id, exercise_name, sets, position) VALUES
(1, 2, NULL, 4, 1),
(1, 4, NULL, 3, 2),
(1, 6, NULL, 3, 3),
(2, 8, NULL, 4, 1),
(2, 3, NULL, 3, 2),
(2, 5, NULL, 3, 3),
(3, 1, NULL, 4, 1),
(3, 9, NULL, 3, 2),
(4, NULL, 'Custom Pushups', 3, 1);