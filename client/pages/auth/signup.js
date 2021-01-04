import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (e) => {
    e.preventDefault();    
    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <div >
      <h1>Sign Up</h1>
      <div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Id"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder ="Password"
          />
        </div>
      </div>
      {errors}
      <button className="btn btn-primary">SignUp</button>
      </div>
    </form>
  );
};
export default SignUp;