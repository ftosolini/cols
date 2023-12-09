-- init.sql

-- Create the 'test' database if it doesn't exist
CREATE DATABASE IF NOT EXISTS test;

-- Use the 'test' database
USE test;

-- Create a user 'user' with a password
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'your_password';

-- Grant privileges to the user on the 'test' database
GRANT ALL PRIVILEGES ON test.* TO 'user'@'%';

-- Flush privileges to apply the changes
FLUSH PRIVILEGES;
