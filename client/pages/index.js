import axios from 'axios'; // Why not use the useRequest hook?? Reason being hooks are used inside components
                           // and getInitialProps is not a component but a function

// We are not allowed to fetch data from inside a component during a 
//  server side rendering process. It can be done only using the getInitialProps

const LandingPage =  ({ currentUser }) => {
    console.log(currentUser);    
    return <h1>Landing page</h1>
}

LandingPage.getInitialProps = async () => {
    
    // Decide the domain to make request to
    if(typeof window === "undefined"){
        // On the server
        console.log("trying hard")
        const { data } = await axios.get(
            "http://ingress-nginx-controller.kube-system.svc.cluster.local/api/users/currentuser",
            {
                headers : {
                    Host : "ticketing.dev"
                }
            }
        );
        return data;
        
    } else {
        // On the browser
        const { data } = await axios.get("/api/users/currentuser");
        return data;
        
    }

    
}
export default LandingPage;

/*

Server side rendering is done using getInitialProps during the initial request for the
component. And we can return any data which can be utilised as show in the below example

const LandingPage = ({color}) => {
    console.log("component",color);
    return <h1>Landing page</h1>
}

LandingPage.getInitialProps = () => {
    console.log("server")
    return {color : "red"}
}

export default LandingPage;
________________________________________________________________________________________

NOTE :

getInitialProps is called on the server side for the following scenarios :
    1. Hard refresh on the page
    2. Clicking link from different domain
    3. Typing URL into address bar

But it is also possible that getInitialProps gets called inside the browser : 
    1. This happens when navigating from one page to another while in the app

________________________________________________________________________________________
*/


/*
Making an axios request inside the getInitialProps function results in an error
but doesnt give an error when done from the browser ie in the component LandingPage

Why this error ?

The request made on server was done in a container in k8s that has its own localhost and 
not of our system. In case of the request in browser, it actually took place to 127.0.0.1:80/api/users/currentuser
here the localhost is confined to the local system hence the request went ahead successfully but not the
same for a request made inside a k8s container

Option 1 : 
Mention the service name of the auth service to make this kind of request. But the downside of this
is that we expose out the name of our services and which route corresponds to which service

Option 2 : 
Client service reaches out to the ingress-nginx. It figures out the path for it through the rules.
BUt we dont knwo the domain to reach out : http://?????/api/users/curentuser

Cross namespace service communication

In minikube the ingress addon is installed in the namespace kube-system instead of ingress-nginx

https://stackoverflow.com/questions/62162209/ingress-nginx-errors-connection-refused



*/