CREATE TABLE ui_form
(
  form_table_name varchar(100),
  order_by integer,
  id integer,
  display_name varchar(100)
);

CREATE TABLE ui_form_link
(
  ui_form_id integer,
  ui_form_link_id integer
);

CREATE TABLE policy_auth
(
  auth_type varchar(100),
  start_date date,
  end_date date,
  busi_unit_name varchar(100),
  auth_initial_release_date date,
  designated_empowered_official varchar(100),
  program_export_focal varchar(100),
  id integer NOT NULL,
  name varchar(100)
);

CREATE TABLE supplier
(
  id integer NOT NULL,
  name varchar(100),
  address varchar(100),
  denied_screening_date date,
  best_code varchar(100)
);

CREATE TABLE citizen
(
  id integer NOT NULL,
  country_id integer,
  country_grp_id integer,
  name varchar(100)
);

CREATE TABLE country
(
  id integer NOT NULL,
  country_code varchar(100) NOT NULL,
  name varchar(100) NOT NULL,
);

CREATE TABLE policy_auth_citizen_relationship
(
  policy_auth_id integer,
  citizen_id integer
);

CREATE TABLE policy_auth_country_relationship
(
  policy_auth_id integer,
  country_id integer
);

CREATE TABLE supplier_citizen_relationship
(
  supplier_id integer,
  citizen_id integer
);

CREATE TABLE supplier_country_relationship
(
  supplier_id integer,
  country_id integer
);
