import React from 'react';
import { MessageBox, MessageList } from './Messages';
import firebase from 'firebase';
import withAuthorization from './withAuthorization';
import { slide as Menu } from 'react-burger-menu';

import { Col, ListGroup, ListGroupItem, Well, Collapse, Button } from 'react-bootstrap';

class GroupLinks extends React.Component {
  constructor(props) {
    super(props)
    this.state = { textValue: '' }
    this.updateText = this.updateText.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.joinGroup = this.joinGroup.bind(this);
    this.createNewGroup = this.createNewGroup.bind(this);

  }

  //Pull all groups that the current user is associated with from firebase.
  //Results in object of all group objects that is used to populate group list.
  componentDidMount() {
    var groupRef = firebase.database().ref('groups')

    var groupsToDisplay = {};
    groupRef.on('value', (snapshot) => {
      var findGroups = {};
      var currUser = firebase.auth().currentUser.uid;
      var userGroupRef = firebase.database().ref('users/' + currUser + '/groups');
      var allGroups = snapshot.val();
      if (allGroups != null) {
        userGroupRef.on('value', (snapshot) => {
          findGroups = snapshot.val()
          for (var key in findGroups) {
            if (key in allGroups) {
              groupsToDisplay[key] = allGroups[key];
            }
          }
          this.setState({ group: groupsToDisplay });
        })
      }
    })
  }

  //Keeps track of user input in text boxes for joining and creating new groups.
  updateText(event) {
    this.setState({ textValue: event.target.value })
  }

  //Creates a new group. The group is saved to firebase under a uniqueID, and the text value 
  //entered by the user is saved as the group's groupName property.
  //New groups are shown in the group list once created.
  createNewGroup(event) {
    event.preventDefault();
    this.setState({ group: '' })
    var groupRef = firebase.database().ref('groups')
    var currUser = firebase.auth().currentUser.uid;
    var userRef = firebase.database().ref('users/' + currUser)
    var userObj;
    var newGroup = groupRef.push().key;
    var groupCode = Math.floor(1000 + Math.random() * 9000);
    groupRef.child(newGroup).set({ groupName: this.state.textValue, code: groupCode });
    userRef.on('value', (snapshot) => {
      userObj = snapshot.val();
      groupRef.child(newGroup).child('users').child(currUser).set({
        username: userObj.username,
        avatarURL: userObj.avatarURL
      });
    })
    userRef.child('groups').child(newGroup).set(this.state.textValue);
    this.setState({ newGroup: { [newGroup]: { groupName: this.state.textValue} } })
    this.setState({open: !this.state.open});

  }

  //Allows the user to join an existing group by entering in the four digit group code
  //associated with it. If the group is found, the group is added to the user's list
  //of accessible groups.
  joinGroup(event) {
    event.preventDefault();
    var groupRef = firebase.database().ref('groups');
    var userId = firebase.auth().currentUser.uid;
    var userRef = firebase.database().ref('users/' +userId);
    var userObj;
    userRef.on('value', (snapshot) => {
      userObj = snapshot.val();
      groupRef.on('value', (snapshot) => {
        snapshot.forEach((group) => {
          if (group.val().code == this.state.textValue) {
            userRef.child('groups').child(group.key).set(group.val().groupName);
            groupRef.child(group.key).child('users').child(userId).set({
              username: userObj.username,
              avatarURL: userObj.avatarURL
            })
            this.setState({newGroup: {[group]: {groupName: group.val().groupName}}});
            this.setState({openJoin: !this.state.openJoin});
          }
        })
        
      })
    })
    
  }

  //Changes the groupID in state when the user clicks on a group in the list.
  //This new state is then passed to the messageBox and messageList components.
  handleClick(event) {
    var id = event.target.id;
    var name = event.target.name;
    this.setState({ groupId: id , groupName: name});
  }



  render() {
    if (this.state.group) {
      //Item to be filled with available groups.
      var groups = [];
      //Populates list with names of available groups.
      for (var obj in this.state.group) {
        var newItem = <ListGroupItem 
          onClick={this.handleClick} id={obj} 
          name={this.state.group[obj].groupName}>{this.state.group[obj].groupName}: {this.state.group[obj].code}
          </ListGroupItem>
        groups.push(newItem);
      }
      return (
        <div className="main-container">
          <Menu className="Group-nav" pageWrapId={"page-wrap"} disableOverlayClick customBurgerIcon={<button className="menu-button">Choose a Group</button>}>
            <h3>Your Groups</h3>
            <ListGroup className="list-unstyled">
              {groups}

              {/*Button letting users create a new group*/}
              <ListGroupItem className="create-Group-item">
                <div>
                  <Button className="create-Group-btn" bsStyle="info" onClick={() => this.setState({ open: !this.state.open })}>New Group</Button>
                  <Collapse in={this.state.open}>
                    <div>
                      <Well>
                        <form>
                          <textarea placeholder="Group Name..." name="text" value={this.state.textUpdate} onChange={this.updateText} className="form-control"></textarea>
                          <Button bsStyle="info" type="submit" onClick={this.createNewGroup}>Create</Button>
                        </form>
                      </Well>
                    </div>
                  </Collapse>
                </div>
              </ListGroupItem>

              {/*Button letting users join groups*/}
              <ListGroupItem className="join-Group-item">
                <div>
                  <Button className="join-Group-btn" bsStyle="info" onClick={() => this.setState({ openJoin: !this.state.openJoin })}>Join Group</Button>
                  <Collapse in={this.state.openJoin}>
                    <div>
                      <Well>
                        <form>
                          <textarea placeholder="Enter Group Code..." name="text" value={this.state.textUpdate} onChange={this.updateText} className="form-control"></textarea>
                          <Button bsStyle="info" type="submit" onClick={this.joinGroup}>Join</Button>
                        </form>
                      </Well>
                    </div>
                  </Collapse>
                </div>
              </ListGroupItem>
            </ListGroup>
          </Menu>

          

        {/*render components to create new messages and display existing messages*/}
        {this.state.groupId !== undefined &&
            <MessageList groupId={this.state.groupId} name={this.state.groupName} />
        }
        </div>
      );
    } else { //If the user currently has no groups, do not render groupList component in full
      return null;
  }
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(GroupLinks);
