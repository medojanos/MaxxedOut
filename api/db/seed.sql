INSERT INTO muscle_groups (name) VALUES 
('Chest'), ('Back'), ('Legs'), ('Biceps'), ('Triceps'), ('Shoulders');

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

INSERT INTO muscle_groups_exercises (muscle_group_id, exercise_id, role) VALUES
(2, 1, 'Primary'),
(4, 2, 'Primary'),
(2, 4, 'Primary'),
(3, 3, 'Primary'),
(4, 5, 'Primary'),
(5, 6, 'Primary'),
(6, 7, 'Primary'),
(2, 8, 'Primary'),
(3, 9, 'Primary'),
(1, 10, 'Secondary');

INSERT INTO plans (user_id, name) VALUES
(1, 'Chest & Triceps'),
(1, 'Back & Biceps'),
(1, 'Leg Day'),
(1, 'Full Body Blast');

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