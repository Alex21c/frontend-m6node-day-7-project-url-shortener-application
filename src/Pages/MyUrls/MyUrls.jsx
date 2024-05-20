import { Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import Navbar from "../../Components/NavBar/Navbar";
import { ContextURLShortenerWebApp } from "../../Components/Context/ContextURLShortener";
import SuccessAndErrorMsg, {showError, hideError, showSuccess} from "../../Components/Notifications/SuccessAndErrorMsg";
import SimpleSnackbar, {useSetInitialStateSnackbar, openTheSnackBar} from "../../Components/MUI/SimpleSnackBar";
import userEvent from "@testing-library/user-event";

export default function MyUrls(){
  let {stateContextURLShortenerApp, stateSuccessAndErrorMsg, updateStateSuccessAndErrorMsg, apiEndPointUrls} = useContext(ContextURLShortenerWebApp);
  const [open, setOpen] = useSetInitialStateSnackbar();
  let [stateURLsCreatedByUser, setStateURLsCreatedByUser] = useState(null);

  const [snackbarState, setSnackbarState] = useState({
    msg: "Shortened URL Successfully Copied inside yours device clipboard!",
    successOrError: "success"
  });
  // useEffect(()=>{console.log(snackbarState)}, [snackbarState]);


  useEffect(()=>{
    document.title="My URLs";
    hideError(updateStateSuccessAndErrorMsg);

    // Make a api call to get all the urls
    getAllTheURLsCreatedByCurrentUser();
  }, []);


  async function getAllTheURLsCreatedByCurrentUser(){
    // send request to the server
    try {      
      // i need to make send request to backend to authenticate
        const headers = {
          "Content-Type": "application/json",
          "auth-token": stateContextURLShortenerApp['auth-token']
        };
        
        const requestOptions = {
          method: "POST",
          headers: headers
        };
 

        let response = await fetch(apiEndPointUrls['get-all-urls-created-by-current-user'], requestOptions);
        if(!response){
          showError(updateStateSuccessAndErrorMsg, 'Unable to Fetch URLs from Server !');
          return;
        }
        response = await response.json();        
      // if sucess: false
        if(!response.success){          
          showSuccess(updateStateSuccessAndErrorMsg, response.message);
          return;
        }
      // here is the shortedURL
        hideError(updateStateSuccessAndErrorMsg); // if any
      // show it user and allow copying
      // console.log(response.body)
      setStateURLsCreatedByUser(response.body);
      
    } catch (error) {      
      console.log(error.message);
      showError(updateStateSuccessAndErrorMsg, 'Failed to Sign In');
    }


  }
  async function handleDeleteURLRequest(shortedURI){
    // console.log(shortedURI)
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
          body: JSON.stringify({
            shortedURI
          })
        };
 

        let response = await fetch(apiEndPointUrls['delete-a-document-created-by-this-current-user'], requestOptions);

        if(!response){
          // showError(updateStateSuccessAndErrorMsg, 'Unable to Delete Record!');

          setSnackbarState({
            msg: "Unable to Delete Record!",
            successOrError : "error"
          });
          
          openTheSnackBar(setOpen);
          return;
        }
        response = await response.json();      

      // if sucess: false
        if(!response.success){                    
          setSnackbarState({
            msg: response.message,
            successOrError : "error"
          });
          
          openTheSnackBar(setOpen);
          return;
        }
      // here is the shortedURL
        hideError(updateStateSuccessAndErrorMsg); // if any

      // Notify user successfully deleted 
          setSnackbarState({
            msg: "Record Deleted Successfully!",
            successOrError : "success"
          });
          
          openTheSnackBar(setOpen);     
          
      // now refetch the records
      setStateURLsCreatedByUser(null); 
      getAllTheURLsCreatedByCurrentUser();
      
    } catch (error) {      
      console.log(error.message);
      setSnackbarState({
        msg: "Failed to Delete the Shortened URL",
        successOrError : "error"
      });
      
      openTheSnackBar(setOpen);
    }


  }

  async function copyTextToClipboard(shortedURL){

    await navigator.clipboard.writeText(shortedURL); 
    setSnackbarState({
      msg: "Shortened URL Successfully Copied inside yours device clipboard!",
      successOrError: "success"
    });

    openTheSnackBar(setOpen);
  }

  return (
    <div className="pageWrapper mt-[2rem] pt-[1rem] p-[2rem] max-w-[120rem]  m-auto rounded-md  text-[1.2rem] text-stone-200 flex flex-col gap-[2rem] items-center">
      {
        snackbarState && <SimpleSnackbar open={open} setOpen={setOpen} snackbarState={snackbarState}/>
      }
      

      <Navbar/>
      {
        stateContextURLShortenerApp?.['auth-token'] ? 
         (
          <>
              <h2 className='text-[1.8rem] flex flex-col gap-[.2rem] items-center' >
                <i className="fa-solid fa-link text-[2.5rem] hover:text-yellow-300 transition"></i>
                <span className="font-medium">URL Shortner WebApp</span>                
              </h2>
              <SuccessAndErrorMsg  stateSuccessAndErrorMsg={stateSuccessAndErrorMsg}/> 

              {
                stateURLsCreatedByUser &&       
                stateURLsCreatedByUser.map(document=>{
                  return (
                  <div key={document.shortedURI} className="flex gap-[1rem] p-[1rem] rounded-md shadow-md bg-slate-700 shadow-green-300" >
                    <dl className="w-[30rem] flex flex-col gap-[.5rem]">
                      <div className="flex gap-[.8rem]">
                          <dt className="font-medium">Traffic</dt>
                          <dd>{document.traffic}</dd>
                      </div>
                      <div className="flex gap-[.8rem]">
                        <dt className="font-medium">shortedURL</dt>
                        <dd className="italic">
                          <a href={document.shortedURL} className="text-blue-300 hover:text-white transition font-medium flex gap-[.2rem] items-center">{document.shortedURL} </a>                          
                        </dd>
                      </div>
                      <div className="flex gap-[.8rem] w-[100%]">
                        <dt className="font-medium">destinationURL</dt>                        
                        <dd className="italic w-[100%]">
                          <textarea readOnly className="bg-transparent w-[100%] h-[10rem] p-[.5rem]" defaultValue={document.destinationURL}/>                     
                        </dd>                                     
                      </div>

                    </dl>
                    <div className="flex gap-[.8rem] flex-col">
                      <button   
                        onClick={()=>{
                          copyTextToClipboard(document.shortedURL)
                        }} 
                        className="select-none wrapperGeneratePassword flex gap-[1rem] items-center justify-center outline outline-2 outline-amber-50  hover:bg-emerald-300 transition cursor-pointer  rounded-full px-[.5rem] py-[.1rem]  hover:text-slate-900 text-slate-50    text-[1.5rem]  bg-emerald-500 ">        
                        <i title="Copy URL" className="cursor-pointer fa-sharp fa-solid fa-copy "></i>
                      </button>

                      <button 
                        title="DELETE Permanently!"
                        onClick={
                        (event)=>{

                          handleDeleteURLRequest(event.target.getAttribute('shorturi'));
                        }
                        } 
                        shorturi={document.shortedURI} className="font-semibold  outline outline-2 outline-amber-50 bg-red-500 hover:bg-red-300 transition cursor-pointer pt-[.5rem] rounded-full pb-[.4rem] p-[.8rem]  hover:text-slate-900 text-slate-50 text-[1rem]">
                        <i className="fa-solid fa-trash" shorturi={document.shortedURI} ></i>
                      </button>

                    </div>       
                  </div>             
                  )
                })       
    
              }

            



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