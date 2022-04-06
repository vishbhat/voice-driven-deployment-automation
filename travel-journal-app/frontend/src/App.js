import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Login from "./Pages/Login";
import SignUp from "./Pages/Register";
import MyBlogs from "./Pages/MyBlogs";
import Header from "./Components/Headers";
import { Routes, Route } from "react-router-dom";
import Blogs from "./Pages/Blogs";
import NewBlog from "./Pages/NewBlog";
import EditBlog from "./Pages/EditBlog";

function App() {
  return (
    <div className="App" >
      <Routes>
        <Route path="/" element={<Header/>}>
        <Route index element={<Login />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="signup" element={<SignUp />}></Route>
        <Route path="myBlogs" element={<MyBlogs />}></Route>
        <Route path="newBlog" element={<NewBlog />}></Route>
        <Route path="blogs" element={<Blogs />}></Route>
        <Route path="editBlog" element={<EditBlog />}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
