import Header from "../fragments/Header";
import { useState, useContext, useEffect } from "react";
import { AdaptiveCard } from "adaptivecards-react";
import axios from "axios";
import { useNavigate } from "react-router";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import AuthContext from "../context/AuthContext";
import * as React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddQna() {
  var card = {
    type: "AdaptiveCard",
    version: "1.0",
    body: [
      {
        type: "TextBlock",
        text: "Please click 'Update' after the changes are made",
      },
    ],
  };
  let adaptiveAnswer = sessionStorage.getItem("changedAddcard")
    ? (sessionStorage.getItem("changedAddcard") as string)
    : JSON.stringify(card);
  let { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [error, setError] = useState(false);
  let data: any = [];
  const [loading, setLoading] = useState(true);
  // CHECK WHETHER THERE MIGHT BE ANSWER OR QUESTION IN THE SESSION STORAGE
  const [fields, setFields] = useState<any>(() =>
    sessionStorage.getItem("questions")
      ? JSON.parse(sessionStorage.getItem("questions") as string)
      : [{ value: "" }]
  );
  const [carousel, setCarousel] = useState(() =>
    sessionStorage.getItem("carousel")
      ? JSON.parse(sessionStorage.getItem("carousel") as string)
      : [{ value: JSON.stringify(card) }]
  );
  const [selectedValue, setSelectedValue] = useState(() =>
    sessionStorage.getItem("selectedValue")
      ? sessionStorage.getItem("selectedValue")
      : ""
  );
  let answer = "";
  const index = sessionStorage.getItem("index")
    ? parseInt(sessionStorage.getItem("index") as string) + 1
    : 0;

  // HANDLES ERROR SNACKBAR

  const handleErrorClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setErrorOpen(false);
  };
  //  HANDLES CHANGE
  function handleChange(i: any, event: any) {
    const values = [...fields];
    values[i].value = event.target.value;
    setFields(values);
  }

  const handleSelect = (value: any) => {
    setSelectedValue(value);
  };
  function handleAdd() {
    const values = [...fields];
    values.push({ value: "" });
    setFields(values);
  }

  function handleRemove(i: any) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  }
  // adds carousel
  function carouselAdd() {
    const values = [...carousel];
    values.push({ value: JSON.stringify(card) });
    setCarousel(values);
  }
  // removes the carousel
  function carouselRemove(i: any) {
    const values = [...carousel];
    values.splice(i, 1);
    setCarousel(values);
  }
  // adaptive card config
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

  // handles carousel answer converts into string format
  const handleCarouselAnswer = () => {
    let a = [];
    let b: string = "";
    for (let i = 0; i < carousel.length; i++) {
      a.push(carousel[i].value);
      b = a.join("/??/");
    }
    return b;
  };
  // Handles Answer checks whether its
  function handleAnswer() {
    if (selectedValue === "option1") {
      answer = adaptiveAnswer;
      //   setAnswer(JSON.stringify(card))
    } else if (selectedValue === "option2") {
      answer = handleCarouselAnswer();
    }
    // console.log(answer);
  }
  function handleData() {
    handleAnswer();
    setError(false);
    for (let i = 0; i < fields.length; i++) {
      fields[i].value === "" ? setErrorOpen(true) : console.log(false);
      if (!fields[i].value) {
        setErrorOpen(true);
      }
    }
    if (!error) {
      // console.log(error);
      if (answer !== "") {
        for (let i = 0; i < fields.length; i++) {
          let header = {
            index: index,
            question: fields[i].value,
            answer: answer,
          };
          data.push(header);
        }
        // data.map((d: any) => console.log(d));
        if (!error) {
          sessionStorage.removeItem("changedAddcard");
          // console.log(carousel);
          // console.log(data);
          axios
            .post(`${process.env.REACT_APP_API_URL}/add`, {
              userID: user,
              data: data,
            })
            .then((res) => {
              if ((res.status = 200)) {
                sessionStorage.setItem("add", "true");
                navigate("/dashboard");
              }
            })
            .catch((err) => console.log(err));
        } else {
          setErrorOpen(true);
        }
      } else {
        setErrorOpen(true);
      }
    }
  }
  function checkCarouselAnswer() {
    if (sessionStorage.getItem("changedAddcard")) {
      if (sessionStorage.getItem("carouselIndex")) {
        let newIndex = parseInt(
          sessionStorage.getItem("carouselIndex") as string
        );
        // console.log(carousel[newIndex]);

        carousel[newIndex].value = sessionStorage.getItem("changedAddcard")
          ? (sessionStorage.getItem("changedAddcard") as string)
          : JSON.stringify(card);
        sessionStorage.setItem("carousel", JSON.stringify(carousel));
      }
      adaptiveAnswer = sessionStorage.getItem("changedAddcard") as string;

      // sessionStorage.removeItem("changedAddcard");
    }
    sessionStorage.removeItem("carousel");
    sessionStorage.removeItem("carouselIndex");
    sessionStorage.removeItem("questions");
    // sessionStorage.removeItem("changedAddcard");
    sessionStorage.removeItem("selectedValue");
    setLoading(false);
  }
  useEffect(() => {
    checkCarouselAnswer();
  });
  return (
    <div>
      <Header />
      {loading ? (
        <h1 className="text text-center">Loading...</h1>
      ) : (
        <div className="container" style={{ marginTop: "5%" }}>
          <div></div>
          <div className="d-flex justify-content-center p-2 mt-2">
            <h1 className="text">Add QnA</h1>
          </div>
          <div
            className="row"
            style={{ backgroundColor: "white", borderRadius: "20px" }}
          >
            <div
              className="col-lg-6"
              style={{ padding: "20px", borderRadius: "20px" }}
            >
              {fields.map((field: any, index: number) => (
                <div className="mb-3" key={index}>
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Question {index + 1}
                  </label>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputEmail1"
                      placeholder="Enter a value"
                      value={field.value}
                      onChange={(event) => {
                        handleChange(index, event);
                      }}
                    />
                    {fields.length === 1 ? (
                      <div></div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => handleRemove(index)}
                      >
                        <b>-</b>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAdd()}
                className="btn btn-success"
                style={{ width: "100%" }}
              >
                Add Question
              </button>
            </div>
            <div
              className="col-lg-6"
              style={{ borderRadius: "20px", padding: "20px" }}
            >
              <label className="form-label">Choose Answer type</label>
              <select
                value={selectedValue as string}
                onChange={(event) => handleSelect(event.target.value)}
                className="form-control"
              >
                <option value="">Select an option</option>
                <option value="option1">Adaptive Card</option>
                <option value="option2">Carousel</option>
                <option value="option3">Text</option>
              </select>

              {selectedValue === "option1" ? (
                <div className="mt-2">
                  <AdaptiveCard
                    hostConfig={hostConfig}
                    payload={JSON.parse(adaptiveAnswer as string)}
                  />
                  <div className="mt-2">
                    <button
                      className="btn btn-warning"
                      style={{ width: "100%" }}
                      onClick={() => {
                        sessionStorage.setItem("editAddCard", adaptiveAnswer);
                        sessionStorage.setItem("selectedValue", "option1");
                        sessionStorage.setItem(
                          "questions",
                          JSON.stringify(fields)
                        );
                        navigate(`/adaptive-desginer`);
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ) : null}
              {selectedValue === "option2" ? (
                <div>
                  {carousel.map((field: any, index: number) => (
                    <div className="mb-3" key={index}>
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Carousel {index + 1}
                      </label>
                      <div
                        className="mt-2"
                        style={{ border: "2px solid black" }}
                      >
                        <AdaptiveCard
                          hostConfig={hostConfig}
                          payload={JSON.parse(field.value)}
                        />
                      </div>
                      <div className="mt-2">
                        <button
                          className="btn btn-warning"
                          style={{ width: "100%" }}
                          onClick={() => {
                            sessionStorage.setItem("editAddCard", field.value);
                            sessionStorage.setItem(
                              "carousel",
                              JSON.stringify(carousel)
                            );

                            sessionStorage.setItem("selectedValue", "option2");
                            sessionStorage.setItem(
                              "carouselIndex",
                              JSON.stringify(index)
                            );
                            sessionStorage.setItem(
                              "questions",
                              JSON.stringify(fields)
                            );
                            navigate(`/adaptive-desginer`);
                          }}
                        >
                          Edit
                        </button>
                      </div>

                      {carousel.length === 1 ? (
                        <div></div>
                      ) : (
                        <div className="mt-2">
                          <button
                            type="button"
                            className="btn btn-danger"
                            style={{ width: "100%" }}
                            onClick={() => carouselRemove(index)}
                          >
                            Remove Card
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => carouselAdd()}
                    className="btn btn-success"
                  >
                    Add Card
                  </button>
                  {/* <button onClick={handleAnswer}>show</button> */}
                </div>
              ) : null}
              {selectedValue === "option3" ? (
                <div className="mt-2">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Enter Answer
                  </label>
                  <textarea
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows={3}
                    onChange={(event) => (answer = event.target.value)}
                  ></textarea>
                </div>
              ) : null}
            </div>
          </div>

          <div className="d-flex justify-content-center p-2 mt-2">
            <button className="btn btn-primary" onClick={handleData}>
              Add QnA
            </button>
          </div>
        </div>
      )}

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
          Question or Answer Cannot be blank
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AddQna;
