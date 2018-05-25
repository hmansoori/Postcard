import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SignUpLink } from './SignUp';
import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { PasswordForgetLink } from './PasswordForget';

import { Button, FormGroup, FormControl } from 'react-bootstrap';


const SignInPage = ({ history }) =>
  <div className="signupForm" style={{backgroundColor: 'rgb(229, 242, 255)'}}>
    <h1 style={{marginBottom: '3rem'}}>Sign In</h1>
    <SignInForm history={history} />
    <PasswordForgetLink />
    <SignUpLink />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      email,
      password,
    } = this.state;

    const {
      history,
    } = this.props;

    auth.doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        history.push(routes.GROUP);
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        console.log(error);
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      password,
      error,
    } = this.state;

    const isInvalid =
      password === '' ||
      email === '';

    return (
        <form class="signInForm" onSubmit={this.onSubmit}>
          <FormGroup controlId="email">
            <FormControl
              value={email}
              onChange={event => this.setState(byPropKey('email', event.target.value))}
              type="text"
              placeholder="Email Address"
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="password">
            <FormControl
              value={password}
              onChange={event => this.setState(byPropKey('password', event.target.value))}
              type="password"
              placeholder="Password"
            />
            <FormControl.Feedback />
          </FormGroup>
          <Button bsStyle="primary" disabled={isInvalid} type="submit">
            Sign In!
          </Button>
        </form>
    );
  }
}

export default withRouter(SignInPage);

export {
  SignInForm,
};

/*
import { Button, FormGroup, FormControl } from 'react-bootstrap';


<div class="signupForm">
  <form>
    <FormGroup controlId="email">
      <FormControl
        value={email}
        onChange={event => this.setState(byPropKey('email', event.target.value))}
        type="text"
        placeholder="Email Address"
      />
      <FormControl.Feedback />
    </FormGroup>
    <FormGroup controlId="password">
      <FormControl
        value={password}
        onChange={event => this.setState(byPropKey('password', event.target.value))}
        type="password"
        placeholder="Password"
      />
      <FormControl.Feedback />
    </FormGroup>
    <Button bsStyle="primary" disabled={isInvalid} type="submit">
      Sign In!
    </Button>
  </form>
</div>
*/
