import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

import Navbar from "./components/Navbar"
import HomePage from "./components/HomePage"
import TrackerPage from "./components/TrackerPage"
import AboutPage from "./components/AboutPage" 
import FAQPage from "./components/FAQPage" 
import ContactPage from "./components/ContactPage"
import CoachPage from "./components/CoachPage"
import AnalyticsPage from "./components/AnalyticsPage"
import SharePage from "./components/SharePage"
import SignInPage from "./components/SignInPage"
import SignUpPage from "./components/SignUpPage"

gsap.registerPlugin(ScrollTrigger)

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.45 }}
        onAnimationComplete={() => {
          ScrollTrigger.refresh()
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} /> 
          <Route path="/faq" element={<FAQPage />} /> 
          <Route path="/contact" element={<ContactPage />} /> 
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      {/* Persistent Global Navbar */}
      <Navbar />
      
      {/* Layout wrapper prevents the fixed navbar from cutting off the top of your pages */}
      <main className="app-layout">
        <AnimatedRoutes />
      </main>
    </BrowserRouter>
  )
}

export default App