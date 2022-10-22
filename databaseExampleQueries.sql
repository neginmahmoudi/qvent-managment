--  this file will not run

CREATE TABLE events(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name varchar(30) NOT NULL,
  description varchar(100) NOT NULL,
  address varchar(100) NOT NULL,
  event_date DATE NOT NULL,
  category_id INT NOT NULL,
  user_id INT NOT NULL
);

INSERT INTO events(first_name,description,address,event_date,category_id,user_id)
VALUES
  ('charlotte', 'open air concert of the band frau Sommer','Mariahilf','29,11,2022',3,1 ),
  ('nina', 'art performance','oper','05,01,2023',1,2 ),
  ('mattias', 'queer yoga','stadt park','08,11,2022',2,3 );

  SELECT * FROM events;


CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name varchar(30) NOT NULL
);
INSERT INTO categories(first_name)
VALUES
  ('outdoor'),
  ('party'),
  ('performance' ),
  ('sport');

  SELECT * FROM categories;

  CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name varchar(30) NOT NULL,
  password varchar(100) NOT NULL,
  email varchar(100) NOT NULL
);

INSERT INTO users(first_name,password,email)
VALUES
  ('nina','123nina','aa@gmail.com'),
  ('charlotte','345louti','bbb@gmail.com'),
  ('mattias','567matti','nnn@yahoo.com');

  SELECT * FROM users;



  CREATE TABLE followers(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id INT NOT NULL,
  event_id INT NOT NULL
);

INSERT INTO followers(user_id,event_id)
VALUES
  (1,2),
  (2,1),
  (3,4);

  SELECT * FROM followers;
