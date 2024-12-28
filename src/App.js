import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import User from "./component/user";
import Navbar from './component/navbar';
import Product from './component/product';
import Voucher from './component/voucher';
import Transaction from './component/transaction';
import Login from './component/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          path="/user"
          element={
            <>
              <Navbar />
              <User />
            </>
          }
        />
        <Route
          path="/product"
          element={
            <>
              <Navbar />
              <Product />
            </>
          }
        />
        <Route
          path="/voucher"
          element={
            <>
              <Navbar />
              <Voucher />
            </>
          }
        />
        <Route
          path="/transaction"
          element={
            <>
              <Navbar />
              <Transaction />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
