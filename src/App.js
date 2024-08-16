import { Routes,Route} from "react-router-dom";
import Success from "./success";
import Register from "./Register";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  

  return (
    <Routes>
        <Route path="/" element={<Register/>}></Route>
        <Route path="/success" element={<Success/>}></Route>
    </Routes>
  );
}

export default App;
