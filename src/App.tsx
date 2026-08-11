import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Build from './sections/Build'
import Cta from './sections/Cta'
import Hero from './sections/Hero'
import Leaderboard from './sections/Leaderboard'
import Markets from './sections/Markets'
import Skale from './sections/Skale'
import Steps from './sections/Steps'
import Why from './sections/Why'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Markets />
        <Why />
        <Leaderboard />
        <Skale />
        <Steps />
        <Build />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
