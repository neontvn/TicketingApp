import axios from 'axios';

// A custom implmentation of axios which returns the instance of newly created axios
const buildClient = ({ req }) => {

    // Decide the domain to make request to
    if( typeof window === "undefined" ){
        //On server

        return axios.create({
            baseURL : "http://ingress-nginx-controller.kube-system.svc.cluster.local/",
            headers : req.headers
        });
    }else{
        //On browser
        return axios.create({
            baseURL : "/"
        })
    }
}

export default buildClient;