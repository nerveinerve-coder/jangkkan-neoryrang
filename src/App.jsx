import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Characters from './pages/Characters'
import NameInput from './pages/NameInput'
import Chat from './pages/Chat'
import Setup from './pages/Setup'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Characters />} />
        <Route path="/name" element={<NameInput />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/setup" element={<Setup />} />
      </Routes>
    </BrowserRouter>
  )
}