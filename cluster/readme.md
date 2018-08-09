# Nodejs Clustering

A single instance of Node.js runs in a single thread. To take advantage of multi-core systems, the user will sometimes want to launch a cluster of Node.js processes to handle the load.

The cluster module is a NodeJS module that contains a set of functions and properties that help us forking processes to take advantage of multi-core systems. 

It is propably the first level of scalability you must take care in your node application, specifally if you are working in a HTTP server application

With the cluster module a parent/master process can be forked in any number of child/worker processes and communicate with them sending messages via IPC communication.

It is important to keep in mind that spawned Node.js child processes are independent of the parent with exception of the IPC communication channel that is established between the two. Each process has its own memory, with their own V8 instances. Because of the additional resource allocations required, spawning a large number of child Node.js processes is not recommended.