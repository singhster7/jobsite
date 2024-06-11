import React, { useState, useEffect } from "react";
import axios from "axios";
import Job from "./Job";

export default function JobListings(props) {
  const user = props.user;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (props) {
      axios
        .post("https://jobsgram.herokuapp.com/api/recruiter", user)
        .then((res) => {
          if (isMounted) {
            setJobs(res.data.jobsCreated);
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
  const onDeleted = (deletej) => {
    axios
      .post("https://jobsgram.herokuapp.com/api/jobs/delete", deletej)
      .then((res) => {
        axios
          .post("https://jobsgram.herokuapp.com/api/recruiter", user)
          .then((res) => {
            setJobs(res.data.jobsCreated);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <div>
        <h4
          className="grey-text text-darken-4 header left-align"
          style={{ margin: "3rem" }}
        >
          <b>Jobs Listed</b> by you
        </h4>
        {jobs
          .filter((job) => {
            let positionsLeft = job.positions;
            if (job.applicants) {
              job.applicants.forEach((applicant) => {
                if (applicant.status === "accepted") {
                  positionsLeft--;
                }
              });
            }
            return positionsLeft;
          })
          .map((job, i, jobs) => {
            if (i % 2 == 0) {
              return (
                <div
                  className="row"
                  key={jobs[i]._id}
                  style={{ display: "flex" }}
                >
                  <div className="col s6">
                    <Job
                      user={user}
                      job={jobs[i]}
                      history={props.history}
                      onDeleted={onDeleted}
                    />
                  </div>

                  <div className="col s6">
                    {jobs[i + 1] ? (
                      <Job
                        user={user}
                        job={jobs[i + 1]}
                        history={props.history}
                        onDeleted={onDeleted}
                      />
                    ) : null}
                  </div>
                </div>
              );
            }
          })}
      </div>
    </>
  );
}
