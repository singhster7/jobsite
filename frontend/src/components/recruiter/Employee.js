import React, { useState, useEffect } from "react";
import moment from "moment";
import RatingIcon from "../../utils/rating";
import axios from "axios";

export default function Employee(props) {
  const employee = props.employee;
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setRating(props.employee.rating);
    }
    return () => {
      isMounted = false;
    };
  }, [props]);

  const onMouseEnter = (index) => {
    setHoverRating(index);
  };
  const onMouseLeave = () => {
    setHoverRating(0);
  };
  const onSaveRating = (index) => {
    const newRating = {
      id: props.employee.userId,
      rating: index,
    };
    axios
      .post(
        "https://jobsgram.herokuapp.com/api/applicant/saveRating",
        newRating
      )
      .then((res) => {
        setRating(index);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="card" style={{ minHeight: "130px", minWidth: "15vw" }}>
      <div className="row " style={{ display: "flex" }}>
        <div className="col s12">
          <div
            className="card-content black-text"
            style={{ paddingRight: "1rem", paddingBottom: "1rem" }}
          >
            <span
              className="card-title left-align"
              style={{ fontSize: "22px" }}
            >
              <b>{employee.name}</b>
            </span>
            <p
              className="left-align"
              style={{ padding: "0.3rem 0", fontSize: "18px" }}
            >
              {employee.title}
              {", "}
              <span style={{ fontSize: "0.9rem" }}>{employee.typeOfJob}</span>
            </p>
            <p className="left-align" style={sty}>
              <span style={{ fontSize: "0.85rem" }}>Joined:</span>&nbsp;
              {moment(employee.dateOfJoining).format("LL")}
            </p>
            <div className="box flex" style={{ paddingTop: "0.7rem" }}>
              {[1, 2, 3, 4, 5].map((index) => {
                return (
                  <RatingIcon
                    key={index}
                    index={index}
                    rating={rating}
                    hoverRating={hoverRating}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    onSaveRating={onSaveRating}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const sty = {
  padding: "0.3rem 0",
};
