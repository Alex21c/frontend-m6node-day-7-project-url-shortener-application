import { Link, useRouteError } from "react-router-dom";

export default function NotFound(){
  let error = useRouteError();
  return (
    <div className="flex flex-col gap-[.5rem] p-[1rem] text-stone-300">
      <span>ERROR <strong>{error.status}</strong> : {error.statusText} !</span>
      <Link to="/" className="underline text-blue-500" >Click here to go back to Homepage</Link>
    </div>
  );
}