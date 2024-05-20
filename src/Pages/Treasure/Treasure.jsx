import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../../Components/NavBar/Navbar";
import { ContextURLShortenerWebApp } from "../../Components/Context/ContextURLShortener";
import SuccessAndErrorMsg, {showError, hideError} from "../../Components/Notifications/SuccessAndErrorMsg";
import SimpleSnackbar, {useSetInitialStateSnackbar, openTheSnackBar} from "../../Components/MUI/SimpleSnackBar";

export default function Treasure(){

  let {stateContextURLShortenerApp, stateSuccessAndErrorMsg, updateStateSuccessAndErrorMsg, apiEndPointUrls} = useContext(ContextURLShortenerWebApp);
  const [open, setOpen] = useSetInitialStateSnackbar();
  let [stateShortedURL, setStateShortedURL] = useState(null);

  useEffect(()=>{
    document.title="Home : URL Shortener WebApp";
    hideError(updateStateSuccessAndErrorMsg);
  }, []);

  let refLongURL = useRef(null);
  let refCustomBackHalf= useRef(null);
  async function shortenLongURL(objJsonData){
    // send request to the server
    try {      
      // i need to make send request to backend to authenticate
        const headers = {
          "Content-Type": "application/json",
          "auth-token": stateContextURLShortenerApp['auth-token']
        };
        
        const requestOptions = {
          method: "POST",
          headers: headers,
          body: JSON.stringify(objJsonData)
        };
 

        let response = await fetch(apiEndPointUrls['short-url'], requestOptions);
        if(!response){
          showError(updateStateSuccessAndErrorMsg, 'Unable to Short Error !');
          return;
        }
        response = await response.json();        
      // if sucess: false
        if(!response.success){          
          showError(updateStateSuccessAndErrorMsg, response.message);
          return;
        }
      // here is the shortedURL
        hideError(updateStateSuccessAndErrorMsg); // if any
      // show it user and allow copying
        setStateShortedURL(response.shortedURL);
      
    } catch (error) {      
      console.log(error.message);
      showError(updateStateSuccessAndErrorMsg, 'Failed to Sign In');
    }

  }
  function handleRequestShortenURL(event){
    event.preventDefault();    
    // Safeguard
      if(refLongURL.current.value === ""){
        return;
      }
      shortenLongURL({
        destinationURL: refLongURL.current.value,
        customBackHalf: refCustomBackHalf.current.value
      });
    
  } 

  async function copyTextToClipboard(){

    await navigator.clipboard.writeText(stateShortedURL); 
    openTheSnackBar(setOpen);
  }

  return (
    <div className="pageWrapper mt-[2rem] pt-[1rem] p-[2rem] max-w-[120rem]  m-auto rounded-md  text-[1.2rem] text-stone-200 flex flex-col gap-[2rem] items-center">
      <SimpleSnackbar open={open} setOpen={setOpen}/>
      <Navbar/>
      <h2 className='text-[1.8rem] flex flex-col gap-[.2rem] items-center mt-[-2rem]' >
          <i className="fa-solid fa-link text-[2.5rem] hover:text-yellow-300 transition"></i>
          <span className="font-medium">URL Shortner WebApp</span>                
      </h2>

      {
        
        stateContextURLShortenerApp?.['auth-token'] ? 
         (
          <>


             
              {
                stateShortedURL ?
                <div className="flex  flex-col gap-[.5rem] w-[30rem]">
                  <div className="flex gap-[.5rem]">
                    <textarea readOnly value={stateShortedURL} type="text" placeholder="ShortedURL" className=" text-stone-700 transition focus:outline focus:outline-2 focus:outline-green-500 p-[1rem] pr-[3rem] rounded-md bg-stone-300 relative w-[100%] h-[4rem]" name='shortedURL'>
                      
                    </textarea>
                    <button onClick={copyTextToClipboard} className="select-none wrapperGeneratePassword flex gap-[1rem] items-center justify-center outline outline-2 outline-amber-50  hover:bg-yellow-400 transition cursor-pointer px-[1rem] py-[.5rem] rounded-md hover:text-white text-slate-900    text-[2rem]  bg-yellow-300 ">        
                    <i title="Copy URL" className="cursor-pointer fa-sharp fa-solid fa-copy "></i>
                    </button>
                  </div>

                  <button onClick={()=>setStateShortedURL(null)} className="outline-amber-50 bg-yellow-300 hover:bg-yellow-500 transition cursor-pointer px-[1.3rem] py-[.3rem] rounded-md hover:text-slate-50 text-stone-700 text-[1.5rem] flex gap-[.5rem] items-center justify-center">
                        <i className="fa-solid fa-link  text-[2rem]"></i>
                        <span className="text-[1.5rem] font-medium">Shorten Another URL</span>
                      </button>
                  
                </div>
                :
                <form className="flex flex-col gap-[.5rem] w-[30rem] mt-[-.5rem]" method="post">
                  <textarea ref={refLongURL} type="text" placeholder="Long URL e.g. https://github.com/Alex21c/m6node-day-7-project-url-shortener-application" className=" text-stone-700 transition focus:outline focus:outline-2 focus:outline-green-500 p-[1rem] pr-[3rem] rounded-md bg-stone-200 relative w-[100%] h-[9rem]" name='longURL'/>
                  <textarea ref={refCustomBackHalf} type="text" placeholder="Custom Back Half e.g. alex21c (Optional)" className=" text-stone-700 transition focus:outline focus:outline-2 focus:outline-green-500 p-[1rem] pr-[3rem] rounded-md bg-stone-200 relative w-[100%] h-[4rem]" name='customBackHalf'/>
                  <SuccessAndErrorMsg  stateSuccessAndErrorMsg={stateSuccessAndErrorMsg}/> 
                  <button onClick={handleRequestShortenURL} className="outline-amber-50 bg-yellow-300 hover:bg-yellow-500 transition cursor-pointer px-[1.3rem] py-[.3rem] rounded-md hover:text-slate-50 text-stone-700 text-[1.5rem] flex gap-[.5rem] items-center justify-center">
                        <i className="fa-solid fa-link  text-[2rem]"></i>
                        <span className="text-[1.5rem] font-medium">Shorten URL</span>
                      </button>
               </form>     

              }
              
              

            



</>

        ) : (
          <div className="flex flex-col gap-[.5rem]"> 
            <h2 className='text-[1.7rem] italic '>You're not logged in !</h2>
          </div>

        )
      } 
    </div>
    
  );
}