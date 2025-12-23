// import React, { useState } from 'react'
// import Chatbox from './Chatbox';


// const User = () => {
//   const [Username, setUsername] = useState('');
//   const [Activechat, Setactivechat] = useState(false);
//   const [Darkmode,Setdarkmode] = useState(false)
  
//   const handelOnclick = (e) => {
//     e.preventDefault();
//     if (Username === "") {
//       alert("please enter the username")
//     }
//     else {
//       Setactivechat(true);
//     }
//   }
//   return (
//     <>
    
//       {Activechat?<Chatbox Username={Username}></Chatbox>:<div className='  flex flex-col justify-center items-center   h-screen'>
//     <div className= {Darkmode?"dark-mode":"light-mode"}>enter your user name here</div>
//     <form onSubmit={(e)=>handelOnclick(e)}  className=''>
//             <input className=' border border-black text-black dark:text-white ' type="text" name='Username' value={Username} onChange={(e) =>  setUsername(e.target.value) } />
//           <button className=' text-white  font-bold p-2 m-1 rounded-2xl ' type='submit'>submit</button>
//         </form>
//         </div>}
      
        
//       </>
//   )
// }

// export default User


import React, { useState } from "react";
import Chatbox from "./Chatbox";

const User = () => {
  const [Username, setUsername] = useState("");
  const [Activechat, setActivechat] = useState(false);
  const [Darkmode, setDarkmode] = useState(false);

  const handleOnClick = (e) => {
    e.preventDefault();
    if (!Username.trim()) {
      alert("Please enter username");
      return;
    }
    setActivechat(true);
  };

  return (
    <>
      <div className= {`${Darkmode ? "dark-mode" : "light-mode"} flex justify-end`} >
         <label className={ ` m-1  w-[20vh] rounded-2xl`}>
        <input type="checkbox" name="checkbox" className="accent-blue-500" onChange={()=>(setDarkmode(!Darkmode))} />
        {Darkmode?"brightmode":"darkmode" }
      </label>
      </div>
      
      {Activechat ? (
        <Chatbox Username={Username} Darkmode={Darkmode} />
      ) : (
        <div className={`${Darkmode ? "dark-mode" : "light-mode"} flex flex-col justify-center items-center h-screen p-4`}>
          
          <div className={`${Darkmode ? "dark-mode" : "light-mode"} m-2 text-lg font-semibold`}>
            Enter your username here
            </div>
           

          <form onSubmit={handleOnClick} className="flex flex-col gap-2 m-2 w-full max-w-sm">
            <input
              type="text"
              value={Username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${Darkmode ? "dark-mode" : "light-mode"} p-2 rounded`}
            />
            <button
              type="submit"
              className={`${Darkmode ? "dark-mode" : "light-mode"} p-2 rounded font-bold mt-2`}
            >
              Submit
            </button>
          </form>

          
        </div>
      )}
    </>
  );
};

export default User;
