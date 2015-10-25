insert into ui_form values ('policy_auth',1,1,'Policy Authorization');
insert into ui_form values ('supplier',2,2,'Supplier');
insert into ui_form values ('citizen',3,3,'Citizenship');
insert into ui_form values ('country',4,4,'Country');

insert into ui_form_link values (1,3);
insert into ui_form_link values (2,3);
insert into ui_form_link values (1,4);

insert into citizen values (1,1,1,'US');

insert into country values (1,'US','US');

insert into policy_auth values ('US Policy Authorization', '1-1-15', '1-1-15', 'Food and Shelter', '1-1-15', 'mike', 'jim', 1, 'US Policy');
insert into supplier values ( 1, 'Rolls Royce', '23, UK', '1-1-15', 'Pumpkin');
