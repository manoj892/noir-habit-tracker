import { useState, useMemo, useRef, useEffect, Component } from "react"
import Highcharts from "highcharts"
import HighchartsReactModule from "highcharts-react-official"
import highcharts3d from "highcharts/highcharts-3d"
import * as THREE from "three"
import { motion } from "motion/react"
import "./AnalyticsPage.css"

const HighchartsReact = HighchartsReactModule.default || HighchartsReactModule

if (typeof highcharts3d === "function") {
  highcharts3d(Highcharts)
} else if (highcharts3d && typeof highcharts3d.default === "function") {
  highcharts3d.default(Highcharts)
}

if (typeof Highcharts === "object") {
  Highcharts.setOptions({
    chart: { backgroundColor: "transparent", style: { fontFamily: "inherit" } },
    title:    { style: { color: "#e4e4e7", fontSize: "13px", fontWeight: "600" } },
    subtitle: { style: { color: "#71717a" } },
    legend: {
      itemStyle: { color: "#a1a1aa", fontSize: "11px" },
      itemHoverStyle: { color: "#ffffff" },
      backgroundColor: "transparent",
    },
    xAxis: {
      labels: { style: { color: "#9eb4c8", fontSize: "10px" } },
      lineColor: "rgba(255,255,255,0.1)", tickColor: "rgba(255,255,255,0.1)",
      gridLineColor: "rgba(255,255,255,0.05)",
      title: { style: { color: "#71717a" } },
    },
    yAxis: {
      labels: { style: { color: "#9eb4c8", fontSize: "10px" } },
      lineColor: "rgba(255,255,255,0.1)", tickColor: "rgba(255,255,255,0.1)",
      gridLineColor: "rgba(255,255,255,0.07)",
      title: { style: { color: "#71717a" } },
    },
    tooltip: {
      backgroundColor: "rgba(6,9,18,0.97)", borderColor: "rgba(255,255,255,0.12)",
      borderRadius: 10, style: { color: "#e4e4e7", fontSize: "12px" },
    },
    plotOptions: { series: { animation: { duration: 900 } } },
    credits: { enabled: false },
  })
}

class ChartBoundary extends Component {
  constructor(props) { super(props); this.state = { error: false } }
  static getDerivedStateFromError() { return { error: true } }
  render() {
    return this.state.error
      ? <div className="chart-empty">Chart unavailable.</div>
      : this.props.children
  }
}

