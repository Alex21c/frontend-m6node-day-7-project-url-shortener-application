import { useRef } from "react";
import { ContextURLShortenerWebApp } from "../../Components/Context/ContextURLShortener";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import SuccessAndErrorMsg, {showError, hideError} from "../../Components/Notifications/SuccessAndErrorMsg";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState } from "react";
import './SignIn.css';
import { useContext } from "react";
// let email='customer@alex21c.com';
// let password='customer123$';
import Navbar from "../../Components/NavBar/Navbar";

export default function SignIn(){  
  
  let {stateWhoIsCurrentPage, updateStateWhoIsCurrentPage, stateSuccessAndErrorMsg, updateStateSuccessAndErrorMsg, stateUserAuthMetaData, apiEndPointUrls, stateContextURLShortenerApp, setStateContextURLShortenerApp} = useContext(ContextURLShortenerWebApp);

// now checking if auth-token is present
  let navigate = useNavigate();
  // if this token is present no need to show login form, just redirect user to the treasure
    if(stateContextURLShortenerApp['auth-token']){
      navigate("/");
    }

// rest of the code
  let refEmail = useRef(null);
  let refPassword = useRef(null);

  function handleSignInRequest(event){
    event.preventDefault();
    //console.log('listening...');
    // Safeguard
      if(refEmail.current.value === "" || refPassword.current.value === ""){
        return;
      }
      validateSignInRequest(refEmail.current.value, refPassword.current.value)
    
  } 

 


  async function validateSignInRequest(email, password){
    try {      
      // i need to make send request to backend to authenticate
        const headers = {
          "Content-Type": "application/json"
        };
        
        const requestOptions = {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            email, password
          })
        };
 

        let response = await fetch(apiEndPointUrls['sign-in'], requestOptions);
        if(!response){
          showError(updateStateSuccessAndErrorMsg, 'Unable to Sign In.');
          return;
        }
        response = await response.json();        
      // is email or password invalid ?
        if(!response.success){          
          showError(updateStateSuccessAndErrorMsg, response.message);
          return;
        }
        // console.log(response);  
      // up to here, all is right, i have received the token
      // now store this token in the local storage
      setStateContextURLShortenerApp(previousState=>{
        return {
          ...previousState,
          ['auth-token']: response.message
        }
      });
      
    } catch (error) {      
      console.log(error.message);
      showError(updateStateSuccessAndErrorMsg, 'Failed to Sign In');
    }

  }



  useEffect(()=>{

    hideError(updateStateSuccessAndErrorMsg);
    // testing();
  },[]);

  useEffect(()=>{
    document.title="Sign In";
    
  },[]);

  return (
    <div className="pageWrapper mt-[2rem] pt-[1rem] border-0 border-slate-200 p-[2rem] max-w-[120rem]  m-auto rounded-md  text-[1.2rem] text-stone-200 ">
      

      <div  className='flex flex-col items-center  pb-[5rem] pt-[1rem]'>
        <Navbar/>


        <h2 className=" text-stone-200 flex gap-[.5rem] items-center displayNone">
            <i className="fa-solid fa-right-to-bracket text-[1.8rem]"></i>
            <span className="smallCaps text-[2rem] font-medium">Sign In</span>     
        </h2>

        {
          !stateContextURLShortenerApp?.['auth-token'] ? 
          <>
              <form className="signInForm flex flex-col gap-[.5rem] w-[20rem]" method="post">
                <input ref={refEmail} type="email" placeholder="e-Mail" className=" text-stone-700 transition focus:outline focus:outline-2 focus:outline-green-500 p-[1rem] pr-[3rem] rounded-md bg-stone-200 relative w-[100%]" name='email'/>
                <input ref={refPassword} type="password" placeholder="password" className=" text-stone-700 transition focus:outline focus:outline-2 focus:outline-green-500 p-[1rem] pr-[3rem] rounded-md bg-stone-200 relative w-[100%]" name='password' />
                <SuccessAndErrorMsg  stateSuccessAndErrorMsg={stateSuccessAndErrorMsg}/> 
                <button onClick={handleSignInRequest} className="outline-amber-50 bg-yellow-300 hover:bg-yellow-500 transition cursor-pointer px-[1.3rem] py-[.3rem] rounded-md hover:text-slate-50 text-stone-700 text-[1.5rem] flex gap-[.5rem] items-center justify-center">
                      <i className="fa-solid fa-right-to-bracket  text-[2rem]"></i>
                      <span className="text-[1.5rem] font-medium">Sign In</span>
                    </button>
              </form>

           
          </>
          :
          <>

          </>

        }
      </div>

      
    </div>    
  );
}