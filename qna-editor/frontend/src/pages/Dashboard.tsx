import Header from "../fragments/Header";
import * as React from "react";
import axios from "axios";
import { useEffect, useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import ReactPaginate from "react-paginate";
import { AdaptiveCard } from "adaptivecards-react";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Carousel from "react-material-ui-carousel";
import Swal from "sweetalert2";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Dashboard() {
  let { user } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);

  const [errorOpen, setErrorOpen] = React.useState(false);

  const [data, setData] = useState(() =>
    sessionStorage.getItem("data")
      ? JSON.parse(sessionStorage.getItem("data") as string)
      : []
  );
  const [count, setCount] = useState(() =>
    data.totalCount ? data.totalCount : 0
  );
  const [loading, setloading] = useState(true);
  const totalPage = Math.ceil(count / 10);
  let id = sessionStorage.getItem("pageNumber")
    ? parseInt(sessionStorage.getItem("pageNumber") as string)
    : 1;

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleUpdateClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setUpdateOpen(false);
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
  function getData(userID: string, pageNumber: number, limit: number) {
    axios
      .post(`${process.env.REACT_APP_API_URL}/data`, {
        userID: userID,
        pageNumber: pageNumber,
        limit: limit,
      })
      .then((res) => {
        if (res.status) {
          setData(res.data);
          if (res.data.totalCount) {
            setCount(res.data.totalCount);
          }
          if (res.data.lastIndex) {
            sessionStorage.setItem("index", res.data.lastIndex);
          }
          // console.log(data.totalCount);
          setloading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function del(id: number, userID: string, pageNum: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "This operation cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed",
    }).then((result) => {
      if (result.isConfirmed) {
        // user confirmed operation, proceed with it
        axios
          .post(`${process.env.REACT_APP_API_URL}/delete`, {
            userID: userID,
            id: id,
          })
          .then((res) => {
            if (res.status === 200) {
              // alert("Deleted Successully");
              getData(user, pageNum, 10);
              setErrorOpen(true);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
  function removeDuplicates(dataArray: any) {
    return [...new Set(dataArray)];
  }
  // Handles data
  function handleData(data: any) {
    let index: any = [];
    let question: any = [];
    let answer: any = [];
    data.result.map((d: any) => {
      index.push(d.index);
      question.push(d.question);
      answer.push(d.answer);
      return <></>;
    });
    const finalIndex = removeDuplicates(index);
    const finalAnswer: any = removeDuplicates(answer);
    return (
      <table className="table table-bordered table-hover">
        <thead
          className="thead-dark"
          style={{ position: "sticky", top: "0", zIndex: "88888" }}
        >
          <tr>
            <th scope="col" style={{ width: "5%" }}>
              #
            </th>
            <th scope="col" style={{ width: "20%" }}>
              Questions
            </th>
            <th scope="col" style={{ width: "55%" }}>
              Answers
            </th>
            <th scope="col" style={{ width: "20%" }}>
              Operations
            </th>
          </tr>
        </thead>
        <tbody>
          {finalIndex.map((q: any, key: number) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>
                <>{handleQuestion(data, parseInt(q))}</>
              </td>
              <td>{handleAnswer(finalAnswer[key])}</td>
              <td>
                <div className="d-flex ">
                  <Link to={"/update/" + q}>
                    <button className="btn btn-warning">
                      <EditIcon style={{ color: "white" }} />
                    </button>
                  </Link>
                  <button
                    className="btn btn-danger"
                    onClick={() => del(q, user, id)}
                    style={{ marginLeft: "8%" }}
                  >
                    <DeleteForeverIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  // handles pagination
  const handlePageClick = (data: any) => {
    id = data.selected + 1;
    sessionStorage.setItem("pageNumber", JSON.stringify(id));
    // console.log("id =======" + id);
    getData(user, id, 10);
    document.documentElement.scrollTop = 0;
  };

  var hostConfig = {
    hostCapabilities: {},
    choiceSetInputValueSeparator: ",",
    supportsInteractivity: true,
    spacing: {
      small: 3,
      default: 8,
      medium: 20,
      large: 30,
      extraLarge: 40,
      padding: 10,
    },
    separator: { lineThickness: 1, lineColor: "#EEEEEE" },
    imageSizes: { small: 40, medium: 80, large: 160 },
    containerStyles: {
      default: {
        foregroundColors: {
          default: {
            default: "#7c73e6",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          dark: {
            default: "#ffffff",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          light: {
            default: "#ffffff",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          accent: {
            default: "#FF0000",
            subtle: "#929596",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          good: {
            default: "#ffffff",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          warning: {
            default: "#ffffff",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          attention: {
            default: "#FF0000",
            subtle: "#DD0000",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
        },
        backgroundColor: "#eaf6fb;",
      },
      emphasis: {
        foregroundColors: {
          default: {
            default: "#FF0000",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          dark: {
            default: "#ffffff",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          light: {
            default: "#ffffff",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          accent: {
            default: "#7D3B4C",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          good: {
            default: "#ffffff",
            subtle: "#ffffff",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          warning: {
            default: "#ffffff",
            subtle: "#DDc3ab23",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
          attention: {
            default: "#ffffff",
            subtle: "#DDFF0000",
            highlightColors: { default: "#22000000", subtle: "#11000000" },
          },
        },
        backgroundColor: "#521b5f",
      },
    },
    actions: {
      maxActions: 100,
      spacing: "Default",
      buttonSpacing: 8,
      showCard: {
        actionMode: "Inline",
        inlineTopMargin: 8,
        style: "emphasis",
      },
      preExpandSingleShowCardAction: false,
      actionsOrientation: "Vertical",
      actionAlignment: "Stretch",
    },
    adaptiveCard: { allowCustomStyle: false },
    imageSet: { maxImageHeight: 100 },
    media: { allowInlinePlayback: true },
    factSet: {
      title: {
        size: "Default",
        color: "Default",
        isSubtle: false,
        weight: "Bolder",
        wrap: true,
      },
      value: {
        size: "Default",
        color: "Default",
        isSubtle: false,
        weight: "Default",
        wrap: true,
      },
      spacing: 8,
    },
    alwaysAllowBleed: false,
    _legacyFontType: {
      fontFamily: "NovaBotFont",
      fontSizes: {
        small: 12,
        default: 14,
        medium: 17,
        large: 21,
        extraLarge: 26,
      },
      fontWeights: { lighter: 200, default: 400, bolder: 600 },
    },
    fontTypes: {
      default: {
        fontFamily: "NovaBotFont",
        fontSizes: {
          small: 12,
          default: 14,
          medium: 17,
          large: 21,
          extraLarge: 26,
        },
        fontWeights: { lighter: 200, default: 400, bolder: 600 },
      },
      monospace: {
        fontFamily: "NovaBotFont",
        fontSizes: {
          small: 12,
          default: 14,
          medium: 17,
          large: 21,
          extraLarge: 26,
        },
        fontWeights: { lighter: 200, default: 400, bolder: 600 },
      },
    },
  };
  // handle answer
  function handleAnswer(answer: string) {
    // try catch block to handle json parse error
    try {
      // checks adaptive card
      if (answer.includes("AdaptiveCard")) {
        // checks carousel
        if (answer.includes("/??/")) {
          const carousel = answer.split("/??/");
          return (
            <Carousel>
              {carousel.map((data, key: number) => (
                <div className="row" key={key}>
                  <div className="col">
                    <AdaptiveCard
                      hostConfig={hostConfig}
                      payload={JSON.parse(data)}
                    />
                  </div>
                </div>
              ))}
            </Carousel>
          );
        } else {
          return (
            <AdaptiveCard
              payload={JSON.parse(answer)}
              hostConfig={hostConfig}
            />
          );
        }
      } else {
        return <h6 style={{ fontWeight: "bold" }}>{answer}</h6>;
      }
    } catch (error) {
      return <span>Wrong JSON</span>;
    }
  }
  // handle question
  function handleQuestion(dat: any, indx: number) {
    let question: any = [];
    //  filters the data on the basis of index
    dat.result.map((da: any, key: number) => {
      let i = da.index;
      if (parseInt(i) === indx) {
        question.push(da.question);
      }
      return <></>;
    });
    if (question.length === 1) {
      return question.map((data: any, key: number) => (
        <span key={key} style={{ marginLeft: "3%" }}>
          {data}
        </span>
      ));
    } else {
      let firstQuestion = "";
      for (let i = 0; i < question.length; i++) {
        firstQuestion = question[i];
        break;
      }
      question.shift();
      return (
        <div>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{firstQuestion}</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ overflow: "auto", height: "150px" }}>
              {question.map((data: any, key: number) => {
                return (
                  <div key={key}>
                    <span className="text " style={{ padding: "10px" }}>
                      {data}
                    </span>{" "}
                    <br />
                  </div>
                );
              })}
            </AccordionDetails>
          </Accordion>
        </div>
      );
    }
    // console.log(question);
  }
  function checkAdd() {
    if (sessionStorage.getItem("add")) {
      setOpen(true);
      sessionStorage.removeItem("add");
    }
  }
  function checkUpdate() {
    if (sessionStorage.getItem("update")) {
      setUpdateOpen(true);
      sessionStorage.removeItem("update");
    }
  }
  function checkDelete() {
    if (sessionStorage.getItem("delete")) {
      setErrorOpen(true);
      sessionStorage.removeItem("delete");
    }
  }
  useEffect(() => {
    getData(user, id, 10);
    checkAdd();
    checkUpdate();
    checkDelete();
  }, [user, id]);
  if (loading) {
    return (
      <>
        <Header />
        <h1>Loading</h1>
      </>
    );
  } else {
    return (
      <>
        <Header />
        <div className="container-fluid" style={{ marginTop: "4.5%" }}>
          <div style={{ marginTop: "" }}>
            <div style={{ overflow: "auto", height: "38rem" }}>
              {handleData(data)}
            </div>
          </div>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "0.5%" }}
          >
            <ReactPaginate
              breakLabel="..."
              nextLabel="->"
              onPageChange={handlePageClick}
              pageRangeDisplayed={10}
              pageCount={totalPage}
              previousLabel="<-"
              containerClassName="pagination modal1"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              activeClassName="active"
              initialPage={id - 1}
            />
          </div>
        </div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Added Sucessfully!!!
          </Alert>
        </Snackbar>
        <Snackbar
          open={updateOpen}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleUpdateClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Updated Sucessfully!!!
          </Alert>
        </Snackbar>
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
            Deleted Sucessfully!!!
          </Alert>
        </Snackbar>
      </>
    );
  }
}

export default Dashboard;
