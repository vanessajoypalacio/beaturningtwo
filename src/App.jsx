import './App.css'
import { useState, useEffect, useRef } from 'react'
import divisoreFiore from './assets/divisore_fiore.png'
import beaTitle from './assets/image.png'
import animali from './assets/animali.png'
import animali2 from './assets/animali2.png'
import prettyAudio from './assets/pretty.mp3'

// Sostituisci con il tuo FORM_ID da Google Forms
const GOOGLE_FORM_ID = '1FAIpQLSfAgS1sckzxh47s3NA_B4-XrNvyJqUgTNNXNgatfAXZkXOYCg'

function App() {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [mins, setMins] = useState(0)
  const [secs, setSecs] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const [started, setStarted] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    attending: 'Si, parteciperò',
    guests: 1,
    message: ''
  })

useEffect(() => {
  const startAudio = async () => {
    if (audioRef.current && !started) {
      try {
        await audioRef.current.play()
        setIsPlaying(true)
        setStarted(true)
      } catch (err) {
        console.log('Riproduzione bloccata:', err)
      }
    }
  }

  const events = ['touchstart', 'click', 'keydown', 'mousemove', 'wheel']
  events.forEach(e => window.addEventListener(e, startAudio, { once: true }))

  return () => {
    events.forEach(e => window.removeEventListener(e, startAudio))
  }
}, [started])

useEffect(() => {
  const handleVisibility = () => {
    if (document.hidden) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }

  document.addEventListener('visibilitychange', handleVisibility)
  return () => document.removeEventListener('visibilitychange', handleVisibility)
}, [])

