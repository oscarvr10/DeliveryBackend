DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

INSERT INTO roles(
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'CLIENTE',
	'client/products/list',
	'2021-08-25',
	'2021-08-25'
);

INSERT INTO roles(
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'RESTAURANTE',
	'restaurant/orders/list',
	'2021-08-25',
	'2021-08-25'
);

INSERT INTO roles(
	name,
	route,
	created_at,
	updated_at
)
VALUES(
	'REPARTIDOR',
	'delivery/orders/list',
	'2021-08-25',
	'2021-08-25'
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(50) NOT NULL UNIQUE,
	name VARCHAR(50) NOT NULL,
	lastname VARCHAR(50) NOT NULL,
	phone VARCHAR(12) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	salt VARCHAR(255) NOT NULL,
	image VARCHAR(255) NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS user_has_roles CASCADE;
CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_role BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_role) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY(id_user, id_role)
);