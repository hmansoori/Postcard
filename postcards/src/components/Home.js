import React, { Component } from 'react';
import withAuthorization from './withAuthorization';

class HomePage extends Component {

  render() {
    return (
      <div>
 
      </div>
    );
  }
}
  

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(HomePage);