import React from 'react';
import { Link } from 'react-router-dom';
import {Nav, Navbar, NavItem} from 'react-bootstrap'

import AuthUserContext from './AuthUserContext';
import * as routes from '../constants/routes';
import SignOutButton from './SignOut';

import {auth} from '../firebase';

import logo from './images/pc_logo.png';


var icon = (
    <span class="logo">
      <a href="/">
        <img src="/images/pc_logo.png" class="img-responsive center-block" alt="postcards logo" /></a>
    </span>
  );

const Navigation = () =>
  <AuthUserContext.Consumer>
    {authUser => authUser
      ? <NavigationAuth />
      : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>

  //Navbar for when the user is succesfully logged in
  const NavigationAuth = () =>

  <Navbar  collapse>
      <Navbar.Header>
      <a href="/">
        <Navbar.Brand>
          <img src={logo} alt="logo" class="img-responsive center-block"/>
        </Navbar.Brand>
      </a>
      </Navbar.Header>
      <Nav pullRight>


      <li class="sign-out" onClick={auth.doSignOut}>Sign Out</li>

        <li><Link to={routes.GROUP}>Groups</Link></li>
        <li><Link to={routes.ACCOUNT}>Account</Link></li>

      </Nav>
    </Navbar>

//Navbar for users that are not logged in
const NavigationNonAuth = () =>

  <Navbar>
    <Navbar.Header>
      <a href="/">
        <Navbar.Brand>
          <img src={logo} alt="logo" class="img-responsive center-block"/>
        </Navbar.Brand>
      </a>


    </Navbar.Header>
    <Nav pullRight>
      <li><Link to={routes.LANDING}>Landing</Link></li>
      <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
    </Nav>
  </Navbar>

export default Navigation;
