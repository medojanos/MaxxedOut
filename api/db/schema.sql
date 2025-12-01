CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    nickname TEXT,
    password TEXT NOT NULL
);

CREATE TABLE workouts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    date DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE exercises (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Compound', 'Isolation'))
);

CREATE TABLE sets (
    id INTEGER PRIMARY KEY,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    rep INTEGER,
    weight INTEGER,
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
    ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    ON DELETE CASCADE
);

CREATE TABLE muscle_groups (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE muscle_groups_exercises (
    muscle_group_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Primary', 'Secondary', 'Stabilizer')),
    PRIMARY KEY (muscle_group_id, exercise_id),
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id)
    ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    ON DELETE CASCADE
);

CREATE TABLE plans (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE plans_exercises (
    plan_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    PRIMARY KEY (plan_id, exercise_id),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
    ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    ON DELETE CASCADE
);

CREATE TABLE codes (
    code TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expiry DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE tokens (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expiry DATETIME DEFAULT (DATETIME('now', '+7 days')),
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);