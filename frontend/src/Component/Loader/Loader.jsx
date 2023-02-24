import React from 'react'
import Loading from './loading.gif'
const Loader = () => {
  return (
      <div className='parent' style={{display: "flex",justifyContent: "center", height: "83vh",alignItems: "center",}}>
      <img src={Loading}  alt="Loading..." />
    </div>
  )
}

export default Loader
