import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/test/test';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
