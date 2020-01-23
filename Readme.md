<h1>Installation</h1>

<h2>Requirements</h2>
<ul>
	<li>Docker up and running</li>
</ul>

<h2> Starting the app </h2>

Run `$ docker-compose up` at the root of the project.


<h2>Setting routes and services</h2>

The file frontend/src/Actions.apiClient.js contains the basic route and port for the backend server. Change that accordingly to meet your needs.

The file backend/config.py contains all the backend routes (mongo url, secret, etc), which you will also have to change

Open the mongo shell by typing mongo
Build an index on the collection blacklist by typing db.blacklist.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 86400 } )
Mongo deletes blacklisted tokens automatically after a week, in order to keep the collection small. However, for it to do so, it needs the collection to be indexed.

mv backend/config-example.py backend/config.py
Change mongo uri to match your preferences
