import React from 'react';
import Time from 'react-time'
import firebase from 'firebase'
import {Box, Card} from './CardAnimation.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

//import noUserPic from './no-user-pic.png';

import {Image, Row, Col, Collapse, Well, Modal, Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { isNullOrUndefined } from 'util';

// A form the user can use to post a Message
export class MessageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { post: '', file: '', imagePreviewUrl: '', photoCaption: '', videoCaption: '' };
    this._handleSubmitImage = this._handleSubmitImage.bind(this);
    this._handleSubmitVideo = this._handleSubmitVideo.bind(this);
    this.updatePost = this.updatePost.bind(this);
  }

  updatePost(event) {
    this.setState({ textUpdate: event.target.value });
  }

  _handleSubmitVideo(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    var storageRef = firebase.storage().ref('/videos').child(this.state.file.name);
    var uploadTask = storageRef.put(this.state.file);
    var groupId = this.props.groupId;
    var cap = this.state.videoCaption;
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
    }, function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = uploadTask.snapshot.downloadURL;
      var messageRef = firebase.database().ref('groups/' + groupId);
      
      var newMessage = {
        type: "video",
        video: downloadURL,
        userId: firebase.auth().currentUser.uid,
        time: firebase.database.ServerValue.TIMESTAMP,
        caption: cap
      };
      messageRef.child('messages').push(newMessage);

    });
    this.setState({ file: '', imagePreviewUrl: '', videoCaption: ''})
  }

  _handleSubmitImage(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
    var storageRef = firebase.storage().ref('/images').child(this.state.file.name);
    var uploadTask = storageRef.put(this.state.file);
    var groupId = this.props.groupId;
    var cap = this.state.photoCaption;
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
    }, function () {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = uploadTask.snapshot.downloadURL;
      
      var messageRef = firebase.database().ref('groups/' + groupId);
      var newMessage = {
        type: "image",
        image: downloadURL,
        userId: firebase.auth().currentUser.uid,
        time: firebase.database.ServerValue.TIMESTAMP,
        caption: cap
      };
      messageRef.child('messages').push(newMessage);

    });
    this.setState({ file: '', imagePreviewUrl: '' , photoCaption: ''})
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

  //when the text in the form changes, update state value
  updatePost(event) {
    this.setState({ post: event.target.value });
  }

  updatePhotoCaption(event) {
    this.setState({photoCaption: event.target.value});
  }

  updateVideoCaption(event) {
    this.setState({videoCaption: event.target.value});
  }

  //Posts a new Message to the database. These are saved under the group they belong to within
  //a message child object. Information saved with each message includes a timestamp of when it was
  //written, the user who wrote it, and what the content is.
  postMessage(event) {
    event.preventDefault(); //don't submit

    var MessagesRef = firebase.database().ref('groups/' + this.props.groupId); //the Messages in the JOITC
    var newMessage = {
      type: 'text',
      text: this.state.post,
      userId: firebase.auth().currentUser.uid, //to look up Messageer info
      time: firebase.database.ServerValue.TIMESTAMP, //MAGIC
    };
    MessagesRef.child('messages').push(newMessage); //upload

    this.setState({ post: '' }); //empty out post (controlled input)
  }

  render() {
    let { imagePreviewUrl } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} className="img-preview" />);
    } else {
      $imagePreview = (<div className="previewText">Preview Your File Once You Select It Here!</div>);
    }
    return (

          <div className="message-buttons">
            <div>
              <DropdownButton class="choice-button text-button" dropup noCaret title="Write a Message">
                <div>
                  <Well>
                    <form onSelect = {(e) => e.stopPropagation()}>
                      <textarea placeholder="What do you want to say?" value={this.state.post} className="form-control" onChange={(e) => this.updatePost(e)}></textarea>
                      <div className="form-group send-Message">
                        {/* Disable if invalid post length */}
                        <Button bsStyle="info"
                          disabled={this.state.post.length === 0}
                          onClick={(e) => this.postMessage(e)} >
                          <i className="fa fa-pencil-square-o" aria-hidden="true"></i> Share
            </Button>
                      </div>
                    </form>
                  </Well>
                </div>
              </DropdownButton>
              <DropdownButton dropup noCaret title="Post a Photo" class="choice-button photo-button" pullRight>
                <div className="previewComponent">
                  <form onSubmit={(e) => this._handleSubmit(e)} onSelect = {(e) => e.stopPropagation()}>
                    <input className="fileInput"
                      type="file"
                      onSelect = {(e) => e.stopPropagation()}
                      onChange={(e) => this._handleImageChange(e)} />
                    <textarea placeholder="Add a caption" value={this.state.photoCaption}  onChange={(e) => this.updatePhotoCaption(e)} className="form-control"></textarea>
                    <button className="submitButton"
                      type="submit"
                      onClick={(e) => this._handleSubmitImage(e)}>Upload Image</button>
                  </form>
                  <div className="imgPreview">
                    {$imagePreview}
                  </div>
                </div>
              </DropdownButton>
              <DropdownButton dropup noCaret title="Share a Video" class="choice-button video-button" id="video" pullRight>
              <div className="previewComponent">
              <div className="imgPreview">
                    {$imagePreview}
                  </div>
                  <form onSubmit={(e) => this._handleSubmitVideo(e)}>
                    <input className="fileInput"
                      type="file"
                      onSelect = {(e) => e.stopPropagation()}
                      onChange={(e) => this._handleImageChange(e)} />
                    <textarea placeholder="Add a caption" value={this.state.videoCaption} onSelect = {(e) => e.stopPropagation()} onChange={(e) => this.updateVideoCaption(e)} className="form-control"></textarea>
                    <button className="submitButton"
                      type="submit"
                      onClick={(e) => this._handleSubmitVideo(e)}>Upload An .mp4 File</button>
                  </form>
                  
                </div>
              </DropdownButton>
            </div>
          </div>

    );
  }
}

