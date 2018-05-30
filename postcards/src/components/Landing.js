import React from 'react';
import { Button, FormGroup, FormControl } from 'react-bootstrap';

import logo from './images/pc_logo.png';
import * as routes from '../constants/routes';

const LandingPage = () =>
  <div className="welcome-content">
    <img src={logo} width="20%"/>
    <h1>Welcome to Postcards!</h1>
    <h4>A zero-clutter social media site that closes the generation gap.</h4>
    <br></br>
    <p>Start sharing now by signing in or clicking the groups tab above.</p>
    <Button href={routes.SIGN_IN} bsStyle="primary">Get Started!</Button>
  </div>

export default LandingPage;
