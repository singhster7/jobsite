import React, { useState, useEffect } from "react";
import Applicant from "./Applicant";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function Applications(props) {
  const job = props.location.state.detail;
  const [applicants, setApplicants] = useState([]);
  const [filter, setFilter] = useState({ asc: "1", choice: "name" });
  const [disabled, setDisabled] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    let isMounted = true;
    if (props) {
      axios
        .post("https://jobsgram.herokuapp.com/api/jobs/getOne", job)
        .then((res) => {
          if (isMounted) {
            setApplicants(res.data.applicants);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [props]);
  const checkPostions = (newJob) => {
    setDisabled(true);
    axios
      .post(
        "https://jobsgram.herokuapp.com/api/jobs/updateStatusAccept",
        newJob
      )
      .then((res) => {
        axios
          .post("https://jobsgram.herokuapp.com/api/jobs/checkPositions", job)
          .then((res) => {
            setApplicants(res.data.applicants);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    setDisabled(false);
  };
  return (
    <>
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
            <div className="left" style={{ paddingLeft: "20px" }}>
              <button
                style={{
                  width: "100px",
                  letterSpacing: "1.5px",
                  backgroundColor: "#2E284C",
                }}
                onClick={(e) => {
                  props.history.push("/dashboard");
                }}
                className="btn btn-medium"
              >
                Home
              </button>
            </div>
          </div>
        </nav>
      </div>
      <div className="container valign-wrapper" style={{ width: "80%" }}>
        <div className="row">
          <div className="col s12 center-align">
            <div className="container" style={{ margin: "0" }}>
              <div
                className="row"
                style={{ width: "500px", marginTop: "2rem" }}
              >
                <div className="col s12 ">
                  <h4 className="grey-text text-darken-4 header left-align ">
                    <b>Applications</b> for {job.title}
                  </h4>
                </div>
              </div>
              <div
                className="row center-align"
                style={{ marginBottom: "1.6rem", minWidth: "80vw" }}
              >
                <p className="left-align grey-text text-darken-3" style={sty}>
                  Sort By:
                </p>
                <FormControl className={classes.formControl}>
                  <Select
                    value={filter.choice}
                    onChange={(event) => {
                      setFilter({ ...filter, choice: event.target.value });
                    }}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="dateOfApplication">Date Applied</MenuItem>
                    <MenuItem value="rating">Rating</MenuItem>
                  </Select>
                </FormControl>
                <p className="grey-text text-darken-3" style={sty}>
                  in
                </p>
                <FormControl className={classes.formControl}>
                  <Select
                    value={filter.asc}
                    onChange={(event) => {
                      setFilter({ ...filter, asc: event.target.value });
                    }}
                  >
                    <MenuItem value="1">Ascending</MenuItem>
                    <MenuItem value="-1">Descending</MenuItem>
                  </Select>
                </FormControl>
                <p className="grey-text text-darken-3" style={sty}>
                  Order
                </p>
              </div>
              {applicants
                .sort((applicant1, applicant2) => {
                  if (filter.choice === "dateOfApplication")
                    return (
                      (new Date(applicant1["dateOfApplication"]) -
                        new Date(applicant2["dateOfApplication"])) *
                      parseInt(filter.asc)
                    );
                  else if (filter.choice === "name") {
                    if (applicant1.id.name) {
                      return (
                        applicant1.id.name
                          .split(" ")[0]
                          .localeCompare(applicant2.id.name.split(" ")[0]) *
                        parseInt(filter.asc)
                      );
                    } else return false;
                  } else {
                    return (
                      (applicant1.id.rating - applicant2.id.rating) *
                      parseInt(filter.asc)
                    );
                  }
                })
                .filter((application) => {
                  var notEmployed = true;
                  if (application.id.jobsApplied) {
                    for (
                      let i = 0;
                      i < application.id.jobsApplied.length;
                      i++
                    ) {
                      if (application.id.jobsApplied.status === "accepted") {
                        notEmployed = false;
                      }
                    }
                  }
                  return application.status !== "rejected" && notEmployed;
                })
                .map((applicant) => (
                  <Applicant
                    applicant={applicant}
                    job={job}
                    key={applicant._id}
                    checkPostions={checkPostions}
                    disabled={disabled}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const sty = {
  width: "120px",
  display: "inline-block",
};
