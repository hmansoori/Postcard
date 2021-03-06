import React from 'react';

import noUserPic from './no-user-pic.png';
import {HashRouter} from 'react-router-dom';
import firebase from 'firebase';



/**
 * A form for signing up and logging into a website.
 * Specifies email, password, user handle, and avatar picture url.
 * Expects `signUpCallback` and `signInCallback` props
 */
class SignUpForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      'email': undefined,
      'password': undefined,
      'confirmPassword': undefined,
      'handle':undefined,
      'avatar':''
    }; 

    //function binding
    this.handleChange = this.handleChange.bind(this);
  }

  //update state for specific field
  handleChange(event) {
    var field = event.target.name;
    var value = event.target.value;

    var changes = {}; //object to hold changes
    changes[field] = value; //change this field
    this.setState(changes); //update state
  }

  //handle signUp button
  signUp(event) {
    event.preventDefault(); //don't submit
    this.signUpCallback(this.state.email, this.state.password, this.state.handle, this.state.avatar);
  }

 


//A callback function for registering new users
  signUpCallback(email, password, handle, avatar) {
    /* Create a new user and save their information */
    this.setState({Loaded: false});
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        //include information (for app-level content)
        var profilePromise = firebaseUser.updateProfile({
          displayName: handle,
          photoURL: avatar
        }); //return promise for chaining

        //create new entry in the Cloud DB (for others to reference)
				var userRef = firebase.database().ref('users/'+firebaseUser.uid); 
        var userData = {
          handle:handle,
          avatar:avatar
        }
        var userPromise = userRef.set(userData); //update entry in JOITC, return promise for chaining
        return Promise.all(profilePromise, userPromise); //do both at once!
      })
      .then(() => this.forceUpdate()) //bad, but helps demo
      .catch((err) => console.log(err));
      this.setState({Loaded: true});
     HashRouter.push('/channels');
  }

  /**
   * A helper function to validate a value based on a hash of validations
   * second parameter has format e.g., 
   * {required: true, minLength: 5, email: true}
   * (for required field, with min length of 5, and valid email)
   */
  validate(value, validations) {
    var errors = {isValid: true, style:''};
    
    if(value !== undefined){ //check validations
      //handle required
      if(validations.required && value === ''){
        errors.required = true;
        errors.isValid = false;
      }

      if (validations.match && value!==this.state.password) {
        errors.confirm = true;
        errors.isValid = false;
      }

      //handle minLength
      if(validations.minLength && value.length < validations.minLength){
        errors.minLength = validations.minLength;
        errors.isValid = false;
      }

      //handle email type ??
      if(validations.email){
        //pattern comparison from w3c
        //https://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single
        var valid = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
        if(!valid){
          errors.email = true;
          errors.isValid = false;
        }
      }
    }

    //display details
    if(!errors.isValid){ //if found errors
      errors.style = 'has-error';
    }
    else if(value !== undefined){ //valid and has input
      //errors.style = 'has-success' //show success coloring
    }
    else { //valid and no input
      errors.isValid = false; //make false anyway
    }
    return errors; //return data object
  }

  render() {
    //field validation
    var emailErrors = this.validate(this.state.email, {required:true, email:true});
    var passwordErrors = this.validate(this.state.password, {required:true, minLength:6});
    var confirmErrors = this.validate(this.state.confirmPassword, {required: true, match: true});
    var handleErrors = this.validate(this.state.handle, {required:true, minLength:3});

    //button validation
    var signUpEnabled = (emailErrors.isValid && passwordErrors.isValid && handleErrors.isValid);

    return (
      <form className="sign-up-form">

        <ValidatedInput field="email" type="email" label="Email" changeCallback={this.handleChange} errors={emailErrors} />

        <ValidatedInput field="password" type="password" label="Password" changeCallback={this.handleChange} errors={passwordErrors} />

         <ValidatedInput field="confirmPassword" type="password" label="Confirm Password" changeCallback={this.handleChange} errors={confirmErrors} />

        <ValidatedInput field="handle" type="text" label="Handle" changeCallback={this.handleChange} errors={handleErrors} />

        {/* full html for the URL (because image) */}
        <div className="form-group">
          <img className="avatar" src={this.state.avatar || noUserPic} alt="avatar preview" />
          <label htmlFor="avatar" className="control-label">Avatar Image URL</label>
          <input id="avatar" name="avatar" className="form-control" placeholder="http://www.example.com/my-picture.jpg" onChange={this.handleChange}/> 
       </div>

        <div className="form-group sign-up-buttons">
          <button className="btn btn-primary" disabled={!signUpEnabled} onClick={(e) => this.signUp(e)}>Sign-up</button>
        </div>
      </form>
    );
  }
}

//A component that displays an input form with validation styling
//props are: field, type, label, changeCallback, errors
class ValidatedInput extends React.Component {
  render() {
    return (
      <div className={"form-group "+this.props.errors.style}>
        <label htmlFor={this.props.field} className="control-label">{this.props.label}</label>
        <input id={this.props.field} type={this.props.type} name={this.props.field} className="form-control" onChange={this.props.changeCallback} />
        <ValidationErrors errors={this.props.errors} />
      </div>
    );
  }  
}

//a component to represent and display validation errors
class ValidationErrors extends React.Component {
  render() {
    return (
      <div>
        {this.props.errors.required &&
          <p className="help-block">Required!</p>
        }
        {this.props.errors.confirm &&
          <p className="help-block">Passwords do not match!</p>
        }
        {this.props.errors.email &&
          <p className="help-block">Not an email address!</p>
        }
        {this.props.errors.minLength &&
          <p className="help-block">Must be at least {this.props.errors.minLength} characters.</p>        
        }
      </div>
    );
  }
}

export default SignUpForm;


