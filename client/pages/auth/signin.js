import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from 'next/router'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
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
      <h1>Sign In</h1>
      <div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      {errors}
      <button className="btn btn-primary">SignIn</button>
    </form>
  );
};
export default SignUp;