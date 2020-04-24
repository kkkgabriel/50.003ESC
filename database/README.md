this project was done with google's cloudSQL and deployed in google's app engine.
[Cloud SQL Quickstart](https://cloud.google.com/sql/docs/mysql/quickstart#connect)

## accessing google cloud console
1. initiate your Cloud Shell in project neobow. else, set your project in the Cloud Shell with the cmd:
` gcloud config set project [PROJECT_ID] `
2. connect to your instance using the mysql client in Cloud Shell. This will take some time as they whitelist IP, be patient.
`gcloud sql connect [INSTANCE_ID] --user=root`
3. enter your root password and see mysql prompt.

## accessing database 
1. enter database:
`use [DATABASE_NAME];`
2. retrieve data from sql queries:
`SELECT * from techentries`

## deployment of cloudSQL onto app engine
1. to deploy, in the same folder where app.yaml file is located issue cmd:
`gcloud app deploy`
2. to view service in web browser:
`gcloud app browse`

## permissions to allow group members to also work on the same cloudSQL instance
in project instance IAM & admin, add new members with role set to `Owner` to grant full access to the project to other members.

## structure of database
table for agents:
+---------------+--------------+----------------+--------------------------+---------------------------+---------------+--------+----------+
| technamefirst | technamelast | techpw         | rainbowid                | email                     | status        | techid | loggedin |
+---------------+--------------+----------------+--------------------------+---------------------------+---------------+--------+----------+
table for users:
+---------------+--------------+----------------+--------------------------+------------------+---------------+--------+
| usernamefirst | usernamelast | userpw         | rainbowid                | email            | rainbowstatus | userid |
+---------------+--------------+----------------+--------------------------+------------------+---------------+--------+
