import React, { Component } from "react";
class NavbarLogged extends Component {
  onProfile = e => {
      console.log(this.props.user.state.userData)
  }
  render() {
    return (
      <h1>et</h1>
    )
  }
}
export default NavbarLogged;