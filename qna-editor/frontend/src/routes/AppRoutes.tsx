import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoutes";
import Dashboard from "../pages/Dashboard";
import Update from "../components/Update";
import AdaptiveDesigner from "../components/AdaptiveDesigner";
import AddQna from "../components/AddQna";
import SearchQna from "../components/SearchQna";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function AppRoutes() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<PrivateRoute Component={Dashboard} />}
            />
            {/* Update */}
            <Route
              path="/update/:id"
              element={<PrivateRoute Component={Update} />}
            />
            <Route
              path="/adaptive-desginer"
              element={<PrivateRoute Component={AdaptiveDesigner} />}
            />
            <Route path="/add" element={<PrivateRoute Component={AddQna} />} />
            <Route
              path="/search"
              element={<PrivateRoute Component={SearchQna} />}
            />
            {/* Login Route */}
            <Route path="/" element={<Login />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}
export default AppRoutes;
