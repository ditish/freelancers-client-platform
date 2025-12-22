import React, { useState } from 'react'
import Chatbox from './Chatbox';

const User = () => {
  const [Username, setUsername] = useState('');
  const [Activechat, Setactivechat] = useState(false);
  
  const handelOnclick = (e) => {
    e.preventDefault();
    if (Username === "") {
      alert("please enter the username")
    }
    else {
      Setactivechat(true);
    }
  }
  return (
    <>
      {Activechat?<Chatbox Username={Username}></Chatbox>:<div className='  flex flex-col justify-center items-center  h-screen'>
    <div className='text-white font-semibold mb-1 '>enter your user name here</div>
    <form onSubmit={(e)=>handelOnclick(e)}  className=''>
            <input className='input border border-amber-50 ' type="text" name='Username' value={Username} onChange={(e) =>  setUsername(e.target.value) } />
          <button className='submit text-white font-semibold p-2 m-1 rounded-2xl ' type='submit'>submit</button>
        </form>
        </div>}
      
        
      </>
  )
}

export default User