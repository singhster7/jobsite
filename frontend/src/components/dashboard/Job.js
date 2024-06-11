import React, { useState, useEffect } from "react";
import "./../../index.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";

function StarIcon(props) {
  const { fill = "yellow" } = props;
  return (
    <svg
      style={{ height: "22px", width: "22px" }}
      fill={fill}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      ></path>
    </svg>
  );
}

function Job(props) {
  const job = props.job;
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [sop, setSop] = useState("");
  const [buttonValue, setButtonValue] = useState("APPLY");
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (job.applicants.length >= job.applications) {
      setButtonValue("FULL");
    }
    var count = 0;
    for (let i = 0; i < job.applicants.length; i++) {
      if (job.applicants[i].status === "accepted") count++;
      if (job.positions <= count) {
        setButtonValue("FULL");
      }
    }
    for (var i = 0; i < job.applicants.length; i++) {
      if (job.applicants[i].id === props.user._id) {
        setButtonValue("APPLIED");
        break;
      }
    }
  });
  const handleClickOpen = () => {
    if (buttonValue === "APPLY") {
      var employed = false;
      for (let i = 0; i < props.user.jobsApplied.length; i++) {
        if (props.user.jobsApplied[i].status === "accepted") {
          employed = true;
          break;
        }
      }
      if (employed) {
        setOpen(false);
        setOpen2(true);
      } else {
        setOpen(true);
      }
    }
  };
  const handleValidation = () => {
    let error = "";
    let valid = true;
    if (sop === "") {
      valid = false;
      error = "SOP can't be empty";
    }
    if (sop === "\n") {
      valid = false;
      error = "SOP can't be empty";
    }
    if (sop.length > 250) {
      valid = false;
      error = "SOP can't be more than 250 words";
    }
    setError(error);
    return valid;
  };
  const handleClose = () => {
    setOpen(false);
    setSop("");
    setError("");
  };
  const apply = (e) => {
    if (handleValidation()) {
      setDisabled(true);
      const newJob = {
        id: job._id,
        applicant: {
          id: props.user._id,
          status: "applied",
          sop: sop,
          dateOfApplication: new Date(),
        },
      };

      axios
        .post("https://jobsgram.herokuapp.com/api/jobs/addApplicant", newJob)
        .then((res) => {
          console.log(res.data);
          if (res.data === "error") {
            setOpen(false);
            setOpen1(true);
          } else {
            setButtonValue("APPLIED");
            setOpen(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const colors = () => {
    if (buttonValue === "APPLIED") {
      return "#00ab66";
    } else if (buttonValue === "FULL") {
      return "#cf142b";
    } else {
      return "#5c74ec";
    }
  };
  const getTimes = () => {
    var date = new Date(job.deadline);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  };
  const getDates = (date) => {
    var monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var dateObj = new Date(date);
    return (
      dateObj.getDate() +
      " " +
      monthNames[dateObj.getMonth()] +
      " " +
      dateObj.getFullYear()
    );
  };
  return (
    <div
      className="card"
      style={{ minHeight: "200px", maxWidth: "40vw", minWidth: "35vw" }}
    >
      <div className="row " style={{ display: "flex" }}>
        <div className="col s8">
          <div
            className="card-content black-text"
            style={{ paddingRight: "0" }}
          >
            <div
              className="card-title left-align"
              style={{ fontSize: "24px", marginBottom: "0" }}
            >
              {job.title}
            </div>
            <p className="left-align" style={{ fontSize: "0.85rem" }}>
              By &nbsp;{job.recruiterName}
            </p>
            <div
              className="box flex"
              style={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
            >
              {[1, 2, 3, 4, 5].map((index) => {
                var fill;
                if (index <= job.rating) fill = "yellow";
                else fill = "none";

                return <StarIcon key={index} fill={fill} />;
              })}
            </div>
            <p className="left-align" style={sty}>
              <b>Salary:</b> &nbsp;Rs {job.salary}/month
            </p>
            <p className="left-align" style={sty}>
              <b>Duration:</b> &nbsp;
              {job.duration ? job.duration : "Indefinite"}{" "}
              {job.duration ? "months" : null}
            </p>
            <p className="left-align" style={sty}>
              <b>Type:</b> &nbsp;{job.typeOfJob}
            </p>
            <p className="left-align" style={sty}>
              <b>Deadline:</b> &nbsp;{getDates(job.deadline)} at {getTimes()}
            </p>
          </div>
        </div>
        <div className="col s4 left-align" style={{ display: "grid" }}>
          <button
            className="waves-effect waves-light btn-large button"
            onClick={handleClickOpen}
            style={{
              margin: "auto",
              backgroundColor: colors(),
              borderRadius: "3px",
            }}
          >
            {buttonValue}
          </button>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Statement of Purpose</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write a Statement of Purpose for the Job you are applying to
          </DialogContentText>
          <TextField
            className="browser-default"
            autoFocus
            margin="dense"
            id="sop"
            label="Statement of purpose"
            type="text"
            fullWidth
            multiline
            value={sop}
            rows={1}
            rowsMax={8}
            onChange={(e) => {
              setSop(e.target.value);
            }}
          />
          <span className="red-text" style={{ fontSize: "0.8rem" }}>
            {error}
          </span>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={apply} color="primary" disabled={disabled}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open1}
        onClose={() => setOpen1(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You cannot have more than 10 open applications
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen1(false)} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open2}
        onClose={() => setOpen2(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are already employed, you cannot apply to more jobs
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen2(false)} color="primary" autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
const sty = {
  padding: "0.3rem 0",
};
export default Job;
