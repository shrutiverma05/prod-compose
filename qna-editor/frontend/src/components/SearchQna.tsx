import Header from "../fragments/Header";
import { useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { AdaptiveCard } from "adaptivecards-react";
import Carousel from "react-material-ui-carousel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Swal from "sweetalert2";
import * as React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SearchQna() {
  const [data, setData] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  let { user } = useContext(AuthContext);

  const [errorOpen, setErrorOpen] = React.useState(false);
  const handleErrorClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setErrorOpen(false);
  };

  const navigate = useNavigate();
  function searchQna(value: string, userID: string) {
    axios
      .post(`${process.env.REACT_APP_API_URL}/search`, {
        userID: userID,
        value: value,
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        // alert("Sorry Something Went Wrong");
        setErrorOpen(true);
        console.log(err);
      });
  }

  // REMOVES DUPLICATES FROM AN ARRAY
  function removeDuplicates(dataArray: any) {
    return [...new Set(dataArray)];
  }

  // SHOWS CONFIRMATION MESSAGE ON DELETE
  function del(id: number, userID: string) {
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
              sessionStorage.setItem("delete", "true");
              navigate("/dashboard");
            }
          })
          .catch((err) => {
            setErrorOpen(true);
            console.log(err);
          });
      }
    });
  }
  //  FUNCTION TO HANDLE DATA AND DISPLAY
  function handleData(data: any) {
    let index: any = [];
    let question: any = [];
    let answer: any = [];
    data.data.map((d: any) => {
      index.push(d.index);
      question.push(d.question);
      answer.push(d.answer);
      return <></>;
    });
    const finalIndex = removeDuplicates(index);
    const finalAnswer: any = removeDuplicates(answer);
    if (finalIndex.length === 0) {
      return <h2 className="text text-center mt-2">No results found!</h2>;
    } else {
      return (
        <table className="table table-bordered table-hover ">
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
                      onClick={() => del(q, user)}
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
  }
  // ADAPTIVE CARD CONFIG
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
    adaptiveCard: { allowCustomStyle: true },
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
  // HANDLES ANSWER
  function handleAnswer(answer: string) {
    // TRY CATCH BLOCK TO AVOID JSON PARSE ERROR
    try {
      // CHECKS ADAPTIIVE CARD
      if (answer.includes("AdaptiveCard")) {
        // CHECKS CAROUSEL ON THE BASIS PF /??/
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
            <div>
              <AdaptiveCard
                payload={JSON.parse(answer)}
                hostConfig={hostConfig}
              />
            </div>
          );
        }
      } else {
        return <span>{answer}</span>;
      }
    } catch (error) {
      return <span>Wrong JSON</span>;
    }
  }
  // HANDLES QUESTION
  function handleQuestion(dat: any, indx: number) {
    let question: any = [];
    dat.data.map((da: any, key: number) => {
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
  return (
    <>
      <Header />
      <div className="container-fluid mt-5">
        <div className="container">
          <div className="d-flex justify-content-center">
            <h1 className="text text-centre">Search</h1>
          </div>
          <div className="container">
            <div className="d-flex justify-content-center">
              <input
                type="text"
                className="form-control"
                placeholder="Enter question or keywords of the question you want to search"
                style={{ width: "60%" }}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => searchQna(searchValue, user)}
                style={{ marginLeft: "1%" }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="mt-5" style={{ overflow: "auto", height: "38rem" }}>
          {loading ? <div></div> : handleData(data)}
        </div>
      </div>
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
          Something Went Wrong!!!
        </Alert>
      </Snackbar>
    </>
  );
}

export default SearchQna;
