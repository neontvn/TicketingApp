# Ticketing App

The Ticketing App is an E-Commerce Web app using Microservices built with Node, React, Docker and Kubernetes. This app currently works on localhost only and is yet to be deployed to the cloud.

To run this application download the project folder and in the project root directory run 
skaffold dev. 

Note : Before running the above command please ensure that you have Minikube, Kubectl, Docker, Skaffold installed on your computer.



# Tech Stack 

This is a **Full Stack Application** in which a variety of technologies have been used. 

On the frontend, I've used [React](https://reactjs.org/) and [Next JS](https://nextjs.org/) to present content to users. Each service is created using [Node](https://nodejs.org/en/) and [Express](https://expressjs.com/). Data for each service is held in either a [Mongo](https://www.mongodb.com/) database or [Redis](https://redis.io/). The entire app is deployed and runs in [Docker](https://www.docker.com/) containers executed in a [Kubernetes](https://kubernetes.io/) cluster. Also, almost all of the code in this project is written with [Typescript](https://www.typescriptlang.org/).

# Key Learning

1. Architect large, scalable apps using a collection of microservices
2. Solve concurrency issues in a distributed systems environment
3. Build a Server-Side Rendered React App to render data from your microservices
4. Share reusable code between multiple Express servers using custom NPM packages
5. Write comprehensive tests to ensure each service works as designed