//A list of Messages that have been posted
export class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { Messages: [],
                   index: 0,
                   maxLength: 1,
                   rightCard: [],
                   userObjects: [],
                 };
    this.raiseIndex = this.raiseIndex.bind(this);
    this.lowerIndex = this.lowerIndex.bind(this);
    this.resetIndex = this.resetIndex.bind(this);
  }

  //Lifecycle callback executed when the component appears on the screen.
  //It is cleaner to use this than the constructor for fetching data
  componentDidMount() {
    /* Add a listener for changes to the user details object, and save in the state */
    var MessageRef = firebase.database().ref('groups/' + this.props.groupId);
    MessageRef.on('value', (snapshot) => {
      this.setState({ messages: snapshot.val() });
    })

    var usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) => {
      this.setState({ users: snapshot.val() });
    });
    var groupObject = {};
    var userObject = {};
    var groupRef = firebase.database().ref('groups');
    groupRef.on('value', (snapshot) => {
      this.setState({ groups: snapshot.val() });
      snapshot.forEach((group) => {
        var groupMessages = [];
        console.log(group.key);
        console.log(group.val().users);
        userObject[group.key] = group.val().users;
       
        for (var message in group.val().messages) {
          var obj = group.val().messages[message];
          obj.key = message;
          groupMessages.push(obj)
        }
        groupMessages.sort((a, b) => b.time - a.time);
        groupObject[group.key] = groupMessages;
      })
      
      this.setState({ allMessages: groupObject });
      this.setState({ userObjects: userObject});

    })
  }


  lowerIndex(event) {
    event.preventDefault();
    this.setState({index: (this.state.index -1)})

  }

  raiseIndex(event) {
    event.preventDefault();
    this.setState({index: (this.state.index + 1)})

  }

  resetIndex(event) {
    event.preventDefault();
    this.setState({index: 0});
  }

  //When component will be removed
  componentWillUnmount() {
    //unregister listeners
    firebase.database().ref('users').off();
    firebase.database().ref('groups/' + this.props.groupId).off();
    firebase.database().ref('groups').off();
  }

  render() {
    var messageItems = [];
    const foo = this.props.foo;
    //don't show if don't have message data yet (to avoid partial loads)
    if (this.state && this.state.allMessages && (this.props.groupId != null)) {
      var groupToUse = this.state.allMessages[this.props.groupId];
      var usersToUse = this.state.userObjects[this.props.groupId];
      for (var i = 0; i < groupToUse.length; i++) {
        var newMessage = <MessageItem key={i} Message={groupToUse[i]} AllMessages={groupToUse}
          userObj={usersToUse} group={this.props.groupId}/>
        messageItems.push(newMessage);
      }
      
    }


    return (
<div>
  <div>
      <Row class="message-section">
      <Col xs={12} xsOffset={0} sm={10} smOffset={2} md={10} mdOffset={2} lg={6} lgOffset={3}>
          {messageItems[this.state.index]}
      </Col>


      {/*<Col xs={2} className="arrow-container">
        <div>
          <button className="arrow" disabled={this.state.index === 0} onClick={this.lowerIndex}><i class="fas fa-chevron-up fa-5x" ></i></button>
        </div>
        <div>
          <button className="arrow" disabled={this.state.index === (messageItems.length -1)} onClick={this.raiseIndex}><i class="fas fa-chevron-down fa-5x"></i></button>
        </div>
        <div>
          <button className="refresh" onClick={this.resetIndex}><i class="fas fa-sync-alt fa-5x"></i></button>
        </div>
      </Col>*/}
      </Row>
      <Row>
      <Col xs={12} sm={6} smOffset={2} >
      <MessageBox groupId = {this.props.groupId} />
      </Col>

      </Row>
      </div>
      
      </div>

    );
  }
}

