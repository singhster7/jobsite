# JOBSGRAM
Job Portal for finding and listing job opportunity

# Setup and Running 

* Get the backend sever running

```bash
    cd backend
    npm install
    npm start
```

* Start the front end
  *  Open a new terminal

```bash
    cd frontend
    npm install
    npm start
```

CAUTION : If the ports are already being used by some other processes, they must be killed before running the above script
* If backend port is in use
```bash
    sudo fuser -k 5000/tcp
```
* If frontend port is in use
``` 
    sudo fuser -k 3000/tcp
```

Your App should be up and running on http://localhost:3000/

# Features (Summary)

* Supports two types of users - Applicants and Recruiters

## Applicant
* View all job listings
* Apply for Jobs
* Rate Jobs they are accepted into
* Upload Resume and Profile Pic

## Recruiter
* List out jobs
* Select applicants
* Rate employees
* Delete/Edit Jobs
* Auto send acceptance mail