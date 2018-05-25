import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
// import { withGesture, Gesture } from 'react-with-gesture'
// import { Spring, animated } from 'react-spring'
// import { CSSTransition, transit } from "react-css-transition"


// class Something extends React.Component {
//     render() {
//         return (
//             <Gesture>
//                 {({ down, x, y, xDelta, yDelta, xInitial, yInitial }) =>
//                     <div>Drag me! coordinates: {x}, {y}</div>
//                 }
//             </Gesture>
//         )
//     }
// }


// class Card extends React.Component {
//   constructor(props) {
//     super(props);
//
//     this.state = {
//       // num in array?
//       leftStack: "leftTempValue", //num to signify count in array
//       rightStack: "rightTempValue", //num to signify count in array
//       topCard: null,
//       value: false,
//     };
//   }
//
//   changeCard() {
//     console.log(this.state.value + "what's up");
//     // this.state.value = "foo";
//
//   }
//
//   render() {
//     return (
//       // <button className="square" onClick={() => this.setState({value: 'X'})}>
//       //   {this.state.value}
//       // </button>
//       <div onClick={this.changeValue}>
//         <CSSTransition
//           // defaultStyle={{ transform: "translate(0, 0)" }}
//           // enterStyle={{ transform: transit("translate(50px, 0)", 500, "ease-in-out") }}
//           // leaveStyle={{ transform: transit("translate(0, 0)", 500, "ease-in-out") }}
//           // activeStyle={{ transform: "translate(50px, 0)" }}
//           // active={this.state.active}
//
//           >
//           <div/>
//         </CSSTransition>
//       </div>
//
//     );
//   }
// };

export const Box = styled.div`
  display: inline-block;
  background: pink;
  width: 200px;
  height: 200px;
  transition: transform 300ms ease-in-out;
  position: absolute;

  margin: 50px;
  padding: 20px;
  text-align: center;
  margin: auto;
  background-color: white;
  border-radius: 20px;
  box-shadow: 10px 10px #006699;

  &:click {
    transform: translate(200px, 150px) rotate(20deg)
  }
`

export {
  // Card
};
