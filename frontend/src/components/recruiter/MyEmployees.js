import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Employee from "./Employee";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function MyEmployees(props) {
  const user = props.user;
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState({ choice: "name", asc: "1" });
  const classes = useStyles();

  useEffect(() => {
    let isMounted = true;
    axios
      .post("https://jobsgram.herokuapp.com/api/recruiter", user)
      .then((res) => {
        if (isMounted) {
          var jobs = res.data.jobsCreated;
          var employeeList = [];
          for (let i = 0; i < jobs.length; i++) {
            for (let j = 0; j < jobs[i].applicants.length; j++) {
              if (jobs[i].applicants[j].status === "accepted") {
                employeeList.push({
                  name: jobs[i].applicants[j].id.name,
                  userId: jobs[i].applicants[j].id._id,
                  dateOfJoining: jobs[i].applicants[j].dateOfJoining,
                  typeOfJob: jobs[i].typeOfJob,
                  title: jobs[i].title,
                  rating: jobs[i].applicants[j].id.rating,
                });
              }
            }
          }
          setEmployees(employeeList);
          console.log(employeeList);
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
    <>
      <div className="row" style={{ width: "500px", marginTop: "2rem" }}>
        <div className="col s10 offset-s1">
          <h4 className="grey-text text-darken-4 header left-align">
            <b>Employees</b> hired by you
          </h4>
        </div>
      </div>
      <div
        className="row center-align"
        style={{ marginBottom: "1.6rem", minWidth: "80vw" }}
      >
        <div className="col s12 center-align">
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
              <MenuItem value="title">Job Title</MenuItem>
              <MenuItem value="dateOfJoining">Joining Date</MenuItem>
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
      </div>
      {employees
        .sort((employees1, employees2) => {
          if (filter.choice === "dateOfJoining")
            return (
              (new Date(employees1["dateOfJoining"]) -
                new Date(employees2["dateOfJoining"])) *
              parseInt(filter.asc)
            );
          else if (filter.choice === "name" || filter.choice === "title") {
            if (employees1[filter.choice]) {
              return (
                employees1[filter.choice]
                  .split(" ")[0]
                  .localeCompare(employees2[filter.choice].split(" ")[0]) *
                parseInt(filter.asc)
              );
            } else return false;
          } else {
            return (
              (employees1.rating - employees2.rating) * parseInt(filter.asc)
            );
          }
        })
        .map((employee, i, employees) => {
          if (i % 3 == 0) {
            return (
              <div
                className="row"
                key={employees[i].userId}
                style={{ display: "flex" }}
              >
                <div className="col s4">
                  <Employee employee={employees[i]} />
                </div>
                <div className="col s4">
                  {employees[i + 1] ? (
                    <Employee employee={employees[i + 1]} />
                  ) : null}
                </div>
                <div className="col s4">
                  {employees[i + 2] ? (
                    <Employee employee={employees[i + 2]} />
                  ) : null}
                </div>
              </div>
            );
          }
        })}
    </>
  );
}
const sty = {
  width: "120px",
  display: "inline-block",
};
