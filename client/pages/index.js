import axios from 'axios'; // Why not use the useRequest hook?? Reason being hooks are used inside components
                           // and getInitialProps is not a component but a function

// We are not allowed to fetch data from inside a component during a 
//  server side rendering process. It can be done only using the getInitialProps

const LandingPage =  ({ currentUser }) => {
    console.log(currentUser)
    return <h1>Landing page</h1>
}

// LandingPage.getInitialProps = async () => {
//     const response = await axios.get('/api/users/currentuser');
//     return response.data;
// }

/*

Server side rendering is done using getInitialProps durring the initial request for the
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

*/


/*
Making an axios request inside the getInitialProps function results in an error
but doesnt give an error when done from the browser ie in the component LandingPage

Why this error ?

The request made on server was done in a container in k8s that has its own localhost and 
not of our system. In case of the request in browser, it actually took place to 127.0.0.1:80/api/users/currentuser
here the localhost is confined to the local system hence the request went ahead successfully but not the
same for a request made inside a k8s container

*/