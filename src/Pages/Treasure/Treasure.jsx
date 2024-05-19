import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import Navbar from "../../Components/NavBar/Navbar";
import { ContextURLShortenerWebApp } from "../../Components/Context/ContextURLShortener";


export default function Treasure(){
  let {stateContextURLShortenerApp} = useContext(ContextURLShortenerWebApp);
  // useEffect(()=>{
  //   console.log(stateUserAuthMetaData)
  // }, [stateUserAuthMetaData]);


  return (
    <div className="pageWrapper mt-[2rem] pt-[1rem] p-[2rem] max-w-[120rem]  m-auto rounded-md  text-[1.2rem] text-stone-200 flex flex-col gap-[2rem] items-center">
      <Navbar/>
      {
        stateContextURLShortenerApp?.['auth-token'] ? 
         (
          <>
              <div className="rounded-md overflow-hidden w-[30rem] h-[20rem] shadow-2xl shadow-green-300">
                <img className="w-[100%] h-[100%] object-cover" src={require('../../Assests/Images/treasure.jpg')} alt="treasure image"/>
              </div>
              <h2 className='text-[1.8rem]' >Well done! Treasure is Yours !</h2>

</>

        ) : (
          <div className="flex flex-col gap-[.5rem]"> 
            <h2 className='text-[1.8rem]'>You are not logged in !</h2>
          </div>

        )
      } 
    </div>
    
  );
}