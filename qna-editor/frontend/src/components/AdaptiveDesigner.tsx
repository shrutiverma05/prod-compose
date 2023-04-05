import { useEffect } from "react";
import { useNavigate } from "react-router";
import Header from "../fragments/Header";

function AdaptiveDesigner() {
  const navigate = useNavigate();
  const id = parseInt(sessionStorage.getItem("id") as string);

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleStorageChange = (event: StorageEvent) => {
    console.log(event.key);
    if (event.key === "changedcard") {
      // Navigate to new page
      navigate(`/update/${id}`);
    }
    if (event.key === "changedAddcard") {
      // Navigate to new page
      navigate(`/add`);
    }
  };

  return (
    <div>
      <Header />
      <iframe
        src="./Adaptive_card_designer.html"
        style={{ width: "100%", height: "1000px", marginTop: "5%" }}
        title={"Adaptive Card Designer"}
      ></iframe>
    </div>
  );
}

export default AdaptiveDesigner;
