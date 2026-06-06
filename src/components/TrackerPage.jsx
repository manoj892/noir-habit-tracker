import { Link } from "react-router-dom"
import ScrollProgress from "./ScrollProgress"
import TrackerShell from "./TrackerShell"

function TrackerPage() {
  return (
    <>
      <ScrollProgress />
      <div className="page tracker-page">
        <section className="tracker-page-hero">
          <p className="eyebrow">Your system</p>
          <h1>Track habits week by week.</h1>
          <p className="hero-text">
            This page is the real product space: cleaner, more usable, and still
            animated — but less theatrical than the homepage.
          </p>
        </section>

        <TrackerShell />
      </div>
    </>
  )
}

export default TrackerPage