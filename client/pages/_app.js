import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

// This component receives 2 props as mentioned
// Thin wrapper around a NextJS component named app (file)
// All global css imports can be done here instead of doing on
// every single component. Reason being the app file gets loaded every single time
// one visits the application

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
        <Header currentUser = { currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

/* getInitialProps 
    
    Page Component : context === {req,res}
    Custom App Component : context === {Component, ctx : {req,res}}

*/

AppComponent.getInitialProps = async (appContext) => {
    
    const client = buildClient(appContext.ctx);    
    
    const { data } = await client.get('/api/users/currentuser');

    
    let pageProps = {};
    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    
    return {
        pageProps,
        ...data
    }
    
}

export default AppComponent;

/* 

Global CSS Must Be in Your Custom <App>

Why This Error Occurred?

    - An attempt to import Global CSS from a file other than pages/_app.js was made.
    - Global CSS cannot be used in files other than your Custom <App> due to its side-effects and ordering problems.

Possible Ways to Fix It
    - Relocate all Global CSS imports to your pages/_app.js file.
    - Or, update your component to use local CSS (Component-Level CSS) via CSS Modules. This is the preferred approach.
*/