function useDrag3D(wrapRef, chartRef, aInit, bInit, aMin, aMax, bMin, bMax, sens = 0.35, invertBeta = false) {
  useEffect(() => {
    let cleanup = () => {}
    let tries = 0
    const tryAttach = () => {
      const wrap = wrapRef.current
      if (!wrap) return
      const plotBg = wrap.querySelector(".highcharts-plot-background")
      if (!plotBg && tries++ < 20) { setTimeout(tryAttach, 50); return }
      if (!plotBg) return
      let dragging = false, lastX = 0, lastY = 0, a = aInit, b = bInit
      const move = (x, y) => {
        if (!dragging) return
        const ch = chartRef.current?.chart
        if (!ch) return
        b = Math.max(bMin, Math.min(bMax, b + (invertBeta ? -(x - lastX) : (x - lastX)) * sens))
        a = Math.max(aMin, Math.min(aMax, a + (y - lastY) * sens))
        lastX = x; lastY = y
        ch.update({ chart: { options3d: { alpha: a, beta: b } } }, true, false, false)
      }
      const md = e => { e.stopPropagation(); dragging = true; lastX = e.clientX; lastY = e.clientY }
      const mm = e => move(e.clientX, e.clientY)
      const mu = () => { dragging = false }
      const ts = e => { e.stopPropagation(); dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY }
      const tm = e => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY) }
      const te = () => { dragging = false }
      plotBg.style.cursor = "grab"
      plotBg.addEventListener("mousedown",  md)
      plotBg.addEventListener("touchstart", ts, { passive: true })
      plotBg.addEventListener("touchmove",  tm, { passive: false })
      plotBg.addEventListener("touchend",   te)
      document.addEventListener("mousemove", mm)
      document.addEventListener("mouseup",   mu)
      cleanup = () => {
        plotBg.removeEventListener("mousedown",  md)
        plotBg.removeEventListener("touchstart", ts)
        plotBg.removeEventListener("touchmove",  tm)
        plotBg.removeEventListener("touchend",   te)
        document.removeEventListener("mousemove", mm)
        document.removeEventListener("mouseup",   mu)
      }
    }
    tryAttach()
    return () => cleanup()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

// ── Helpers ─────────────────────────────────────────────
const RANGE_OPTIONS = [
  { id: "week",   label: "This Week"  },
  { id: "month",  label: "This Month" },
  { id: "year",   label: "This Year"  },
  { id: "custom", label: "Custom"     },
]

function getDatesInRange(start, end) {
  const dates = [], cur = new Date(start), fin = new Date(end)
  while (cur <= fin) { dates.push(cur.toLocaleDateString("en-CA")); cur.setDate(cur.getDate() + 1) }
  return dates
}

function getRangeStartEnd(range, customStart, customEnd) {
  const today = new Date(); today.setHours(23, 59, 59, 999)
  let start = new Date()
  if      (range === "week")   { start = new Date(today); start.setDate(today.getDate() - 6) }
  else if (range === "month")  { start = new Date(today.getFullYear(), today.getMonth(), 1) }
  else if (range === "year")   { start = new Date(today.getFullYear(), 0, 1) }
  else if (range === "custom" && customStart && customEnd)
    return { start: new Date(customStart), end: new Date(customEnd) }
  start.setHours(0, 0, 0, 0)
  return { start, end: today }
}

function getStreak(habit) {
  let s = 0; const d = new Date()
  while (true) {
    const key = d.toLocaleDateString("en-CA")
    if (habit.entries[key]?.done) { s++; d.setDate(d.getDate() - 1) } else break
  }
  return s
}



// ── TRUE 3D Cylinder Pie — Three.js WebGL ───────────────
function Pie3DChart({ data }) {
  const mountRef = useRef(null)

  useEffect(() => {
    if (!data?.length) return
    const el = mountRef.current
    if (!el) return

    const W = el.clientWidth || 380, H = 300
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, W / H, 0.1, 100)
    // Tilted so you see both the top face AND the cylindrical sides clearly
    camera.position.set(0, 3.0, 4.0)
    camera.lookAt(0, 0, 0)

    scene.add(new THREE.AmbientLight(0xffffff, 0.55))
    const dl = new THREE.DirectionalLight(0xffffff, 1.1)
    dl.position.set(3, 6, 4); scene.add(dl)
    const dl2 = new THREE.DirectionalLight(0xffffff, 0.3)
    dl2.position.set(-4, -2, -3); scene.add(dl2)

    const total  = data.reduce((s, d) => s + d.value, 0)
    const DEPTH  = 0.55
    const RADIUS = 1.55
    const GAP    = 0.016
    const group  = new THREE.Group()
    const slices = []
    let angle = 0

    data.forEach((d, idx) => {
      const frac     = d.value / total
      const sweep    = frac * Math.PI * 2 - GAP
      const midAngle = angle + GAP / 2 + sweep / 2
      const segs     = Math.max(20, Math.round(sweep / (Math.PI / 40)))

      const geo = new THREE.CylinderGeometry(
        RADIUS, RADIUS, DEPTH, segs, 1, false, angle + GAP / 2, sweep
      )

      const baseColor   = new THREE.Color(d.color || "#6f5cff")
      const brightColor = baseColor.clone().lerp(new THREE.Color(0xffffff), 0.45)
      const dimColor    = baseColor.clone().lerp(new THREE.Color(0x060606), 0.62)

      const mat = new THREE.MeshPhongMaterial({
        color:     baseColor.clone(),
        emissive:  new THREE.Color(0x000000),
        shininess: 80,
        specular:  new THREE.Color(0x666666),
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(geo, mat)
      // tag each mesh so raycaster can find slice index from any hit (including edge children)
      mesh.userData.sliceIdx = idx
      mesh.userData.name     = d.name
      mesh.userData.value    = d.value
      mesh.userData.pct      = Math.round(frac * 100)
      mesh.userData.color    = d.color || "#6f5cff"

      const edges = new THREE.EdgesGeometry(geo)
      const line  = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.10 })
      )
      line.userData.sliceIdx = idx  // tag line children too
      mesh.add(line)
      group.add(mesh)

      // outDir: push slice outward in XZ plane. CylinderGeometry: Y=axis, X/Z=radial
      const outDir = new THREE.Vector3(Math.sin(midAngle), 0, Math.cos(midAngle))

      slices.push({
        mesh, baseColor: baseColor.clone(), brightColor, dimColor,
        outDir, offset: 0, targetOffset: 0,
      })

      angle += frac * Math.PI * 2
    })

    scene.add(group)

    // DOM tooltip
    const tip = document.createElement("div")
    tip.style.cssText = [
      "position:absolute", "pointer-events:none", "opacity:0",
      "background:rgba(6,9,18,0.95)", "border:1px solid rgba(255,255,255,0.15)",
      "border-radius:10px", "padding:8px 12px", "font-size:12px",
      "color:#e4e4e7", "transition:opacity 0.12s", "white-space:nowrap",
      "z-index:20", "box-shadow:0 4px 20px rgba(0,0,0,0.6)", "line-height:1.5",
    ].join(";")
    el.style.position = "relative"
    el.appendChild(tip)

    const showTip = (ud, cx, cy) => {
      const r = el.getBoundingClientRect()
      const x = cx - r.left, y = cy - r.top
      const completions = ud.value
      const pct         = ud.pct
      const name        = ud.name
      const color       = ud.color
      tip.innerHTML = [
        `<div style="display:flex;align-items:center;gap:7px;margin-bottom:4px">`,
        `<span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>`,
        `<strong style="font-size:13px;color:#fff">${name}</strong>`,
        `</div>`,
        `<div style="display:flex;gap:16px;font-size:11px;color:#9eb4c8">`,
        `<span>Completions: <strong style="color:#fff">${completions}</strong></span>`,
        `<span>Share: <strong style="color:${color}">${pct}%</strong></span>`,
        `</div>`,
      ].join("")
      // keep tooltip inside the mount div
      const tipW = 200
      tip.style.left    = `${x + 14 + tipW > W ? x - tipW - 8 : x + 14}px`
      tip.style.top     = `${Math.max(y - 50, 4)}px`
      tip.style.opacity = "1"
    }
    const hideTip = () => { tip.style.opacity = "0" }

    const raycaster = new THREE.Raycaster()
    const ptr       = new THREE.Vector2()
    let hoveredIdx  = -1
    let dragging    = false

    const setHover = (idx, ud, cx, cy) => {
      const changed = idx !== hoveredIdx
      hoveredIdx = idx
      if (changed) {
        slices.forEach((s, i) => { s.targetOffset = i === idx ? 0.20 : 0 })
      }
      if (idx !== -1 && ud) {
        showTip(ud, cx, cy)
        renderer.domElement.style.cursor = "pointer"
      } else {
        hideTip()
        renderer.domElement.style.cursor = dragging ? "grabbing" : "grab"
      }
    }

    const checkHover = (cx, cy) => {
      if (dragging) return
      const r = renderer.domElement.getBoundingClientRect()
      ptr.x =  ((cx - r.left) / r.width)  * 2 - 1
      ptr.y = -((cy - r.top)  / r.height) * 2 + 1
      raycaster.setFromCamera(ptr, camera)
      // Test each slice mesh directly — avoids false hits on LineSegments children
      let closestDist = Infinity, closestIdx = -1, closestMesh = null
      slices.forEach((s, i) => {
        const hits = raycaster.intersectObject(s.mesh, false)
        if (hits.length && hits[0].distance < closestDist) {
          closestDist = hits[0].distance
          closestIdx  = i
          closestMesh = s.mesh
        }
      })
      if (closestIdx !== -1) {
        setHover(closestIdx, closestMesh.userData, cx, cy)
      } else {
        setHover(-1, null, cx, cy)
      }
    }

    const LERP  = 0.13
    const black = new THREE.Color(0x000000)
    let animId

    const tick = () => {
      animId = requestAnimationFrame(tick)
      slices.forEach((s, i) => {
        s.offset += (s.targetOffset - s.offset) * LERP
        // outDir is in LOCAL group space — mesh.position is also local.
        // No quaternion needed: push is always radially outward from center
        // in the slice's own local geometry direction, which is correct at any rotation.
        s.mesh.position.copy(s.outDir.clone().multiplyScalar(s.offset))
        if (hoveredIdx === -1) {
          s.mesh.material.color.lerp(s.baseColor, LERP)
          s.mesh.material.emissive.lerp(black, LERP)
        } else if (i === hoveredIdx) {
          s.mesh.material.color.lerp(s.brightColor, LERP)
          s.mesh.material.emissive.lerp(s.baseColor.clone().multiplyScalar(0.55), LERP)
        } else {
          s.mesh.material.color.lerp(s.dimColor, LERP)
          s.mesh.material.emissive.lerp(black, LERP)
        }
      })
      renderer.render(scene, camera)
    }
    tick()

    const canvas = renderer.domElement
    canvas.style.cursor     = "grab"
    canvas.style.touchAction = "none"
    let lx = 0, ly = 0

    const down  = (x, y) => { dragging = true;  lx = x; ly = y; canvas.style.cursor = "grabbing" }
    const move  = (x, y) => {
      if (!dragging) { checkHover(x, y); return }
      group.rotation.y += (x - lx) * 0.012
      group.rotation.x += (y - ly) * 0.012
      // Sync quaternion from Euler rotation immediately so tick() sees current quaternion
      group.quaternion.setFromEuler(group.rotation)
      lx = x; ly = y
    }
    const up    = (x, y) => { dragging = false; canvas.style.cursor = "grab"; checkHover(x, y) }
    const leave = ()     => setHover(-1, null, 0, 0)

    const md = e => down(e.clientX, e.clientY)
    const mm = e => move(e.clientX, e.clientY)
    const mu = e => up(e.clientX, e.clientY)
    const ts = e => { e.stopPropagation(); down(e.touches[0].clientX, e.touches[0].clientY) }
    const tm = e => {
      e.preventDefault()
      dragging
        ? move(e.touches[0].clientX, e.touches[0].clientY)
        : checkHover(e.touches[0].clientX, e.touches[0].clientY)
    }
    const te = e => { dragging = false; checkHover(e.changedTouches[0].clientX, e.changedTouches[0].clientY) }

    canvas.addEventListener("mousedown",  md)
    canvas.addEventListener("mousemove",  mm)
    canvas.addEventListener("mouseleave", leave)
    canvas.addEventListener("touchstart", ts, { passive: true })
    canvas.addEventListener("touchmove",  tm, { passive: false })
    canvas.addEventListener("touchend",   te)
    document.addEventListener("mousemove", mm)
    document.addEventListener("mouseup",   mu)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("mousedown",  md)
      canvas.removeEventListener("mousemove",  mm)
      canvas.removeEventListener("mouseleave", leave)
      canvas.removeEventListener("touchstart", ts)
      canvas.removeEventListener("touchmove",  tm)
      canvas.removeEventListener("touchend",   te)
      document.removeEventListener("mousemove", mm)
      document.removeEventListener("mouseup",   mu)
      if (el.contains(tip)) el.removeChild(tip)
      renderer.dispose()
      if (el.contains(canvas)) el.removeChild(canvas)
    }
  }, [data])

  if (!data?.length) return <div className="chart-empty">No completions in this range.</div>
  return (
    <>
      <div ref={mountRef} className="pie3d-three-mount" />
      <div className="cyl-legend">
        {data.map(d => (
          <div key={d.name} className="cyl-legend-item">
            <span className="cyl-legend-dot" style={{ background: d.color }} />
            <span className="cyl-legend-name">{d.name}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── 3D Bar ──────────────────────────────────────────────
function Bar3DChart({ data, yTitle = "Completions", alpha = 15, beta = 15, height = 280 }) {
  const wrapRef  = useRef(null)
  const chartRef = useRef(null)
  useDrag3D(wrapRef, chartRef, alpha, beta, 0, 45, -30, 30, 0.3, true)

  const opts = useMemo(() => ({
    chart: { type: "column", options3d: { enabled: true, alpha, beta, depth: 50 }, height },
    title: { text: "" },
    subtitle: { text: "Drag to rotate", style: { color: "#52525b", fontSize: "10px" } },
    accessibility: { enabled: false },
    xAxis: {
      categories: (data || []).map(d => d.name || ""),
      labels: { style: { color: "#9eb4c8", fontSize: "10px" } },
      gridLineColor: "rgba(255,255,255,0.05)",
    },
    yAxis: {
      title: { text: yTitle, style: { color: "#71717a" } },
      gridLineColor: "rgba(255,255,255,0.07)",
      labels: { style: { color: "#9eb4c8", fontSize: "10px" } },
    },
    plotOptions: {
      column: {
        depth: 25, colorByPoint: true, borderWidth: 0,
        groupPadding: 0.1, pointPadding: 0.05, dataLabels: { enabled: false },
        animation: { duration: 1000, easing: "easeOutBounce" },
        states: {
          hover:    { brightness: 0.25, borderWidth: 0 },
          inactive: { opacity: 0.4 },
        },
      },
    },
    colors: (data || []).map(d => d.fill || "#6f5cff"),
    series: [{ name: yTitle, data: (data || []).map((d, i) => ({ y: d.completions ?? 0, name: d.name || "", animation: { defer: i * 60 } })) }],
    legend: { enabled: false },
    tooltip: { formatter() { return `<span style="color:${this.color}">●</span> <b>${this.point.name || this.x}</b><br/>Completions: <b>${this.y}</b>` } },
  }), [data, alpha, beta, yTitle, height])

  if (!data?.length) return <div className="chart-empty">No data.</div>
  return (
    <ChartBoundary>
      <div ref={wrapRef} className="chart-interaction-wrapper" style={{ touchAction: "none" }}>
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={opts} immutable={false} />
      </div>
    </ChartBoundary>
  )
}

// ── 3D Spline ───────────────────────────────────────────
function Line3DChart({ data, height = 280 }) {
  const wrapRef  = useRef(null)
  const chartRef = useRef(null)
  useDrag3D(wrapRef, chartRef, 12, 8, 0, 40, -25, 25, 0.3, true)

  const opts = useMemo(() => ({
    chart: { type: "spline", options3d: { enabled: true, alpha: 12, beta: 8, depth: 60, viewDistance: 25 }, height },
    title: { text: "" },
    subtitle: { text: "Drag to rotate", style: { color: "#52525b", fontSize: "10px" } },
    accessibility: { enabled: false },
    xAxis: {
      categories: (data || []).map(d => d.name || ""),
      labels: { style: { color: "#9eb4c8", fontSize: "10px" } },
      gridLineColor: "rgba(255,255,255,0.05)",
    },
    yAxis: {
      min: 0, max: 100,
      title: { text: "Rate (%)", style: { color: "#71717a" } },
      gridLineColor: "rgba(255,255,255,0.07)",
      labels: { style: { color: "#9eb4c8", fontSize: "10px" }, format: "{value}%" },
    },
    plotOptions: {
      spline: {
        lineWidth: 3,
        animation: { duration: 1400, easing: "easeInOutCubic" },
        marker: {
          enabled: true, radius: 5,
          fillColor: "#16e0c4", lineColor: "#fff", lineWidth: 1.5,
          states: { hover: { radius: 8, fillColor: "#fff", lineColor: "#16e0c4", lineWidth: 2 } },
        },
        states: { hover: { lineWidth: 5 } },
        dataLabels: { enabled: false },
      },
    },
    series: [{
      name: "Completion %", color: "#16e0c4",
      data: (data || []).map(d => d.rate ?? 0),
      shadow: { color: "#16e0c488", offsetX: 0, offsetY: 2, opacity: 0.7, width: 8 },
    }],
    legend: { enabled: false },
    tooltip: { formatter() { return `<b>${this.x}</b><br/>Rate: <b style="color:#16e0c4">${this.y}%</b>` } },
  }), [data, height])

  return (
    <ChartBoundary>
      <div ref={wrapRef} className="chart-interaction-wrapper" style={{ touchAction: "none" }}>
        <HighchartsReact ref={chartRef} highcharts={Highcharts} options={opts} immutable={false} />
      </div>
    </ChartBoundary>
  )
}

// ── 3D Waffle ───────────────────────────────────────────
function Waffle3DChart({ data }) {
  if (!data?.length) return <div className="chart-empty">No habits yet.</div>
  const COLS = 10, S = 14, OX = 5, OY = -4, STEP = S + 2

  return (
    <div className="waffle3d-list">
      {data.map(h => {
        const filled = Math.round(h.pct / 5)
        const raw = h.color || "#6f5cff"
        const hex = raw.startsWith("#") ? raw.replace("#", "") : "6f5cff"
        const n   = parseInt(hex.length === 6 ? hex : "6f5cff", 16)
        const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
        const topC   = `rgb(${Math.min(255,r+55)},${Math.min(255,g+55)},${Math.min(255,b+55)})`
        const rightC = `rgb(${Math.max(0,r-60)},${Math.max(0,g-60)},${Math.max(0,b-60)})`
        const svgW = COLS * STEP + OX + 4
        const svgH = Math.ceil(20 / COLS) * STEP + Math.abs(OY) + 4
        return (
          <div key={h.name} className="waffle3d-row">
            <div className="waffle3d-meta">
              <span>{h.icon}</span>
              <span className="waffle3d-name">{h.name.length > 18 ? h.name.slice(0, 17) + "…" : h.name}</span>
              <span className="waffle3d-pct" style={{ color: h.color }}>{h.pct}%</span>
            </div>
            <svg width={svgW} height={svgH} style={{ overflow: "visible" }}>
              {Array.from({ length: 20 }, (_, i) => {
                const cx = (i % COLS) * STEP + 2
                const cy = Math.floor(i / COLS) * STEP + 2
                const on  = i < filled
                const fc  = on ? h.color : "rgba(255,255,255,0.06)"
                const tc  = on ? topC    : "rgba(255,255,255,0.09)"
                const rc  = on ? rightC  : "rgba(255,255,255,0.04)"
                return (
                  <g key={i} style={{
                    opacity: 0,
                    animation: "wafflePop 0.3s ease forwards",
                    animationDelay: `${i * 30}ms`,
                  }}>
                    <path d={`M${cx+S},${cy} l${OX},${OY} v${S} l${-OX},${-OY} Z`} fill={rc} />
                    <path d={`M${cx},${cy} h${S} v${S} h${-S} Z`} fill={fc}
                      style={on ? { filter: `drop-shadow(0 0 3px ${h.color}99)` } : {}}
                    />
                    <path d={`M${cx},${cy} l${OX},${OY} h${S} l${-OX},${-OY} Z`}   fill={tc} />
                  </g>
                )
              })}
            </svg>
          </div>
        )
      })}
    </div>
  )
}

// ── Main page ───────────────────────────────────────────
export default function AnalyticsPage() {
  const [range,       setRange]       = useState("week")
  const [customStart, setCustomStart] = useState("")
  const [customEnd,   setCustomEnd]   = useState("")
  const [showCustom,  setShowCustom]  = useState(false)

  const groups = useMemo(() => {
    try { const g = JSON.parse(localStorage.getItem("habitflow-groups") || "[]"); return Array.isArray(g) ? g : [] }
    catch { return [] }
  }, [])

  const allHabits = useMemo(() =>
    groups.flatMap(g => g.children.map(c => ({ ...c, groupName: g.name, groupColor: g.color }))), [groups])

  const { start, end } = getRangeStartEnd(range, customStart, customEnd)
  const datesInRange   = getDatesInRange(start, end)
  const todayKey       = new Date().toLocaleDateString("en-CA")

  const totalHabits      = allHabits.length
  const totalCompletions = useMemo(() =>
    allHabits.reduce((s, h) => s + datesInRange.filter(d => h.entries[d]?.done).length, 0), [allHabits, datesInRange])
  const completionRate   = totalHabits && datesInRange.length
    ? Math.round((totalCompletions / (totalHabits * datesInRange.length)) * 100) : 0
  const activeToday      = allHabits.filter(h => h.entries[todayKey]?.done).length

  const pieData = useMemo(() =>
    allHabits.map(h => ({
      name: h.name, value: datesInRange.filter(d => h.entries[d]?.done).length,
      color: h.color || h.groupColor || "#6f5cff",
    })).filter(h => h.value > 0), [allHabits, datesInRange])

  const dailyData = useMemo(() => datesInRange.map(d => ({
    name: range === "year"
      ? new Date(d).toLocaleDateString("en-US", { month: "short" })
      : new Date(d).toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
    completions: allHabits.filter(h => h.entries[d]?.done).length,
  })), [allHabits, datesInRange, range])

  const chartData = useMemo(() => {
    if (range !== "year") return dailyData.map(d => ({ ...d, fill: "#6f5cff" }))
    const byMonth = {}
    dailyData.forEach(d => { byMonth[d.name] = (byMonth[d.name] || 0) + d.completions })
    return Object.entries(byMonth).map(([name, completions]) => ({ name, completions, fill: "#6f5cff" }))
  }, [dailyData, range])

  const habitBarData = useMemo(() =>
    allHabits.map(h => ({
      name: h.name.length > 14 ? h.name.slice(0, 14) + "…" : h.name,
      completions: datesInRange.filter(d => h.entries[d]?.done).length,
      fill: h.color || h.groupColor || "#6f5cff",
    })), [allHabits, datesInRange])

  const groupBarData = useMemo(() =>
    groups.map(g => ({
      name: g.name,
      completions: g.children.reduce((s, c) => s + datesInRange.filter(d => c.entries[d]?.done).length, 0),
      fill: g.color || "#6f5cff",
    })), [groups, datesInRange])

  const trendData = useMemo(() => {
    if (range === "year") {
      const byMonth = {}
      dailyData.forEach(d => {
        if (!byMonth[d.name]) byMonth[d.name] = { total: 0, days: 0 }
        byMonth[d.name].total += d.completions; byMonth[d.name].days += 1
      })
      return Object.entries(byMonth).map(([name, v]) => ({
        name, rate: totalHabits ? Math.round((v.total / (totalHabits * v.days)) * 100) : 0
      }))
    }
    return dailyData.map(d => ({
      name: d.name, rate: totalHabits ? Math.round((d.completions / totalHabits) * 100) : 0
    }))
  }, [dailyData, totalHabits, range])

  const waffleData = useMemo(() =>
    allHabits.map(h => {
      const done = datesInRange.filter(d => h.entries[d]?.done).length
      return {
        name: h.name, icon: h.icon,
        color: h.color || h.groupColor || "#6f5cff",
        pct: datesInRange.length ? Math.round((done / datesInRange.length) * 100) : 0,
      }
    }), [allHabits, datesInRange])

  const applyCustom = () => {
    if (customStart && customEnd) { setRange("custom"); setShowCustom(false) }
  }

  const ca = d => ({ initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, delay: d } })

  return (
    <div className="future-homepage mega-homepage brand-page">
      <div className="future-noise" /><div className="future-grid" />
      <div className="future-glow glow-a" /><div className="future-glow glow-c" />

      <main className="brand-page-main analytics-page">
        <motion.div className="analytics-header"
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.65 }}
        >
          <p className="eyebrow">Signal analytics</p>
          <h1 className="future-title">Habit intelligence.</h1>
          <p className="future-text">Convert daily check-ins into a living map of consistency, focus, and category momentum.</p>
        </motion.div>

        <div className="analytics-controls-row">
          <div className="analytics-range-row">
            {RANGE_OPTIONS.map(r => (
              <button key={r.id} className={`analytics-range-btn ${range === r.id ? "active" : ""}`}
                onClick={() => { if (r.id === "custom") setShowCustom(s => !s); else { setRange(r.id); setShowCustom(false) } }}
              >{r.label}</button>
            ))}
          </div>
        </div>

        {showCustom && (
          <motion.div className="analytics-custom-picker"
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}
          >
            <label>From <input type="date" value={customStart} onChange={e => setCustomStart(e.target.value)} /></label>
            <label>To   <input type="date" value={customEnd}   onChange={e => setCustomEnd(e.target.value)}   /></label>
            <button className="primary-btn analytics-apply-btn" onClick={applyCustom}>Apply</button>
          </motion.div>
        )}

        <div className="analytics-stats-row">
          {[
            { label: "Total Habits",      value: totalHabits },
            { label: "Total Completions", value: totalCompletions },
            { label: "Completion Rate",   value: `${completionRate}%` },
            { label: "Active Today",      value: activeToday },
          ].map((s, i) => (
            <motion.div key={s.label} className="stat-card"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="analytics-grid">
          <motion.div className="chart-card" {...ca(0.15)}>
            <h3>Habit Completions — 3D Cylinder</h3>
            <p className="chart-drag-label">Drag to rotate · Hover/touch slice to highlight</p>
            <Pie3DChart data={pieData} />
          </motion.div>
          <motion.div className="chart-card" {...ca(0.22)}>
            <h3>Completions Over Time — 3D Columns</h3>
            <p className="chart-drag-label">Drag to rotate</p>
            <Bar3DChart data={chartData} yTitle="Completions" alpha={15} beta={12} />
          </motion.div>
          <motion.div className="chart-card" {...ca(0.30)}>
            <h3>Completions per Habit — 3D Columns</h3>
            <p className="chart-drag-label">Drag to rotate</p>
            <Bar3DChart data={habitBarData} yTitle="Completions" alpha={15} beta={15} />
          </motion.div>
          <motion.div className="chart-card" {...ca(0.38)}>
            <h3>Completions by Group — 3D Columns</h3>
            <p className="chart-drag-label">Drag to rotate</p>
            <Bar3DChart data={groupBarData} yTitle="Completions" alpha={15} beta={10} />
          </motion.div>
          <motion.div className="chart-card" {...ca(0.45)}>
            <h3>Completion Rate Trend — 3D Spline</h3>
            <p className="chart-drag-label">Drag to rotate</p>
            <Line3DChart data={trendData} />
          </motion.div>
          <motion.div className="chart-card" {...ca(0.52)}>
            <h3>Habit Completion — 3D Waffle</h3>
            <Waffle3DChart data={waffleData} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}
