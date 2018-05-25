import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl } from 'react-bootstrap';


import { auth } from '../firebase';

const PasswordForgetPage = () =>
  <div className="signupForm">
    <h1>Reset Your Password</h1>
    <div>
      Don't worry! You may have forgotten your password, but we can help you out.
      Enter your username below and we'll email you a link to reset your password.
    </div>
    <br></br>
    <PasswordForgetForm />
  </div>

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email } = this.state;

    auth.doPasswordReset(email)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      email,
      error,
    } = this.state;

    const isInvalid = email === '';

    return (
        <form onSubmit={this.onSubmit} className="signInForm">

          <FormGroup controlId="email">
            <FormControl
              value={this.state.email}
              onChange={event => this.setState(byPropKey('email', event.target.value))}
              type="text"
              placeholder="Email Address"
            />
            <FormControl.Feedback />
          </FormGroup>


          <Button bsStyle="primary" disabled={isInvalid} type="submit">
            Email Me
          </Button>

          { error && <p>{error.message}</p> }
        </form>
    );
  }
}

const PasswordForgetLink = () =>
  <p>
    <Link to="/pw-forget">Forgot Password?</Link>
  </p>

export default PasswordForgetPage;

export {
  PasswordForgetForm,
  PasswordForgetLink,
};
