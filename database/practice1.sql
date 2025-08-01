-- Type: account_type

-- DROP TYPE IF EXISTS public.account_type;

CREATE TYPE public.practice AS ENUM
    ('1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars');

ALTER TYPE public.practice
    OWNER TO cse340;

CREATE TABLE IF NOT EXISTS public.practice1(
    sqlpractice_id INT GENERATED BY DEFAULT AS IDENTITY,
    first_name CHARACTER VARYING NOT NULL,
    last_name CHARACTER VARYING NOT NULL,
    age INT NOT NULL,
    review CHARACTER VARYING,
    rating practice NOT NULL DEFAULT '3 Stars'::practice
);

INSERT INTO public.practice1 (first_name, last_name, age, review)
VALUES(
    'Bryan',
    'Chigbu',
    21,
    'I love it!!'
),
(
    'Victory',
    'Godson',
    20,
    'Best product I have bought.'
);

-- Second Insert
INSERT INTO public.practice1 (first_name, last_name, age, review, rating)
VALUES(
    'Beckham',
    'Obiudo',
    18,
    'Latom🙏',
    '5 Stars'
),
(
    'Secretariat',
    'Njoku',
    19,
    'Hate it, The Chelsea was tasteless😠',
    '1 Star'
);