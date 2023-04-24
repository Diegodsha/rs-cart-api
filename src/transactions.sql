
create table if not exists "user" (
    id uuid not null default uuid_generate_v4() primary key,
    "name" text not null,
    "password" text not null
);



create table if not exists carts (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null references "user"(id),
    created_at date not null default now(),
    updated_at date not null default now(),
    status text
);


create table if not exists product (
    id uuid not null default uuid_generate_v4() primary key,
    title text not NULL,
    description text NOT NULL,
    price integer NOT NULL
);

create table if not exists stocks (
    product_id uuid not null references product(id),
    count integer not null
);

create extension if not exists "uuid-ossp";



create table if not exists cart_items(
    cart_id uuid not null references carts(id),
    product_id uuid not null references product(id),
    count integer 
);


create table if not exists "orders" (
    id uuid not null default uuid_generate_v4() primary key,
    cart_id uuid not null references carts(id),
    user_id uuid not null references "user"(id),
    payment JSON,
    delivery JSON,
    comments text,
    status text,
    total integer
);


insert into "user" (name,password) values ('firstUser', 'TEST_PASSWORD')
insert into product (title,description, price ) values ('Vento', 'cafe racer', 1500)
insert into carts (user_id,created_at, updated_at, status ) values ('a8226ccb-162f-473b-894e-020bd9a220bc', curren_timestamp, curren_timestamp, 'OPEN')
insert into cart_items  (cart_id ,product_id, count ) values ('ee54ceb4-c834-4bcc-87db-9b9b68a34434','abcdb05c-651e-41f8-a7a2-6f754b75d80f', 4);
insert into stocks (product_id, count ) values ('abcdb05c-651e-41f8-a7a2-6f754b75d80f', 10);
insert into orders (cart_id, user_id , payment, delivery , "comments" , status, total  ) values ('ee54ceb4-c834-4bcc-87db-9b9b68a34434', 'a8226ccb-162f-473b-894e-020bd9a220bc','{"payment": {"type":"credit", "address":"5th avenue"}}','{"delivery":{"type":"free", "address":"5th avenue"}}','excellent quality', 'OPENED', 4);
