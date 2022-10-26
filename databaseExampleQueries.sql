--  this file will not run

CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name varchar(15) NOT NULL
);

INSERT INTO categories(category_name)
VALUES
  ('outdoor'),
  ('party'),
  ('performance' ),
  ('sport'),
  ('socialize');

  SELECT * FROM categories;


 CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username varchar(70) NOT NULL UNIQUE,
  password_hash varchar(70) NOT NULL UNIQUE,
  email varchar(90),
);


CREATE TABLE events(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  event_name varchar(30) NOT NULL,
  description varchar(200) NOT NULL,
  address varchar(100) NOT NULL,
  event_date DATE NOT NULL,
  category_id integer REFERENCES categories(id),
  user_id integer REFERENCES users (id),
  free boolean
);

  CREATE TABLE followers(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer REFERENCES users(id),
  event_id integer REFERENCES events(id)
);
