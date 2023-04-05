import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Header() {
  let { user, logoutUser } = useContext(AuthContext);

  const [open, setOpen] = React.useState(false);
  const [trainingOpen, setTrainingOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleErrorClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setErrorOpen(false);
  };

  const handleTrainingClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setTrainingOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleTrainingClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  function upload(userID: string) {
    setTrainingOpen(true);
    axios
      .post(`${process.env.REACT_APP_API_URL}/upload`, {
        userID: userID,
      })
      .then((res) => {
        if (res.status === 200) {
          // console.log(userID.toLowerCase());
          axios
            .get(
              `${process.env.REACT_APP_TRAIN_URL}/train/${userID.toLowerCase()}`
            )
            .then((res) => {
              if (res.status === 202) {
                setOpen(true);
              }
            })
            .catch((err) => {
              setErrorOpen(true);
              console.log(err);
            });
        } else {
          setErrorOpen(true);
          // alert("Something went wrong");
        }
      })
      .catch((err) => {
        setErrorOpen(true);
        // alert("Something went wrong");
        console.log(err);
      });
  }
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          style={{ backgroundColor: "#740080", zIndex: "999999999" }}
        >
          <Toolbar variant="dense">
            <Typography
              variant="h5"
              color="inherit"
              component="div"
              sx={{ flexGrow: 1 }}
              style={{ padding: "5px" }}
            >
              <Link
                to="/dashboard"
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "20px",
                }}
                onClick={() => {
                  document.documentElement.scrollTop = 0;
                }}
              >
                <img
                  src={`${process.env.REACT_APP_LOCAL_URL}/assets/images/logo.png`}
                  alt="Noavcept Logo"
                  width={200}
                />
              </Link>
            </Typography>
            <Link
              to="/search"
              style={{ color: "white", textDecoration: "none" }}
            >
              <Button color="inherit">Search</Button>
            </Link>
            <Link to="/add" style={{ color: "white", textDecoration: "none" }}>
              <Button color="inherit">Add</Button>
            </Link>
            <Button color="inherit" onClick={() => upload(user)}>
              Train
            </Button>
            <Button color="inherit" onClick={logoutUser}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Trained Sucessfully!!!
        </Alert>
      </Snackbar>
      <Snackbar
        open={trainingOpen}
        autoHideDuration={6000}
        onClose={handleTrainingClose}
        message="Trainig The Bot"
        action={action}
      />
      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert
          onClose={handleErrorClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Sometheing went wrong!!!
        </Alert>
      </Snackbar>
    </>
  );
}
