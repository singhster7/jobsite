import React, { useState, useEffect } from "react";
import axios from "axios";
import Application from "./Application";
export default function MyApplication(props) {
  const user = props.user;
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    let isMounted = true;
    axios
      .post("https://jobsgram.herokuapp.com/api/applicant", user)
      .then((res) => {
        if (isMounted) {
          console.log(res.data);
          var jobs = res.data.jobsApplied;
          var applicationsL = [];
          for (let i = 0; i < jobs.length; i++) {
            if (jobs[i].id) {
              for (let j = 0; j < jobs[i].id.applicants.length; j++) {
                if (jobs[i].id.applicants[j].id === props.user._id) {
                  applicationsL.push({
                    userId: props.user._id,
                    title: jobs[i].id.title,
                    recruiterName: jobs[i].id.recruiterName,
                    dateOfJoining: jobs[i].id.applicants[j].dateOfJoining,
                    salary: jobs[i].id.salary,
                    rating: jobs[i].id.applicants[j].rating,
                    id: jobs[i].id,
                    status: jobs[i].id.applicants[j].status,
                  });
                }
              }
            }
          }
          console.log(applicationsL);
          setApplications(applicationsL);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <React.Fragment>
      <div className="row" style={{ width: "80vw", marginTop: "2rem" }}>
        <div className="col s10 offset-s1">
          <h4 className="grey-text text-darken-4 header left-align ">
            Your <b>APPLICATIONS</b>
          </h4>
        </div>
      </div>

      {applications.map((application, i, applications) => {
        if (i % 3 === 0) {
          return (
            <div
              className="row"
              key={applications[i].userId}
              style={{ display: "flex" }}
            >
              <div className="col s4">
                <Application application={applications[i]} />
              </div>
              <div className="col s4">
                {applications[i + 1] ? (
                  <Application application={applications[i + 1]} />
                ) : null}
              </div>
              <div className="col s4">
                {applications[i + 2] ? (
                  <Application application={applications[i + 2]} />
                ) : null}
              </div>
            </div>
          );
        }
      })}
    </React.Fragment>
  );
}
