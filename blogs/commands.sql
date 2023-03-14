-- 13.2
CREATE TABLE blogs (                                            
  id SERIAL PRIMARY KEY,                                                          
  author text,                                                                    
  url text NOT NULL,                                                              
  title text NOT NULL,                                                            
  likes integer default 0                                                         
);

insert into blogs (author, url, title) values ('Lucas', 'https://www.postgresql.org/', 'PostgreSQL HomePage');
insert into blogs (author, url, title) values ('Lucas', 'https://www.mysql.com/', 'MySQL HomePage');