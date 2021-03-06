import React from 'react';
import { NavLink } from 'react-router-dom';

const SignedOut = () => {
  return (
    <div>
      <ul className="right">
        <li>
          <NavLink to="/">Signup</NavLink>
        </li>
        <li>
          <NavLink to="/">Log In</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default SignedOut;
