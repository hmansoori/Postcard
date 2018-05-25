import React, { Component } from 'react';
import {
  Link,
  withRouter,
} from 'react-router-dom';
import { auth, db } from '../firebase';
import * as routes from '../constants/routes';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import firebase from 'firebase';



const SignUpPage = ({ history }) =>
  <div className="signupForm">
    <h1>Sign Up</h1>
    <SignUpForm history={history} />
  </div>

const INITIAL_STATE = {

  username: "",
  email: "",
  password: "",
  passwordCheck: "",
  image: "",
  usernameFilled: false,
  emailFilled: false,
  passwordFilled: false,
  imageFilled: false
};

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});


class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    this.handleValidPassword = this.handleValidPassword.bind(this);
    this.handlePasswordMatch = this.handlePasswordMatch.bind(this);
    this.handleValidEmail = this.handleValidEmail.bind(this);

  }

  handleChange(event) {
    this.setState({ username: "event.target.value" });
  }

  handleValidPassword(event) {
    var input = event.target.value;
    this.setState({ password: input });
    if (input.length < 5) {
      this.setState({ validPassword: "error" });
    } else {
      this.setState({ validPassword: "success" });
      this.setState(byPropKey('password', input));
    }
  }

  handlePasswordMatch(event) {
    var input = event.target.value;
    this.setState({ passwordCheck: input });
    if (input !== this.state.password) {
      this.setState({ validMatch: "error" });
    } else {
      this.setState({ validMatch: "success" });
      this.setState(byPropKey('passwordCheck', event.target.value));
    }

  }

  handleValidEmail(event) {
    var input = event.target.value;
    this.setState({ email: input });
    var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(input);
    if (!valid) {
      this.setState({ validEmail: "error" });
    } else {
      this.setState({ validEmail: "success" });
      this.setState(byPropKey('email', event.target.value));
    }
  }

  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }

  _handleSubmitImage(newUser, email, username) {
    // e.preventDefault();
    // TODO: do something with -> this.state.file
    const {
      history,
    } = this.props;
    var storageRef = firebase.storage().ref('/avatars').child(this.state.file.name);
    var uploadTask = storageRef.put(this.state.file);
    uploadTask.on('state_changed', function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function (error) {
      // Handle unsuccessful uploads
      console.log(error);
    }, function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = uploadTask.snapshot.downloadURL;
      db.doCreateUser(newUser.uid, username, email, downloadURL)
          .then(() => {
            console.log('kept going');
            //this.setState(() => ({ ...INITIAL_STATE }));
            history.push(routes.GROUP);

          })
          .catch(error => {
            //this.setState(byPropKey('error', error));
            console.log('here');
          });

    });
    this.setState({ file: '', imagePreviewUrl: '' })
  }

  handleClick(button) {
    if (button == 'usernameFilled') {
      this.setState(byPropKey => ({
        'usernameFilled': !this.state.usernameFilled,
      }));
      console.log("filled");
      console.log(this.state.usernameFilled);
      console.log(this.state.username);
    } else if (button == 'emailFilled') {
      this.setState(byPropKey => ({
        'emailFilled': !this.state.emailFilled,
      }));
      console.log("email filled: " + this.state.email);
    } else if (button == 'passwordFilled') {
      this.setState(byPropKey => ({
        'passwordFilled': !this.state.passwordFilled,
      }));
    } else if (button == 'imageFilled') {
      console.log('clicked');
      this.setState(byPropKey => ({
        'imageFilled': !this.state.imageFilled,
      }));
      console.log(this.state.imageFilled)
    }
  }

  saveAndContinue = (e) => {

    const {
      history,
    } = this.props;

    e.preventDefault();

  }

  //Handles the creation of an authenticated user.
  //It also calls the function which handles submitting the profile image.
  onSubmit = (event) => {
    event.preventDefault();
    const {
      history,
    } = this.props;
    const {
      username,
      email,
      password,
    } = this.state;
    auth.doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        //This funtion will handle the uploading ofthe profile avatar to fire base.
        //It will also facilitate pushing the user data up to firebase.
        this._handleSubmitImage(authUser, email, username)
      })
      .catch(error => {
        this.setState(byPropKey('error', error));
        console.log(error);
      });

  }
  //wowee here's a comment so i can push
  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} height='300' width='300' />);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }
    const username = this.state.username;
    const email = this.state.email;
    const password = this.state.password;
    const passwordCheck = this.state.passwordCheck;
    const image = this.state.image;

    const usernameFilled = this.state.usernameFilled;
    const emailFilled = this.state.emailFilled;
    const passwordFilled = this.state.passwordFilled;
    const imageFilled = this.state.imageFilled;

    const nameIsInvalid =
      username === '';

    const emailIsInvalid =
      email === '';

    const passwordIsInvalid =
      password !== passwordCheck ||
      password === '';

    if (!usernameFilled) {
      return (
        <div class="signInForm">
          <h1>what name do you want to go by?</h1>
          <form>
            <FormGroup controlId="username">
              <FormControl
                type="text"
                value={this.state.username}
                placeholder="Enter your name here"
                /*onChange={this.handleChange}*/
                onChange={event => this.setState(byPropKey('username', event.target.value))}
              />
              <FormControl.Feedback />
            </FormGroup>
            <Button bsStyle="primary" disabled={nameIsInvalid} onClick={() => this.handleClick('usernameFilled')}>
              Continue
            </Button>
          </form>
        </div>
      );
    } else if (usernameFilled & !emailFilled) {
      return (
        <div class="signInForm">
          <h1>hey, {this.state.username}! what email do you want to use?</h1>
          <form>
            <FormGroup controlId="email" validationState={this.state.validEmail}>
              <FormControl
                type="text"
                value={this.state.email}
                placeholder="Enter your email here"
                /*onChange={this.handleChange}*/
                onChange={(e) => this.handleValidEmail(e)}
              />
              <FormControl.Feedback />
            </FormGroup>
            <Button bsStyle="primary" disabled={emailIsInvalid} onClick={() => this.handleClick('emailFilled')}>
              Continue
            </Button>
          </form>
        </div>
      );
    } else if (usernameFilled & emailFilled & !passwordFilled) {
      return (
        <div class="signInForm">
          <h1>set your password</h1>
          <form>
            <FormGroup controlId="password" validationState={this.state.validPassword}>
              <FormControl
                type="password"
                value={this.state.password}
                placeholder="Enter your password here"
                // onChange={event => this.setState(byPropKey('password', event.target.value))}
                onChange={(e) => this.handleValidPassword(e)}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="passwordCheck" validationState={this.state.validMatch}>
              <FormControl
                type="password"
                value={this.state.passwordCheck}
                placeholder="Retype your password here"
                // onChange={event => this.setState(byPropKey('passwordCheck', event.target.value))}
                onChange={(e) => this.handlePasswordMatch(e)}

              />
              <FormControl.Feedback />
            </FormGroup>
            <Button bsStyle="primary" disabled={passwordIsInvalid} onClick={() => this.handleClick('passwordFilled')}>
              Continue
            </Button>
          </form>
        </div>
      );
    } else if (usernameFilled & emailFilled & passwordFilled & !imageFilled) {
      return (
        <div className="signInForm">
          <div className="previewComponent">
            <form onSubmit={(e) => this._handleSubmit(e)} onSelect={(e) => e.stopPropagation()}>
              <input /*className="fileInput"*/
                type="file"
                onSelect={(e) => e.stopPropagation()}
                onChange={(e) => this._handleImageChange(e)} />
            </form>
            <div className="imgPreview">
              {$imagePreview}
            </div>
          </div>
          <Button bsStyle="primary"
            onClick={() => this.handleClick('imageFilled')}>
            Continue
          </Button>
        </div>
      )
    } else {
      return (
        <div>
          <h1>name and email confirmation</h1>
          <form>
            <FormGroup controlId="username">
              <ControlLabel>Name:</ControlLabel>
              <FormControl
                type="text"
                value={this.state.username}
                placeholder="Enter your name here"
                /*onChange={this.handleChange}*/
                onChange={event => this.setState(byPropKey('username', event.target.value))}
              />
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId="email">
            <ControlLabel>Email:</ControlLabel>
              <FormControl
                type="text"
                value={this.state.email}
                placeholder="Enter your email here"
                /*onChange={this.handleChange}*/
                onChange={(e) => this.handleValidEmail(e)}
              />
              <FormControl.Feedback />
            </FormGroup>
          </form>
          <Button bsStyle="primary" onClick={this.onSubmit}>
            Continue
          </Button>
        </div>
      );
    }
  }

}

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
export default withRouter(SignUpPage);
export {
  SignUpForm,
  SignUpLink,
};
