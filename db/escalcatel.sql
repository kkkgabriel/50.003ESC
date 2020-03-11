
/**************************************************/
/*switch into database logins*/
use logins;
/*create database tables in CloudSQL*/

CREATE TABLE entries ( usernamefirst VARCHAR(255), usernamelast VARCHAR(255),  userpw VARCHAR(255), rainbowid VARCHAR(255),  email VARCHAR(255), rainbowstatus VARCHAR(255), userid INT NOT NULL AUTO_INCREMENT,  PRIMARY KEY(userid));
    INSERT INTO entries (usernamefirst , usernamelast, userpw, rainbowid, email, rainbowstatus) values  ( "user","one","Longpassword!1","5e600bbad8084c29e64eb499","user1@singco.com", "available ");
    INSERT INTO entries (usernamefirst , usernamelast, userpw, rainbowid, email, rainbowstatus) values  ( "user","two","Longpassword!1","5e600bf2d8084c29e64eb4ab","user2@singco.com", "available ");
    INSERT INTO entries (usernamefirst , usernamelast, userpw, rainbowid, email, rainbowstatus) values  ( "user","three","Longpassword!1","5e600c12d8084c29e64eb4b4","user3@singco.com", "available ");
    INSERT INTO entries (usernamefirst , usernamelast, userpw, rainbowid, email, rainbowstatus) values  ( "user","four","Longpassword!1","5e600c2fd8084c29e64eb4bd","user4@singco.com", "available ");
    INSERT INTO entries (usernamefirst , usernamelast, userpw, rainbowid, email, rainbowstatus) values  ( "user","five","Longpassword!1","5e600c48d8084c29e64eb4c6","user5@singco.com", "not available ");
    INSERT INTO entries (usernamefirst , usernamelast, userpw, rainbowid, email, rainbowstatus) values  ( "user","six","Longpassword!1","5e600c5fd8084c29e64eb4cf","user6@singco.com", "not available ");
    INSERT INTO entries (usernamefirst , usernamelast, userpw, rainbowid, email, rainbowstatus) values  ( "user","seven","Longpassword!1","5e600c79d8084c29e64eb4d8","user7@singco.com", "not available ");
    INSERT INTO entries (usernamefirst , usernamelast, userpw, rainbowid, email, rainbowstatus) values  ( "user","eight","Longpassword!1","5e600c91d8084c29e64eb4e1","user8@singco.com", "not available ");
    
-- CREATE TABLE chat (msg VARCHAR(255), userid INT, techid INT,msgid INT NOT NULL AUTO_INCREMENT,  PRIMARY KEY(msgid));
--     INSERT INTO chat (msg, userid , techid ) values ("my broadband does not work:(",1,2);
--     INSERT INTO chat (msg, userid , techid ) values ("my cat ate my keyboard mouse",3,1);

CREATE TABLE techentries (technamefirst VARCHAR(255), technamelast VARCHAR(255),  techpw VARCHAR(255), rainbowid VARCHAR(255), email VARCHAR(255),status VARCHAR(255),techid INT NOT NULL AUTO_INCREMENT,  PRIMARY KEY(techid)) ;
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Accounts","Nbills","Longpassword!1","5e6009cad8084c29e64eb43f","AccountsNBills@gmail.com","available");
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Mobile","PostPaid","Longpassword!1","5e600991d8084c29e64eb436","MobilePostpaid@gmail.com","available");
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Mobile","Prepaid","Longpassword!1","5e6009e2d8084c29e64eb448","MobilePrepaid@gmail.com","available");
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Broad","Band","Longpassword!1","5e6009fed8084c29e64eb45a","Broadband@gmail.com","available");
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Tee","Vee","Longpassword!1","5e600a10d8084c29e64eb463","TV@gmail.com","available");
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Home","Line","Longpassword!1","5e600a2ad8084c29e64eb46c","HomeLine@gmail.com","available");
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Online","Purchase","Longpassword!1","5e600a42d8084c29e64eb475","OnlinePurchase@gmail.com","available");
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Life","Style","Longpassword!1","5e600a59d8084c29e64eb47e","Lifestyle@gmail.com","available");
    INSERT INTO techentries (technamefirst , technamelast, techpw, rainbowid, email, status ) values ("Lies","Style","Longpassword!1","5e900a59d8084c29e64eb47e","Cake@gmail.com","available");

