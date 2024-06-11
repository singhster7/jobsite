import React, { useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";
import Button from "@material-ui/core/Button";

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

export default function Applicant(props) {
  const [status, setStatus] = useState(props.applicant.status);

  const applicant = props.applicant.id;
  useEffect(() => {
    let isMounted = true;
    axios
      .post("https://jobsgram.herokuapp.com/api/applicant", applicant)
      .then((res) => {
        if (isMounted) {
          for (let i = 0; i < res.data.jobsApplied.length; i++) {
            if (
              res.data.jobsApplied[i].status === "accepted" &&
              res.data.jobsApplied[i].id &&
              res.data.jobsApplied[i].id._id !== props.job._id
            ) {
              setStatus("rejected");
            }
            if (res.data.jobsApplied[i].id == props.job._id) {
              setStatus(res.data.jobsApplied[i].status);
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const printSkills = () => {
    let skills = "";
    for (let i = 0; i < applicant.skills.length - 1; i++) {
      skills += applicant.skills[i] + ", ";
    }
    skills += applicant.skills[applicant.skills.length - 1];
    return skills;
  };
  const onReject = () => {
    if (status !== "accepted") {
      const newJob = {
        _id: props.job._id,
        applicant: {
          status: "rejected",
          id: applicant._id,
        },
      };
      axios
        .post("https://jobsgram.herokuapp.com/api/jobs/updateStatus", newJob)
        .then((res) => {
          setStatus("rejected");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const onClick = () => {
    if (status === "applied") {
      const newJob = {
        _id: props.job._id,
        applicant: {
          status: "shortlisted",
          id: applicant._id,
        },
      };
      axios
        .post("https://jobsgram.herokuapp.com/api/jobs/updateStatus", newJob)
        .then((res) => {
          console.log(res.data);
          setStatus("shortlisted");
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (status === "shortlisted") {
      const newJob = {
        _id: props.job._id,
        applicant: {
          status: "accepted",
          id: applicant._id,
          dateOfJoining: new Date(),
        },
      };
      props.checkPostions(newJob);
      setStatus("accepted");
    }
  };
  const download = () => {
    let filename = applicant.resumeName ? applicant.resumeName : "";
    if (filename === "") {
      alert("File not uploaded");
      return;
    }
    const data = {
      filename: filename,
      user: applicant._id,
    };
    axios
      .post("https://jobsgram.herokuapp.com/download", data, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const colors = () => {
    if (status === "applied") {
      return "#ffe087";
    } else if (status === "shortlisted") {
      return "#5c74ec";
    } else {
      return "#00ab66";
    }
  };
  const font = () => {
    if (status === "applied") {
      return "black";
    }
  };
  return status === "rejected" ? null : (
    <div className="card" style={{ minHeight: "200px", minWidth: "80vw" }}>
      <div className="row">
        <div className="col s8">
          <div className="card-content black-text">
            <span
              className="card-title left-align"
              style={{ fontSize: "22px" }}
            >
              <div className="row" style={{ marginBottom: "0.3rem" }}>
                <div className="col">
                  <b>Name:</b>&nbsp; {applicant.name}{" "}
                </div>
                <div
                  className="box flex"
                  style={{ paddingBottom: "0.5rem", paddingTop: "0.5rem" }}
                >
                  {[1, 2, 3, 4, 5].map((index) => {
                    var fill;
                    if (index <= applicant.rating) fill = "yellow";
                    else fill = "none";
                    return <StarIcon key={index} fill={fill} />;
                  })}
                </div>
              </div>
            </span>

            <p className="left-align" style={sty}>
              <b>Skills:</b> &nbsp;
              {applicant.skills.length ? printSkills(applicant.skills) : null}
            </p>
            <p className="left-align" style={sty}>
              <b>Date of Application:</b> &nbsp;
              {moment(props.applicant.dateOfApplication).format("ll")}
            </p>
            <p className="left-align" style={sty}>
              <b>SOP:</b> &nbsp;{props.applicant.sop}
            </p>
            <p className="left-align" style={sty}>
              <b>Education:</b> &nbsp;
              {applicant.education.map((education) => {
                return (
                  <span key={education._id}>
                    {education.institutionName} ({education.startYear}-
                    {education.endYear})
                    <br />
                  </span>
                );
              })}
            </p>
            <div className="left-align" style={{ marginTop: "0.8rem" }}>
              <Button
                style={{ marginLeft: "2rem" }}
                color="primary"
                className="btn btn-small"
                onClick={(e) => {
                  download();
                }}
              >
                <i className="material-icons">arrow_downward</i>
                Resume
              </Button>
            </div>
          </div>
        </div>
        <div className="col s1" style={{ height: "200px", display: "grid" }}>
          <button
            className="waves-effect waves-light btn-large button"
            onClick={onClick}
            disabled={props.disabled}
            style={{ margin: "auto", backgroundColor: colors(), color: font() }}
          >
            {status === "applied"
              ? "SHORTLIST"
              : status === "shortlisted"
              ? "ACCEPT"
              : "ACCEPTED"}
          </button>
        </div>
        {status === "accepted" ? null : (
          <div className="col s3" style={{ height: "200px", display: "grid" }}>
            <button
              className="waves-effect waves-light btn-large button"
              onClick={onReject}
              style={{ margin: "auto", backgroundColor: "#CA0B00" }}
            >
              REJECT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const sty = {
  padding: "0.3rem 0",
};
