import { useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Navigate from './component/Navigate'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <BrowserRouter>          
        <Navigate/>   
      </BrowserRouter>
    </>
  )
}

export default App
