INSERT INTO users (email, password) VALUES ('johndoe@yahoo.com', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db');
INSERT INTO plans (user_id, name) VALUES (1, 'Chest Day 1');
INSERT INTO exercises (name, type) VALUES ('Bench Press', 'Compound');
INSERT INTO plans_exercises (plan_id, exercise_id, sets) VALUES (1, 1, 3);
INSERT INTO plans_exercises (plan_id, exercise_name, sets) VALUES (1, 'Custom Fly', 2)