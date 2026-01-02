import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddBook from './pages/AddBook';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import DiscoverBook from './pages/DiscoverBook';
import MyLibrary from './pages/MyLibrary';
import UserProfile from './pages/UserProfile';
import Discover from './pages/Discover';
import SearchResults from './pages/SearchResults';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center p-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="add-book" element={
          <ProtectedRoute>
            <AddBook />
          </ProtectedRoute>
        } />
        <Route path="book/:id" element={
          <ProtectedRoute>
            <BookDetails />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        <Route path="library" element={
          <ProtectedRoute>
            <MyLibrary />
          </ProtectedRoute>
        } />
        <Route path="user/:id" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="discover" element={
          <ProtectedRoute>
            <Discover />
          </ProtectedRoute>
        } />
        <Route path="discover/:id" element={
          <ProtectedRoute>
            <DiscoverBook />
          </ProtectedRoute>
        } />
        <Route path="results" element={
          <ProtectedRoute>
            <SearchResults />
          </ProtectedRoute>
        } />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
