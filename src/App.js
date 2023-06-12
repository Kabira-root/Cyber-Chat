import './App.scss';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Loading from './components/preloader/Loading';
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

export default function App() {

  const currentUser = useContext(AuthContext);
  // currentUser=undefined || null || User
  // user is undefined until auth().currentuser is fetched.
  // if useris loggedout AuthContext sets user to null
  const ProtectedRoute = ({ children }) => {
    if (currentUser === null) {
      return <Navigate to='/login' />
    }
    if (currentUser === undefined) {
      return <Loading success={false} loading={true} />
    }
    return children;
  }

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path='/'>
            <Route index element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            <Route path='login' element={
              <Suspense fallback={<Loading success={false} loading={true} />}>
                <Login />
              </Suspense>
            } />
            <Route path='register' element={
              <Suspense fallback={<Loading success={false} loading={true} />}>
                <Register />
              </Suspense>
            } />
            <Route path='/*' element={<Navigate to='/' />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}