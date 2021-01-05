# Ticketing App

The Ticketing App is an E-Commerce Web app using Microservices built with Node, React, Docker and Kubernetes. This app currently works on localhost only and is yet to be deployed to the cloud.


# Tech Stack 

This is a **Full Stack Application** in which a variety of technologies have been used. 

On the frontend, I've used [React](https://reactjs.org/) and [Next JS](https://nextjs.org/) to present content to users. Each service is created using [Node](https://nodejs.org/en/) and [Express](https://expressjs.com/). Data for each service is held in either a [Mongo](https://www.mongodb.com/) database or [Redis](https://redis.io/). The entire app is deployed and runs in [Docker](https://www.docker.com/) containers executed in a [Kubernetes](https://kubernetes.io/) cluster. Also, almost all of the code in this project is written with [Typescript](https://www.typescriptlang.org/).

# Key Learning

1. Architect large, scalable apps using a collection of microservices
2. Solved concurrency issues in a distributed systems environment
3. Built a Server-Side Rendered React App to render data from your microservices
4. Shared reusable code between multiple Express servers using custom NPM packages
5. Written comprehensive tests to ensure each service works as designed


## 

To run this application download the project folder and in the project root directory :  <br> 

Note : Before running the following commands please ensure that you have [Minikube](https://minikube.sigs.k8s.io/docs/start/), [Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/), [Docker](https://docs.docker.com/engine/install/), [Skaffold](https://skaffold.dev/docs/install/) installed on your computer for the particular operating system.

## Run Minikube

```
minikube start
```
Enable ingress 

```
minikube addons enable ingress
```

Also add the minikube ip and hostname to /etc/hosts

```
$ sudo vi /etc/hosts

// minikube ip  host
192.168.49.2    ticketing.dev
```
##

Create docker image of each and every service and push the image to your docker repository.

```
$ docker build -t your_docker_username/ service_name .

For eg. 
$ docker build -t username/auth .

$ docker push username/auth:latest // Push the image to docker hub
```
**Note** : Need to update my docker image name to yours in scripts from skaffold and k8s folders.
##

Next create k8s secrets that allow you to store and manage sensitive information

```
$ kubectl create secret generic jwt-secret --from-literal=JWT_KEY=asdf

// <STRIPE_SECRET_KEY> from stripe.com 
$ kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<STRIPE_SECRET_KEY>
```
Learn [here](https://stripe.com/docs/keys) on how to get your secret key & publisher key from stripe.com

##

Run the skaffold ( used for local k8s development). Skaffold watches the project source for changes and automatically builds, tags, deploys out application with the following command : 

```
skaffold dev
```

To check if the pods have started successfully enter the following command : 

```
$ kubectl get pods
NAME                                           READY   STATUS    RESTARTS   AGE
auth-deployment-57d779fd9-48s9v                1/1     Running   0          24s
auth-mongo-deployment-579c6dbd8f-69jbv         1/1     Running   0          23s
client-deployment-f5cfc5b8d-k2lxp              1/1     Running   0          23s
expiration-deployment-6bb67856b4-jkkbl         1/1     Running   0          23s
expiration-redis-deployment-5b58b869fd-hmq5f   1/1     Running   0          23s
nats-deployment-76479997ff-lpss8               1/1     Running   0          23s
orders-deployment-5c68dff5c9-dq6hl             1/1     Running   0          23s
orders-mongo-deployment-6896c8b9-42vpd         1/1     Running   0          23s
payments-deployment-68d4c7f4ff-nfsxb           1/1     Running   0          23s
payments-mongo-deployment-c89cb4fc7-4ggn7      1/1     Running   0          23s
tickets-deployment-7b746fff9-tvhzw             1/1     Running   0          23s
tickets-mongo-deployment-54f456bd95-hv9fb      1/1     Running   0          22s
```
##

Visit https://ticketing.dev in the browser.

type: thisisunsafe in the browser window with security warning.



