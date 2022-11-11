import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Form from './Form'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Form />} />
      </Routes>
    </Router>
  )
}

export default App