CREATE TABLE userPassword (
    id serial NOT NULL PRIMARY KEY,
    user_name text NOT NULL UNIQUE,
    password text NOT NULL);