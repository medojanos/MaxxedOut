CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    nickname TEXT,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL, 
    started_at DATETIME,
    ended_at DATETIME DEFAULT (DATETIME('now')),
    name TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Compound', 'Isolation'))
);

CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY NOT NULL,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER,
    exercise_name TEXT,
    rep INTEGER,
    weight INTEGER,
    FOREIGN KEY (workout_id) REFERENCES workouts(id)
    ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS muscle_groups (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS muscle_groups_exercises (
    muscle_group_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Primary', 'Secondary', 'Stabilizer')),
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id)
        ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plans_exercises (
    plan_id INTEGER NOT NULL,
    exercise_id INTEGER,
    exercise_name TEXT,
    sets INTEGER,
    FOREIGN KEY (plan_id) REFERENCES plans(id)
        ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS codes (
    code TEXT PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    expiry DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tokens (
    token TEXT PRIMARY KEY NOT NULL,
    user_id INTEGER NOT NULL,
    expiry DATETIME DEFAULT (DATETIME('now', '+7 days')),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
