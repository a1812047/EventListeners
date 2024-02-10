CREATE TABLE users(
    first_name VARCHAR(63),
    last_name VARCHAR(63),
    emailID VARCHAR(63),
    password varchar(63),
    username varchar(63),
    verified BOOLEAN,/*GOogle users*/
    timestamp timestamp Not NULL,
    PRIMARY KEY (username)
);

CREATE TABLE events(
    eventID SMALLINT UNSIGNED AUTO_INCREMENT,
    username VARCHAR(63),
    title VARCHAR(100),
    Description_ TEXT,
    is_it_Online VARCHAR(10),
    private_or_public VARCHAR(10),
    type_of_event VARCHAR(20),
    Expected_humans INT UNSIGNED,
    time_of_creation TIMESTAMP,
    PRIMARY KEY (eventID) 
);

CREATE TABLE locations( 
    eventID  SMALLINT UNSIGNED,
    address1 VARCHAR(255),
    city VARCHAR(63),
    state_ VARCHAR(30),
    country VARCHAR(30),
    postal_code SMALLINT UNSIGNED,
    FOREIGN KEY (eventID) REFERENCES events(eventID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE eventTime(   
    eventID SMALLINT UNSIGNED,
    date_ VARCHAR(20),
    start_time VARCHAR(10),
    end_time VARCHAR(10),
    FOREIGN KEY (eventID) REFERENCES events(eventID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE images(
    eventID SMALLINT UNSIGNED,
    image_ VARCHAR(3000) DEFAULT 'http://localhost:3000/uploads/image.png'
);

CREATE TABLE available(
    emailID VARCHAR(63),
    eventID SMALLINT UNSIGNED,
   FOREIGN KEY (eventID) REFERENCES events(eventID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE invite
    (emailID VARCHAR(63),
    eventID SMALLINT UNSIGNED,
    
    FOREIGN KEY (eventID) REFERENCES events(eventID) ON UPDATE CASCADE ON DELETE CASCADE)
;

