--
-- File generated with SQLiteStudio v3.4.15 on Thu Jan 30 22:32:42 2025
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: tasks
CREATE TABLE tasks (
    id          INTEGER PRIMARY KEY AUTOINCREMENT
                        NOT NULL,
    title       TEXT    NOT NULL,
    description TEXT    NOT NULL,
    due_date    TEXT    NOT NULL,
    user_id     INTEGER REFERENCES users (id) 
                        NOT NULL
);


-- Table: users
CREATE TABLE users (
    id               INTEGER PRIMARY KEY AUTOINCREMENT
                             NOT NULL,
    name             TEXT    UNIQUE
                             NOT NULL,
    passwordHashSalt TEXT    NOT NULL,
    passwordHash     TEXT    NOT NULL
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
