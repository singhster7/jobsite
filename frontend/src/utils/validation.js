export const handleValidation() {
    let errors = {
      education: [],
    };
    for (let i = 0; i < this.state.education.length; i++) {
      errors.education.push({});
    }
    let formIsValid = true;
    //Name
    if (this.state.name === "") {
      formIsValid = false;
      errors["name"] = "Name cannot be empty";
    }
    //Email
    if (this.state.email === "") {
      formIsValid = false;
      errors["email"] = "Email cannot be empty";
    }
    if (typeof this.state.email !== "undefined") {
      let lastAtPos = this.state.email.lastIndexOf("@");
      let lastDotPos = this.state.email.lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          this.state.email.indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          this.state.email.length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }
    //number
    if (this.state.number === "") {
      formIsValid = false;
      errors["number"] = "Phone Number cannot be empty";
    }
    if (
      (this.state.number.length < 10 || this.state.number.length > 11) &&
      this.state.number.length !== 0
    ) {
      formIsValid = false;
      errors["number"] = "Invalid Phone Number";
    }
    //education
    for (let i = 0; i < this.state.education.length; i++) {
      if (this.state.education[i].institutionName === "") {
        formIsValid = false;
        errors.education[i].institutionName = "Insitution Name cannot be empty";
      }
      if (this.state.education[i].startYear === "") {
        formIsValid = false;
        errors.education[i].startYear = "Start Year cannot be empty";
      }
      if (
        this.state.education[i].startYear < 1900 ||
        this.state.education[i].startYear > 2020
      ) {
        formIsValid = false;
        errors.education[i].startYear = "Invalid Year";
      }
      if (
        this.state.education[i].endYear < 1900 ||
        this.state.education[i].endYear > 3020
      ) {
        formIsValid = false;
        errors.education[i].endYear = "Invalid Year";
      }
      if (
        this.state.education[i].startYear > this.state.education[i].endYear &&
        !this.state.education[i].endYear === ""
      ) {
        formIsValid = false;
        errors.education[i].endYear = "End Year cannot be less than Start Year";
      }
    }
    return [errors, formIsValid];
  }