// import buildClient from '../api/build-client'; // Reusable API client for server and browser

// Why not use the useRequest hook?? Reason being hooks are used inside components
// and getInitialProps is not a component but a function

// We are not allowed to fetch data from inside a component during a
//  server side rendering process. It can be done only using the getInitialProps

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  /* This actually resulted in the getCurrentUser call getting executed twice 
        Hence the call for current user is removed from the component and the currentuser
        prop is passed from the App component
    */

  // const client = buildClient(context);
  // const { data } = await client.get('/api/users/currentuser');
  // return data;

  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};
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
