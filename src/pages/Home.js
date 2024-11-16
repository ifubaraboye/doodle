import React from 'react'
import Playgame from './Playgame'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <div className='grid justify-center my-40'>
            <h1 className='text-[100px]  motion-preset-oscillate motion-duration-2000 hover:cursor-pointer mb-5'>DOODLE</h1>

                <Link to="/doodle"><button className='border p-7 w-56 hover:bg-white hover:text-slate-950 font-semibold hover:motion-preset-pop '>START</button></Link>
                
        </div>
    </div>
  )
}

export default Home