useEffect(() => {
  const revealElements = document.querySelectorAll('.reveal-section')

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 }
  )

  revealElements.forEach((element) => observer.observe(element))

  return () => observer.disconnect()
}, [])

  useEffect(() => {
    // Data del compleanno di Bea: 13 giugno 2026
    const targetDate = new Date('2026-06-13T00:00:00').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now

      if (distance > 0) {
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)))
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
        setMins(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
        setSecs(Math.floor((distance % (1000 * 60)) / 1000))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const FIELD_MAPPING = {
      name: '987928391',
      attending: '1991194064',
      guests: '1127880070',
      message: '1120818641'
    }

    const params = new URLSearchParams()
    params.append(`entry.${FIELD_MAPPING.name}`, formData.name)
    params.append(`entry.${FIELD_MAPPING.attending}`, formData.attending)
    params.append(`entry.${FIELD_MAPPING.guests}`, String(formData.guests))
    params.append(`entry.${FIELD_MAPPING.message}`, formData.message)

    const url = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse?${params.toString()}`

    // Invia tramite immagine (bypassa CORS)
    const img = new Image()
    img.src = url

    alert('Risposta inviata. Grazie per la conferma!')
    setFormData({
      name: '',
      attending: 'Si, parteciperò',
      guests: 1,
      message: ''
    })
  }

  return (

    <>
   
      <audio ref={audioRef} src={prettyAudio} loop preload="auto" playsInline autoPlay />
      
      <button className="music-toggle" onClick={toggleAudio} title={isPlaying ? 'Ferma musica' : 'Riproduci musica'}>
        {isPlaying ? (
          <svg className="music-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
        ) : (
          <svg className="music-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
            <line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2"></line>
          </svg>
        )}
      </button>
    
      <section className="hero reveal-section">
        <div className="hero-content">
          <img src={beaTitle} alt="Bea is turning two" className="hero-title-image" />
          <div className="hero-date">13 Giugno 2026</div>
        </div>
        <img src={divisoreFiore} alt="floral divider" className="divider divider--compact" />
      </section>

      <section className="countdown-section reveal-section">
        <div className="countdown-container">
          <h2 className="countdown-subtitle">Conto alla rovescia</h2>
          <p className="location-subtitle">Per il grande giorno</p>
          <div className="countdown-grid">
  <div className="countdown-box">
    <div className="countdown-number">{String(days).padStart(2, '0')}</div>
    <span className="countdown-label">Giorni</span>
  </div>
  <span className="countdown-separator">:</span>
  <div className="countdown-box">
    <div className="countdown-number">{String(hours).padStart(2, '0')}</div>
    <span className="countdown-label">Ore</span>
  </div>
  <span className="countdown-separator">:</span>
  <div className="countdown-box">
    <div className="countdown-number">{String(mins).padStart(2, '0')}</div>
    <span className="countdown-label">Minuti</span>
  </div>
  <span className="countdown-separator">:</span>
  <div className="countdown-box">
    <div className="countdown-number">{String(secs).padStart(2, '0')}</div>
    <span className="countdown-label">Secondi</span>
  </div>
          </div>
        </div>
        <img src={divisoreFiore} alt="floral divider" className="divider divider--compact" />
      </section>
      <section className="location-section reveal-section">
        <div className="location-container">
          <div className="location-header">
            <h2 className="location-title">Il luogo</h2>
            <p className="location-subtitle">Dove celebreremo l'amore per Bea</p>
          </div>

          <div className="location-card">
            <div className="location-icon-circle">
              <svg className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            <h3 className="location-place-name">Via Pablo Neruda 15</h3>
            
            <p className="location-city">Fara in Sabina</p>

            <div className="location-time">
              <svg className="time-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>dalle 10:00</span>
            </div>

            <p className="location-end-note">
              <strong>Nota:</strong> l'evento termina alle 14:00.
            </p>
<br />
            <div className="location-map">
          <iframe
  src="https://www.google.com/maps?q=Via+Pablo+Neruda+15,+02032+Fara+in+Sabina&output=embed"
  width="100%"
  height="250"
  style={{ border: 0, borderRadius: "8px" }}
  loading="lazy"
/>
            </div>

            <div className="location-buttons">
              <a href="https://www.google.com/maps/place/Via+Pablo+Neruda+15,+02032+Fara+in+Sabina" target="_blank" rel="noopener noreferrer" className="btn btn-maps">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Apri in Maps
              </a>
              <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Compleanno%20di%20Bea&dates=20260613T100000Z/20260613T140000Z&location=Via+Pablo+Neruda+15,+02032+Fara+in+Sabina" target="_blank" rel="noopener noreferrer" className="btn btn-calendar">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M3 10h18"></path>
                </svg>
                Aggiungi al calendario
              </a>
            </div>
          </div>
        </div>
        <br />
        <br />
        <img src={divisoreFiore} alt="floral divider" className="divider" />
      </section>

      <section className="dress-code-section reveal-section">
        <div className="dress-code-container">
          <h2 className="dress-code-title">Cosa portare</h2>
          <p className="dress-code-text">Il costume da bagno, sarà un pool party!<br/><br/><span className="dress-code-emojis">🏖️ 👙 ☀️</span></p>
        </div>
        <br />
        <br />
         <img src={divisoreFiore} alt="floral divider" className="divider" />
      </section>

    
      <section className="rsvp-section reveal-section">
        <div className="rsvp-container">
          <div className="rsvp-header">
            <h2 className="rsvp-title">Conferma la <br className="rsvp-break"/>tua partecipazione</h2>
            <p className="rsvp-subtitle">Non vediamo l'ora di vederti</p>
          </div>

          <form className="rsvp-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Il tuo nome"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Parteciperai? *</label>
              <div className="radio-group">
                <div className="radio-option">
                  <input
                    type="radio"
                    id="attending-yes"
                    name="attending"
                    value="Si, parteciperò"
                    checked={formData.attending === 'Si, parteciperò'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="attending-yes">Si, parteciperò</label>
                </div>
                <div className="radio-option">
                  <input
                    type="radio"
                    id="attending-no"
                    name="attending"
                    value="No, non potrò"
                    checked={formData.attending === 'No, non potrò'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="attending-no">No, non potrò</label>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="guests">Numero di invitati (incluso te)</label>
              <input
                type="number"
                id="guests"
                name="guests"
                min="1"
                max="10"
                value={formData.guests}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Un messaggio per noi (opzionale)</label>
              <textarea
                id="message"
                name="message"
                placeholder="Scrivi un messaggio..."
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn-submit">
              <svg className="submit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                <path d="m21.854 2.147-10.94 10.939"></path>
              </svg>
              Invia conferma
            </button>
          </form>
          
        </div>
      </section>

      <section className="footer-section reveal-section">
        <div className="footer-container">
          <h2 className="footer-title">Per maggiori informazioni contattateci:</h2>
          <a href="tel:+393291635893" className="footer-phone-item">
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Liana Krizia Palacio - +39 329 163 5893</span>
          </a>
          <a href="tel:+393911097112" className="footer-phone-item">
            <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>Pierluigi Valdez - +39 391 109 7112</span>
          </a>
           <div className="signature-section">
        <p className="signature-text">developed by Vanessa Joy</p>
      </div>
        </div>
      </section>

      <img src={animali} className="bottom-image bottom-image--desktop reveal-section" alt="Decorazione finale desktop" />
      <img src={animali2} className="bottom-image bottom-image--mobile reveal-section" alt="Decorazione finale mobile" />
    </>
  )
}

export default App
