import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestComponents from "./pages/TestComponents";
// import LoginPage from "./pages/LoginPage"; // create this if not yet

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestComponents />} />
      </Routes>
    </Router>
  );
}

export default App;
