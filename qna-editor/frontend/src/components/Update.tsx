import Header from "../fragments/Header";
import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdaptiveCard } from "adaptivecards-react";
import AuthContext from "../context/AuthContext";
import Carousel from "react-material-ui-carousel";
function Update() {
  const params = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  let { user } = useContext(AuthContext);
  const id = parseInt(params.id as string);

  // ADDS QUESTION
  function addQuestion() {
    const values = [...data];
    // console.log(data[0].answer);
    values.push({ index: id.toString(), question: "", answer: data[0].answer });
    setData(values);
    // handleData(data);
  }
  // REMOVES DUPLICATES FROM AN ARRAY
  function removeDuplicates(dataArray: any) {
    return [...new Set(dataArray)];
  }

  // HANDLES THE DATA
  function handleData(data: any) {
    let index: any = [];
    let answer: any = [];
    data.map((d: any) => {
      index.push(d.index);
      if (sessionStorage.getItem("changedcard")) {
        if (d.answer.includes("/??/")) {
          if (sessionStorage.getItem("index")) {
            const a = d.answer.split("/??/");
            a[parseInt(sessionStorage.getItem("index") as string)] =
              sessionStorage.getItem("changedcard");
            const b = a.join("/??/");
            d.answer = b;
            answer.push(d.answer);
          }
        } else {
          d.answer = sessionStorage.getItem("changedcard");
          answer.push(d.answer);
        }
      } else {
        answer.push(d.answer);
      }
      return <></>;
    });
    const finalIndex = removeDuplicates(index);
    const finalAnswer: any = removeDuplicates(answer);
    // console.log(finalIndex);
    return (
      <div style={{ marginBottom: "2%" }}>
        <table className="table">
          <thead
            className="thead-dark"
            style={{ position: "sticky", top: "0", zIndex: "88888" }}
          >
            <tr>
              <th scope="col" style={{ width: "5%" }}>
                #
              </th>
              <th scope="col" style={{ width: "30%" }}>
                Questions
              </th>
              <th scope="col" style={{ width: "45%" }}>
                Answers
              </th>
            </tr>
          </thead>
          <tbody>
            {finalIndex.map((q: any, key: number) => (
              <tr>
                <td>{q}</td>
                <td>
                  <>{handleQuestion(data)}</>
                </td>
                <td>{handleAnswer(finalAnswer[key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  //CALLS THE UPLOAD API
  function modifyUpload(data: any, id: number) {
    sessionStorage.removeItem("changedcard");
    sessionStorage.removeItem("index");
    let newData: any = [];
    data.map((d: any, key: number) => {
      if (d.question) {
        newData.push(d);
      }
      return null;
    });
    // console.log(dab);
    axios
      .post(`${process.env.REACT_APP_API_URL}/modify`, {
        userID: user,
        id: id,
        data: newData,
      })
      .then((res) => {
        if ((res.status = 200)) {
          sessionStorage.setItem("update", "true");
          navigate("/dashboard");
        }
      })
      .catch((err) => console.log(err));
  }
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
  //REMOVE ANSWER
  function handleRemove(i: any) {
    const values = [...data];
    values.splice(i, 1);
    setData(values);
  }

  // HANDLES ANSWER

  function handleAnswer(answer: string) {
    // TRY CATCH BLOCK TO AVOID JSON ERROR
    try {
      //  CHECKS WHETHER ITS ADAPTIVE CARD
      if (answer.includes("AdaptiveCard")) {
        // CHECKS WHETHER ITS CAROUSEL ON THE BASIS
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
                    <button
                      className="btn btn-warning mt-5 mb-5"
                      style={{ width: "30%" }}
                      onClick={() => {
                        sessionStorage.setItem("editcard", data);
                        sessionStorage.setItem("index", String(key));
                        sessionStorage.setItem("id", JSON.stringify(id));
                        navigate(`/adaptive-desginer`);
                      }}
                    >
                      Edit
                    </button>
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
              <div className="mt-5">
                <button
                  className="btn btn-warning"
                  style={{ width: "30%" }}
                  onClick={() => {
                    sessionStorage.setItem("editcard", answer);
                    sessionStorage.setItem("id", JSON.stringify(id));
                    navigate(`/adaptive-desginer`);
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          );
        }
      } else {
        return (
          <div className="mb-3">
            <textarea
              className="form-control"
              defaultValue={answer}
              rows={3}
              onChange={(event) => {
                data.map((item: any) => {
                  item.answer = event.target.value;
                  return null;
                });
              }}
            ></textarea>
          </div>
        );
      }
    } catch (error) {
      return <span>Wrong JSON</span>;
    }
  }

  // Handles Question
  function handleQuestion(dat: any) {
    let questions: any = [];
    return (
      <div>
        {dat.map((da: any, key: number) => {
          questions.push(da.question);
          return (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  defaultValue={da.question}
                  onChange={(event) => {
                    if (event.target.value) {
                      da.question = event.target.value;
                    } else {
                      handleRemove(key);
                    }
                  }}
                />
              </div>
            </>
          );
        })}
        <button
          onClick={() => addQuestion()}
          className="btn btn-success"
          style={{ width: "30%" }}
        >
          Add
        </button>
      </div>
    );
  }

  // To fetch the data

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/update`, {
        userID: user,
        id: id,
      })
      .then((res) => {
        if ((res.status = 200)) {
          //   console.log(res.data);
          setData(res.data.data);
          //   console.log(data);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, [user, id]);

  // To avoid undefined error at run time

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
        <div className="container-fluid" style={{ marginTop: "5%" }}>
          <div style={{ overflow: "auto", height: "550px", zIndex: "88888" }}>
            {handleData(data)}
          </div>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => modifyUpload(data, id)}
              style={{ width: "200px", marginTop: "2%" }}
            >
              <span className="indicator-label">Update</span>
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default Update;