CREATE TABLE adminentries (adminname VARCHAR(255), adminid INT NOT NULL AUTO_INCREMENT,  PRIMARY KEY(adminid),adminpw VARCHAR(255));
    INSERT INTO adminentries (adminname , adminpw ) values ("admin","adminpw");
    INSERT INTO adminentries (adminname , adminpw ) values ("hodor","holddoor");

CREATE TABLE techagententries (techid INT, tagid INT);
    INSERT INTO techagententries (techid , tagid ) values (1, 1);
    INSERT INTO techagententries (techid , tagid ) values (2, 2);
    INSERT INTO techagententries (techid , tagid ) values (3, 3);
    INSERT INTO techagententries (techid , tagid ) values (4, 4);
    INSERT INTO techagententries (techid , tagid ) values (5, 5);
    INSERT INTO techagententries (techid , tagid ) values (6, 6);
    INSERT INTO techagententries (techid , tagid ) values (7, 7);
    INSERT INTO techagententries (techid , tagid ) values (8, 8);
    INSERT INTO techagententries (techid , tagid ) values (9, 8);

CREATE TABLE tagentries ( tagname VARCHAR(255), tagid INT NOT NULL AUTO_INCREMENT,  PRIMARY KEY(tagid));
    INSERT INTO tagentries (tagname ) values ("AccountsNBills");
    INSERT INTO tagentries (tagname ) values ("MobilePostpaid");
    INSERT INTO tagentries (tagname ) values ("MobilePrepaid");
    INSERT INTO tagentries (tagname ) values ("Broadband");
    INSERT INTO tagentries (tagname ) values ("TV");
    INSERT INTO tagentries (tagname ) values ("HomeLine");
    INSERT INTO tagentries (tagname ) values ("OnlinePurchase");
    INSERT INTO tagentries (tagname ) values ("Lifestyle");

/**************************************************/
/* test files in cloudsql database console*/
/*Functions used for retrieving useful information for app*/
/*Inner join: selects records that have matching values in both tables.*/
-- /*selects msg and chat based on userid*/
-- SELECT msg, techid 
-- FROM chat
-- INNER JOIN entries
-- ON chat.userid = entries.userid
-- WHERE entries.userid = 1;

-- /*selects tech agent for routing based on tags*/
-- SELECT techid, techname
-- FROM techentries
-- WHERE techentries.tags = 'finance' and techentries.status = 'available';

/*For agent to verify credentials to log in, as well as change agent.logged in to true*/
SELECT email FROM techentries;
SELECT techpw FROM techentries WHERE email="Cake@gmail.com";
/* check if inp matches techpw, if yes, account is verified*/
UPDATE techentries SET status="not available" WHERE email = "Cake@gmail.com";

/*For users to get available Tech ID with tag*/
SELECT email from techentries INNER JOIN techagententries ON techentries.techid = techagententries.techid INNER JOIN tagentries ON techagententries.tagid = tagentries.tagid  WHERE tagentries.tagname="Lifestyle";

/*For users to get a username and password for an available guest account*/
SELECT email, userpw FROM entries WHERE entries.rainbowstatus ="available";
/* return the first email and select the first email for entries*/
UPDATE entries SET rainbowstatus="not available" WHERE email ="user1@singco.com";

/*For users to log out of guest account after call has ended*/
UPDATE entries SET rainbowstatus="available" WHERE email ="user1@singco.com";
/*For users to get a different available agent of the a particular tag*/
SELECT email from techentries INNER JOIN techagententries ON techentries.techid = techagententries.techid INNER JOIN tagentries ON techagententries.tagid = tagentries.tagid  WHERE tagentries.tagname="Lifestyle" and not techentries.email="Cake@gmail.com"  ;
/*For users to get another agent with a new tag*/
SELECT email from techentries INNER JOIN techagententries ON techentries.techid = techagententries.techid INNER JOIN tagentries ON techagententries.tagid = tagentries.tagid  WHERE tagentries.tagname="Lifestyle";
/*For agent to update their available var*/
UPDATE techentries SET status="available" WHERE email = "Cake@gmail.com";