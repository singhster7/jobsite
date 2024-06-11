import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Jobs from "./Jobs";
import AddJobs from "./AddJobs";
import axios from "axios";
import ProfileA from "./../tabs/ProfileA";
import ProfileR from "./../tabs/ProfileR";
import MyApplication from "./../applicant/MyApplication";
import JobListings from "./../recruiter/JobListings";
import MyEmployees from "./../recruiter/MyEmployees";

class Dashboard extends Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      userData: {},
      tab: "dashboard",
    };
  }
  componentDidMount() {
    this._isMounted = true;
    const { user } = this.props.auth.user;
    if (user.role === "applicants") {
      axios
        .post("https://jobsgram.herokuapp.com/api/applicant", user)
        .then((res) => {
          if (this._isMounted) {
            this.setState({ userData: res.data });
            this.setState((prevState) => ({
              userData: { ...prevState.userData, role: "applicants" },
            }));
          }
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post("https://jobsgram.herokuapp.com/api/recruiter", user)
        .then((res) => {
          if (this._isMounted) {
            this.setState({ userData: res.data });
            this.setState((prevState) => ({
              userData: { ...prevState.userData, role: "recruiters" },
            }));
          }
        })
        .catch((err) => console.log(err));
    }
  }
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };
  choose = () => {
    const { user } = this.props.auth.user;

    if (user.role === "applicants") {
      if (this.state.tab === "profile") {
        return <ProfileA user={this.state.userData} />;
      } else if (this.state.tab === "myApplications") {
        return <MyApplication user={this.state.userData} />;
      } else {
        return <Jobs user={this.state.userData} />;
      }
    } else {
      if (this.state.tab === "profile") {
        return <ProfileR user={this.state.userData} />;
      } else if (this.state.tab === "jobListings") {
        return <AddJobs user={this.state.userData} />;
      } else if (this.state.tab === "myEmployees") {
        return <MyEmployees user={this.state.userData} />;
      } else {
        return (
          <JobListings
            user={this.state.userData}
            history={this.props.history}
          />
        );
      }
    }
  };
  render() {
    const { user } = this.props.auth.user;
    return (
      <React.Fragment>
        <div className="Navbar-fixed">
          <nav className="z-depth-0">
            <div className="nav-wrapper" style={{ backgroundColor: "#2E284C" }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontColor: "#F0F1F7",
                }}
                className="col s5 brand-logo center"
              >
                <i className="material-icons">work</i>
                JOBSGRAM
              </div>
              <ul id="nav-mobile" className="right">
                <li>
                  <div onClick={this.onLogoutClick} className="btn navb">
                    Logout
                  </div>
                </li>
              </ul>
              <ul id="nav-mobile" className="left">
                <li>
                  <div
                    className="btn navb"
                    onClick={(e) => {
                      this.setState((prevState) => ({
                        ...prevState,
                        tab: "home",
                      }));
                    }}
                  >
                    Home
                  </div>
                </li>
                <li>
                  <div
                    className="btn navb"
                    onClick={(e) => {
                      this.setState((prevState) => ({
                        ...prevState,
                        tab: "profile",
                      }));
                    }}
                  >
                    Profile
                  </div>
                </li>
                {user.role === "applicants" ? (
                  <li>
                    <div
                      className="btn navb"
                      onClick={(e) => {
                        this.setState((prevState) => ({
                          ...prevState,
                          tab: "myApplications",
                        }));
                      }}
                    >
                      My Applications
                    </div>
                  </li>
                ) : (
                  <li>
                    <div
                      className="btn navb"
                      onClick={(e) => {
                        this.setState((prevState) => ({
                          ...prevState,
                          tab: "jobListings",
                        }));
                      }}
                    >
                      Add Job
                    </div>
                  </li>
                )}
                {user.role === "applicants" ? null : (
                  <li>
                    <div
                      className="btn navb"
                      onClick={(e) => {
                        this.setState((prevState) => ({
                          ...prevState,
                          tab: "myEmployees",
                        }));
                      }}
                    >
                      My Employees
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
        <div className="container valign-wrapper" style={{ width: "80%" }}>
          <div className="row">
            <div className="col s12">{this.choose()}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStateToProps, { logoutUser })(Dashboard);
