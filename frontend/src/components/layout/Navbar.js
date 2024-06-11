import React, { Component } from "react";
class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper" style = {{backgroundColor: '#2E284C'}}>
            <div
              style={{
                fontFamily: "monospace"
              }}
              className="col s5 brand-logo center white-text"
            >
              <i className="material-icons">work</i>
              JOBSGRAM
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
export default Navbar;