import React from 'react'
import packageJson from './../../package.json';

const WaterMark = () => {
  const textStyle = {
    position: 'fixed',
    right: '10vh',
    bottom: '1vh',
    color: '#7B7B7B'
  } as React.CSSProperties
  
  return (
    <div>
      <h5 style={{
          position: 'fixed',
          right: '10vh',
          bottom: '3vh',
          color: '#7B7B7B'
      }} >
        {packageJson.name} {packageJson.version}
      </h5>
      <a href={'https://github.com/andaccc'} target="_blank" rel="noreferrer">
        <p style={textStyle}>github.com/andaccc</p>
      </a>
    </div>
  )
}

export default WaterMark