//A single Message
class MessageItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = { textUpdate: '',
                   leftCard: this.props.AllMessages.reverse(),
                   rightCard: [],
                   lastUsedIndex: '',
                 }
    this.componentWillMount = this.componentWillMount.bind(this);
  }

  componentWillMount() {
    var currentUser = firebase.auth().currentUser.uid;
    if (this.props.user === currentUser) {
      this.setState({ show: true });
    }
    else {
      this.setState({ show: false });
    }
  }


  componentWillReceiveProps(nextProps) {
    // alex trebek, what is bad code?
    if (nextProps.AllMessages !== this.state.leftCard) {
      if (nextProps.AllMessages.length > 1) {
        if (nextProps.AllMessages[0].time > nextProps.AllMessages[1].time) {
          this.setState({
            leftCard: nextProps.AllMessages.reverse(),
            rightCard: []
          });
          console.log(this.state.leftCard)
          //console.log("reversed");
        } else {
          this.setState({
            leftCard: nextProps.AllMessages,
            rightCard: []
          });
        }
      } else {
        this.setState({
          leftCard: nextProps.AllMessages,
          rightCard: []
        });
      }

    }

  }


  //A method to "like" a Message
  likeMessage(key) {
    /* Access the Message in the firebase and add this user's name */
    console.log(key);
    var MessageRef = firebase.database().ref('groups/' + this.props.group + '/messages/' + key);
    var MessageLikes = MessageRef.child('likes');

    //toggle logic
    var userId = firebase.auth().currentUser.uid
    var likeObj = this.props.Message.likes || {};
    if (likeObj && likeObj[userId]) { //in likes list already
      likeObj[userId] = null; //remove
    }
    else { //add my like
      likeObj[userId] = true; //just make it true so we have a key
    }

    MessageLikes.set(likeObj) //update the likes!

  }

  onItemActionLeft(id) {
    const newLeftItems = this.state.leftCard.slice();
    var foo = newLeftItems.splice(id, 1);
    this.setState({
      leftCard: newLeftItems,
      rightCard: this.state.rightCard.concat(foo),
      iVlastUsedIndex: id
    });
    console.log("Called left");
    console.log("LEFT CARDS");
    console.log(this.state.leftCard);
    console.log("RIGHT CARDS");
    console.log(this.state.rightCard);

  }


  onItemActionRight(id) {
    const newRightItems = this.state.rightCard.slice();
    var foo = newRightItems.splice(id, 1);
    this.setState({
      leftCard: this.state.leftCard.concat(foo),
      rightCard: newRightItems,
    });
    console.log("Called right");
    console.log(this.state.rightCard);
  }

  render() {
    // var iLike = false;
    // var likeCount = 0; //count likes
    // if (this.props.Message.likes) {
    //   likeCount = Object.keys(this.props.Message.likes).length;
    //   if (this.props.Message.likes[firebase.auth().currentUser.uid])
    //     iLike = true;
    // }
    var userRef = firebase.database().ref('users/' + this.props.user);
    var user;
    userRef.on('value', (snapshot) => {
      var userObj = snapshot.val();
      user = userObj;
    });

    return (

      <div>
        {this.state && this.props.group &&
        <div className="message-container">
          <div className="leftDeck">
            <ReactCSSTransitionGroup
            className='container'
              transitionName="leftTransition"
              transitionEnterTimeout={3000}
              transitionLeaveTimeout={3000}>
                {this.state.leftCard.map((item, i) => {

                  return (
                    <Box key={i}
                      /*onClick={this.onItemActionLeft.bind(this, i)}*/
                      className="item">
                      <div onClick={this.onItemActionLeft.bind(this, i)}>
                        <span className="time"><Time value={item.time} relative /></span>
                        {item.image &&
                          <div>
                          <div className="message-content">
                          <img className="message-img" src={item.image}/>
                          </div>
                          <div className="caption-container"> 
                            <Image className="avatar-with-cap" src={this.props.userObj[item.userId].avatarURL} circle responsive/>
                            <p className="caption">{item.caption}</p>
                          </div>
                          <div className="user"> <span className="handle">{this.props.userObj[item.userId].username}</span></div>
                        </div>
                        }
                        {item.video &&
                          <div>
                          <div className=" message-content "><video id="my-video" class="video-js" controls preload="auto"  data-setup="{}"><source src={this.props.Message.video} type='video/mp4'/></video></div>
                          <div className="caption-container"> 
                            <Image className="avatar-with-cap" src={this.props.userObj[item.userId].avatarURL} circle responsive/>
                            <p className="caption">{item.caption}</p>
                          </div>
                          <div className="user"> <span className="handle">{this.props.userObj[item.userId].username}</span></div>
                          </div>
                        }
                        {item.text &&
                        /* Show the text of the Message */
                        <div>
                        <div className="message message-content">{item.text}</div>
                        <Image className="avatar-with-text" src={this.props.userObj[item.userId].avatarURL} circle responsive/>
                        
                        <div className="user"> <span className="handle-with-text">{this.props.userObj[item.userId].username}</span></div>
                        </div>
                        }
                        
                      </div>
                      {/* Create a section for showing Message likes
                      <div className="likes">

                        Show a heart icon that, when clicked, calls like `likeMessage` function
                        <i className={'fa fa-heart ' + (iLike ? 'user-liked' : '')} aria-label="like" onClick={() => this.likeMessage(item.key)} ></i>

                        Show the total number of likes
                        <span>space {likeCount}</span>
                      </div>
                      <div> {this.state.show ? <EditBar message={this.props.Message} group={this.props.group} /> : null}
                      </div> */}
                    </Box>
                   );
                })}
            </ReactCSSTransitionGroup> 
          </div>
          <div className="rightDeck">
            <ReactCSSTransitionGroup
            className='container'
              transitionName="rightTransition"
              transitionEnterTimeout={3000}
              transitionLeaveTimeout={3000}>
                {this.state.rightCard.map((item, i) => {
                  console.log(i + '+' + item.caption)
                  return (
                    <Box key={i}
                      onClick={this.onItemActionRight.bind(this, i)}
                      className="item">
                      <span className="time"><Time value={item.time} relative /></span>
                        {item.image &&
                          <div>
                          <div className="message-content">
                          <img className="message-img" src={item.image}/>
                          </div>
                          <div className="caption-container"> 
                            <Image className="avatar-with-cap" src={this.props.userObj[item.userId].avatarURL} circle responsive/>
                            <p className="caption">{item.caption}</p>
                          </div>
                          <div className="user"> <span className="handle">{this.props.userObj[item.userId].username}</span></div>
                        </div>
                        }
                        {item.video &&
                          <div>
                          <div className=" message-content "><video id="my-video" class="video-js" controls preload="auto"  data-setup="{}"><source src={this.props.Message.video} type='video/mp4'/></video></div>
                          <div className="caption-container"> 
                            <Image className="avatar-with-cap" src={this.props.userObj[item.userId].avatarURL} circle responsive/>
                            <p className="caption">{item.caption}</p>
                          </div>
                          <div className="user"> <span className="handle">{this.props.userObj[item.userId].username}</span></div>
                          </div>
                        }
                        {item.text &&
                        /* Show the text of the Message */
                        <div>
                        <div className="message message-content">{item.text}</div>
                        <Image className="avatar-with-text" src={this.props.userObj[item.userId].avatarURL} circle responsive/>
                        
                        <div className="user"> <span className="handle-with-text">{this.props.userObj[item.userId].username}</span></div>
                        </div>
                        }
                        
                      
                      {/* /* Create a section for showing Message likes
                      <div className="likes">

                        Show a heart icon that, when clicked, calls like `likeMessage` function
                        <i className={'fa fa-heart ' + (iLike ? 'user-liked' : '')} aria-label="like" onClick={() => this.likeMessage()} ></i>

                        Show the total number of likes
                        <span>space {likeCount}</span>
                      </div>
                      <div> {this.state.show ? <EditBar message={item} group={this.props.group} /> : null}
                      </div> */ }
                    </Box>
                  );
                })}
            </ReactCSSTransitionGroup>
          </div>
        </div>
        
        }
      </div>
    );
  }
}

