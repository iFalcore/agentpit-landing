import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import DocsPage from './pages/DocsPage'
import LandingPage from './pages/LandingPage'

export default function App() {
  return (
    // HashRouter so the built site works from any static host — and from a
    // single-file bundle — with no rewrite rules.
    <HashRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  )
}
