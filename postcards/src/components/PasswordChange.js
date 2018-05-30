import React, { Component } from 'react';
import { Button, FormGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { auth } from '../firebase';

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { passwordOne } = this.state;

    auth.doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState(() => ({ ...INITIAL_STATE }));
        toast.success('You have successfully changed your password.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        });
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });

    event.preventDefault();
  }

  render() {
    const {
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '';

    return (
      <form onSubmit={this.onSubmit}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <FormGroup controlId="passwordOne">
          <FormControl
            value={passwordOne}
            onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
            type="password"
            placeholder="New Password"
          />
          <FormControl.Feedback />
        </FormGroup>
        <FormGroup controlId="passwordTwo">
          <FormControl
            value={passwordTwo}
            onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
            type="password"
            placeholder="Confirm New Password"
          />
          <FormControl.Feedback />
        </FormGroup>


        <Button bsStyle="primary" disabled={isInvalid} type="submit">
          Save Changes
        </Button>

        { error && <p style={{marginTop: '10px'}}>{error.message}</p> }
      </form>
    );
  }
}

export default PasswordChangeForm;
