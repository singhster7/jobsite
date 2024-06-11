import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import classnames from "classnames";
import axios from "axios";
import moment from "moment";

export default function EditJob(props) {
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);
  const [job, setJob] = useState(props.location.state.detail[0]);
  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;
    var date = new Date();
    var dated = new Date(job.deadline);
    if (date > dated) {
      formIsValid = false;
      errors.deadline = "Deadline already passed";
    }
    if (job.title === "") {
      formIsValid = false;
      errors.title = "Job title is required";
    }
    if (!job.applications.toString().match(/^[0-9]+$/)) {
      formIsValid = false;
      errors.applications = "Job applications can only be numnerical";
    }
    if (job.applications === "") {
      formIsValid = false;
      errors.applications = "No. of applications is required";
    }
    if (job.applications === "0") {
      formIsValid = false;
      errors.applications = "No. of applications cant be 0";
    }
    if (job.applications < 0) {
      formIsValid = false;
      errors.applications = "No. of applications cant be negative";
    }
    if (!job.positions.toString().match(/^[0-9]+$/)) {
      formIsValid = false;
      errors.positions = "Job positions can only be numnerical";
    }
    if (job.positions === "") {
      formIsValid = false;
      errors.positions = "No. of positions is required";
    }
    if (job.positions === "0") {
      formIsValid = false;
      errors.positions = "No. of positions cant be 0";
    }
    if (job.positions < 0) {
      formIsValid = false;
      errors.positions = "No. of positions cant be negative";
    }
    if (parseInt(job.positions) > parseInt(job.applications)) {
      formIsValid = false;
      errors.positions =
        "No. of positions cant be more than No. of applications";
    }
    if (job.deadline > Date.now) {
      formIsValid = false;
      errors.deadline = "Deadline already passed";
    }
    setErrors(errors);
    return formIsValid;
  };
  const onChange = (e) => {
    setJob({ ...job, [e.target.id]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (disabled) {
      setDisabled(false);
    } else {
      if (handleValidation()) {
        setDisabled(true);
        var dated = new Date(job.deadline);
        const UpdatedJob = {
          applications: job.applications,
          positions: job.positions,
          deadline: dated,
          id: props.location.state.detail[0]._id,
        };
        if (disabled === false) {
          axios
            .post("https://jobsgram.herokuapp.com/api/jobs/update", UpdatedJob)
            .then((res) => {
              window.M.toast({ html: "Job Details Edited!" }, 2000);
              props.history.push({
                pathname: "/dashboard",
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
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
      <div
        className="container valign-wrapper"
        style={{ width: "80%", height: "80vh" }}
      >
        <div className="row">
          <div className="col s12">
            <div className="container z-depth-2" style={{ marginTop: "8rem" }}>
              <div className="row">
                <div
                  className="col s10 offset-s1"
                  style={{ marginTop: "1rem" }}
                >
                  <h4 className="grey-text text-darken-4 header left-align ">
                    <b>Edit Job</b>
                  </h4>
                  <form onSubmit={onSubmit}>
                    <div
                      className="input-field col s12"
                      style={{ marginBottom: "0" }}
                    >
                      <span style={sty}>Job Title</span>
                      <input
                        value={job.title}
                        disabled={true}
                        id="title"
                        type="text"
                      />
                    </div>
                    <div
                      className="col s5 input-field"
                      style={{ marginTop: "0" }}
                    >
                      <span style={sty}>Max. Applications</span>
                      <input
                        value={job.applications}
                        onChange={onChange}
                        disabled={disabled}
                        id="applications"
                        type="number"
                        className={classnames("", {
                          invalid: errors.applications,
                        })}
                      />
                      <span className="red-text">{errors.applications}</span>
                    </div>
                    <div
                      className="col s5 offset-s2 input-field"
                      style={{ marginTop: "0" }}
                    >
                      <span style={sty}>Max. Positions</span>
                      <input
                        disabled={disabled}
                        onChange={onChange}
                        value={job.positions}
                        id="positions"
                        type="number"
                        className={classnames("", {
                          invalid: errors.positions,
                        })}
                      />
                      <span className="red-text">{errors.positions}</span>
                    </div>
                    <div
                      className="col s5"
                      style={{ padding: "0 1.75rem 1rem 0.75rem" }}
                    >
                      <TextField
                        id="deadline"
                        onChange={onChange}
                        label="Deadline for Application"
                        value={moment(job.deadline).format(
                          "YYYY-MM-DDTHH:mm:ss"
                        )}
                        type="datetime-local"
                        disabled={disabled}
                        className="browser-default"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        style={{ marginBottom: "0.25rem" }}
                      />
                      <span className="red-text">{errors.deadline}</span>
                    </div>
                    <div className="col s10" style={{ paddingBottom: "1rem" }}>
                      <button
                        style={{
                          width: "100px",
                          borderRadius: "3px",
                          letterSpacing: "1.5px",
                          margin: "1rem 0",
                        }}
                        type="submit"
                        className="btn btn-large"
                      >
                        {disabled ? "Edit" : "Save"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const sty = {
  fontSize: "13px",
  color: "#9e9e9e",
};
