
import { createContext, useEffect, useState } from "react";
export const ContextURLShortenerWebApp = createContext(null);

async function isAuthTokenValid(authToken, apiEndPointUrls){
  if(!authToken && !apiEndPointUrls){
    return;
  }
  try {      
    // i need to make send request to backend to authenticate
      const headers = {
        "Content-Type": "application/json",
        "auth-token": authToken
      };
      
      const requestOptions = {
        method: "POST",
        headers: headers
      };
// console.log(apiEndPointUrls)

      let response = await fetch(apiEndPointUrls['validate-auth-token'], requestOptions);
      if(!response){       
        throw new Error("Unable to to process current request!");
      }
      response = await response.json();        
      // console.log(response);
    // return 
      return response.isAuthTokenValid;
    
  } catch (error) {      
    console.log(error.message);
  }

}

async function performHandshakeWithServer(apiEndPointUrls, setStateContextURLShortenerApp){
  try {
    console.log('performing handshake with server');
    // throw new Error('testing')
      
    const requestOptions = {
      method: "GET"
    };    
    let response = await fetch(apiEndPointUrls['handshake'], requestOptions);
    if(!response){       
      throw new Error("Unable to to process current request!");
    }
    response = await response.json();        
    // console.log(response);
    // save it into state   
      const handshakeInfo= {
        success: response.success,
        timestamp: new Date()
      };

    // console.log(handshakeInfo);
    setStateContextURLShortenerApp(previousState=>{
      return {
        ...previousState,
        handshakeInfo: handshakeInfo 
      }
    })


  } catch (error) {
    console.log("ERROR: " + error.message);
    console.log('unable to perform handshake with the server!');
  }
}

function isTimeStamp10MinutesOlder(previousTimeStamp){
  // console.log(previousTimeStamp);
  previousTimeStamp = new Date(previousTimeStamp)
  let currentTimestamp = new Date();
  let tenMinues = 10*60*1000;
  // let tenMinues = 1000;
  let difference = currentTimestamp- previousTimeStamp;
  // console.log(difference)
  if(difference > tenMinues){
    return true;
  }else{
    return false;
  }

}

const ContextProviderURLShortenerWebApp = ({children}) =>{
  let apiEndPointUrlsLocalhost = {
    'handshake': "http://localhost:4000/handshake/hello",
    'sign-in': "http://localhost:4000/api/v1/user/sign-in",
    'sign-up':"http://localhost:4000/api/v1/user/sign-up",
    'validate-auth-token': "http://localhost:4000/api/v1/user/validate-auth-token",
    'short-url': "http://localhost:4000/api/v1/short-url",
    'get-all-urls-created-by-current-user': "http://localhost:4000/api/v1/get-all-urls-created-by-current-user",
    'delete-a-document-created-by-this-current-user': "http://localhost:4000/api/v1/delete-a-document-created-by-this-current-user"
  };
  let apiEndPointUrls = {
    'handshake': "http://m6node-day-7-project-url-shortener.onrender.com/handshake/hello",
    'sign-in': "https://m6node-day-7-project-url-shortener.onrender.com/api/v1/user/sign-in",
    'sign-up':"https://m6node-day-7-project-url-shortener.onrender.com/api/v1/user/sign-up",
    'validate-auth-token': "https://m6node-day-7-project-url-shortener.onrender.com/api/v1/user/validate-auth-token",
    'short-url': "https://m6node-day-7-project-url-shortener.onrender.com/api/v1/short-url",
    'get-all-urls-created-by-current-user': "https://m6node-day-7-project-url-shortener.onrender.com/api/v1/get-all-urls-created-by-current-user",
    'delete-a-document-created-by-this-current-user': "https://m6node-day-7-project-url-shortener.onrender.com/api/v1/delete-a-document-created-by-this-current-user"
  };

  // testing
  // apiEndPointUrls = apiEndPointUrlsLocalhost;

  let initialAppState = localStorage.getItem('Alex21CURLShortenerApp');
  if(initialAppState){
    initialAppState = JSON.parse(initialAppState);
  }else{
    initialAppState = {
      handshakeInfo: {
        success: false,
        timestamp: new Date()
      }
    };
  }
  let [stateContextURLShortenerApp, setStateContextURLShortenerApp] = useState(initialAppState);
  let [stateWhoIsCurrentPage, updateStateWhoIsCurrentPage] = useState(null);
  let [stateUserAuthMetaData, updateStateUserAuthMetaData] = useState(null);
  let [stateSuccessAndErrorMsg, updateStateSuccessAndErrorMsg] = useState({
    style: {
      Success: "text-green-300 text-[1.5rem]",
      Error: "text-red-300 text-[1.5rem]"
    },
    msgType: "Success",
    msg: "",
    displayNone: 'displayNone'        
  
  });

  // useEffect(()=>{
  //   console.log(stateContextURLShortenerApp);
  // }, [stateContextURLShortenerApp]);

  useEffect(()=>{
    // first check the local strogage about when was the last handshake performed
    // if more than 10 minutes have been passed then re perform handshake
      
      const makeAsyncCall = async ()=>{
        
        await performHandshakeWithServer(apiEndPointUrls, setStateContextURLShortenerApp);
      };
    
      let doIneedToPerformHandshake = false;
      if(stateContextURLShortenerApp?.handshakeInfo){
        // console.log(isTimeStamp10MinutesOlder(stateContextURLShortenerApp?.handshakeInfo?.timestamp))
        // is it fresh or 10 minutes have been passed
          if(isTimeStamp10MinutesOlder(stateContextURLShortenerApp?.handshakeInfo?.timestamp)){
            doIneedToPerformHandshake=true;
            // console.log('isTimeStamp10MinutesOlder')
          }
        // just check is last time there was failure response in handshake?
          else if(stateContextURLShortenerApp.handshakeInfo.success === false){
            doIneedToPerformHandshake=true;
          }
          
      }
  
      if(doIneedToPerformHandshake){
        makeAsyncCall();
      }
      
      

  }, []);

  // useEffect() can be used to initialize and update states here as well
    useEffect(()=>{
      localStorage.setItem('Alex21CURLShortenerApp', JSON.stringify(stateContextURLShortenerApp));
      let authToken = stateContextURLShortenerApp['auth-token'];   

      
      // verify that is authToken Valid, by making req to server
        if(authToken?.length>0){      
          const isAuthTokenValidOrNot = async ()=>{
            try {
              let response = await isAuthTokenValid(authToken, apiEndPointUrls);
              // console.log(response);
               if(response === false){
                setStateContextURLShortenerApp(previousState=>{
                  let newState = {...previousState};
                  delete newState['auth-token'];
                  return {
                    ...newState,        
                  };
                })            
                // console.log('invalid token')    
              }
              
            } catch (error) {
              console.log('there is an error validation auth token!')
            }

 
          }          
          isAuthTokenValidOrNot();
   
        }
        
    }, [stateContextURLShortenerApp, apiEndPointUrls]);

 
  const contextValue = {
    stateWhoIsCurrentPage, updateStateWhoIsCurrentPage,
    stateUserAuthMetaData, updateStateUserAuthMetaData,
    stateSuccessAndErrorMsg, updateStateSuccessAndErrorMsg,
    stateContextURLShortenerApp, setStateContextURLShortenerApp,
    apiEndPointUrls
  };
 
  return (
    <ContextURLShortenerWebApp.Provider value={contextValue}>
      {children}
    </ContextURLShortenerWebApp.Provider>
  );
}

export default ContextProviderURLShortenerWebApp;