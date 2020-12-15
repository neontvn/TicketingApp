import 'bootstrap/dist/css/bootstrap.css';

// This component receives 2 props as mentioned
// Thin wrapper around a NextJS component named app (file)
// All global css imports can be done here instead of doing on 
// every single component. Reason being the app file gets loaded every single time
// one visits the application

const __App = ({ Component, pageProps }) => {
    return <Component {...pageProps} />
}
export default __App;

/* 

Global CSS Must Be in Your Custom <App>

Why This Error Occurred?

    - An attempt to import Global CSS from a file other than pages/_app.js was made.
    - Global CSS cannot be used in files other than your Custom <App> due to its side-effects and ordering problems.

Possible Ways to Fix It
    - Relocate all Global CSS imports to your pages/_app.js file.
    - Or, update your component to use local CSS (Component-Level CSS) via CSS Modules. This is the preferred approach.
*/
