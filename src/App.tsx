import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import Single from "./pages/single/Single";
import { productInputs, userInputs } from "./formSource";
import New from "./pages/new/New";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider, { AuthIsSignedIn, AuthIsNotSignedIn } from './context/authContext'
import { Navigate } from "react-router-dom";


const SignInRoute: React.FunctionComponent = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<Login />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

const MainRoute: React.FunctionComponent = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="users">
          <Route index element={<User />} />
        </Route>
        <Route path="transactions">
          <Route index element={<List />} />
          <Route path=":userId" element={<Single />} />
        </Route>
        <Route path="products">
          <Route index element={<List />} />
          <Route path=":productId" element={<Single />} />
          <Route
            path="new"
            element={<New inputs={productInputs} title="Add New Product" />}
          />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
)

const App: React.FunctionComponent = () => (
  <AuthProvider>
    <AuthIsSignedIn>
      <MainRoute />
    </AuthIsSignedIn>
    <AuthIsNotSignedIn>
      <SignInRoute />
    </AuthIsNotSignedIn>
  </AuthProvider>
)

export default App;
