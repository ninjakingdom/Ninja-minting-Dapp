import { useState, useEffect } from "react";

const CountDown = () => {
  const [hours, setHours] = useState(0);
  const [minutues, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date("16 February 2023 23:59 GMT+8");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60))
      );
      setHours(h);

      const m = Math.floor(
        (difference % (1000 * 60 * 60) / (1000 * 60))
      );
      setMinutes(m);

      const s = Math.floor(
        (difference % (1000 * 60) / 1000)
      );
      setSeconds(s);
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='bgContainer'>
      <video
        autoPlay
        loop
        muted
        playsInline
        className='bg'
      >
        <source
          // eslint-disable-next-line max-len
          src="Temple.mp4"
          type="video/mp4" />
      </video>
      <a href='https://theninjakingdom.com' target="_blank" rel="noopener" >
        <img className='logo' src='logo.png'></img>
      </a>
      <div className="wrapper">
        <div className='countdown-timer'>
          <div className="timer-items">
            <div className="hours">
              <h3>{hours}</h3>
              <span>Hours</span>
            </div>
          </div>
          <div className="timer-items">
            <div className="minutes">
              <h3>{minutues}</h3>
              <span>Minutes</span>
            </div>
          </div>
          <div className="timer-items">
            <div className="seconds">
              <h3>{seconds}</h3>
              <span>Seconds</span>
            </div>
          </div>
        </div>
      </div>
      <h1 className="live-soon">NINJA LIST MINT IS LIVE SOON</h1>
    </div>
  )
}

export default CountDown;