function FirstChild(props) {
  const childrenArray = React.Children.toArray(props.Message);
  return childrenArray[0] || null;
}

class EditBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { textUpdate: '', showModal: false };
    this.editMessage = this.editMessage.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  updatePost(event) {
    this.setState({ textUpdate: event.target.value });
  }

  deleteMessage() {
    var messageRef = firebase.database().ref('groups/' + this.props.group + '/messages');
    messageRef.child(this.props.message.key).remove();
    this.setState({ showModal: false });

  }

  editMessage(event) {
    event.preventDefault();
    var messageRef = firebase.database().ref('groups/' + this.props.group + '/messages/' + this.props.message.key);
    messageRef.child('text').set(this.state.textUpdate);
    this.setState({ textUpdate: '' });
  }

  open() {
    this.setState({ showModal: true });
  }

  close() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <Button onClick={() => this.setState({ open: !this.state.open })}><i className="fa fa-sort-desc" aria-label="editMessage" ></i></Button>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              <form>
                <textarea placeholder="Edit Text..." value={this.state.textUpdate} className="form-control" onChange={this.updatePost}></textarea>
                <Button bsStyle="info" type="submit" onClick={this.editMessage}> Submit Edits</Button>
              </form>
              <i className="fa fa-trash-o fa-2x" aria-hidden="true" onClick={this.open}></i>
              <Modal className="delete-modal" show={this.state.showModal} onHide={this.close}>
                <Modal.Body>
                  <p>Are you sure you want to delete this message?</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button bsStyle="warning" onClick={this.deleteMessage}>Delete</Button>
                  <Button onClick={this.close}>Cancel</Button>
                </Modal.Footer>
              </Modal>
            </Well>
          </div>
        </Collapse>
      </div>
    );
  }
}


export default MessageList;
