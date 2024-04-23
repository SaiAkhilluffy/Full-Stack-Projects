import React, { useState } from "react";
import files from "../images/files.png";
import home from "../images/home.png";
import search from "../images/search.png";
import image1 from "../images/userIcon.png";
import AddJournal from "./AddJournal";
import InfoTable from "./InfoTable";

function HodMain() {
    let [stateFilesBg, setStateFilesBg] = useState(false);
  let [stateHomeBg, setStateHomeBg] = useState(false);
  let [publicationType, setPublicationType] = useState(false);
  let [value, setStatus] = useState("select");
  const funcFilesBg = () => {
    setStateHomeBg(false);
    setStateFilesBg(!stateFilesBg);
  };
  const funcHomeBg = () => {
    setStateFilesBg(false);
    setStateHomeBg(!stateHomeBg);
    setPublicationType(false);
   
  };

  const funcPublication = () => {
    setPublicationType(true);
  };

  return (
    <div>
         <div className="container bg-[#B5BEB2] min-h-[711px] ">
       
      <div className="h-20 flex ">
        <img
          className="w-10 h-10 display-block mx-auto mr-10 mt-5"
          src={image1}
          alt=""
        ></img>
      </div>
      <hr className="w-100% h-1  bg-[#6c8764]  " />
      <div className="grid grid-cols-12">
        {/* left bar navigation */}
        <div className="col-span-4">
          <div className="grid grid-cols-12">
            <div className="bg-[#7c9175] w-11 h-[629px] col-span-1  flex  mr-24">
              <div>
                {stateHomeBg === false && (
                  <img
                    className="mt-5 ml-1 w-9 h-10"
                    src={home}
                    onClick={() => {
                      funcHomeBg();
                    }}
                    alt=""
                  />
                )}
                {stateHomeBg === true && (
                  <div className="bg-[#B2BEB5] h-12 w-12 flex mt-3">
                    <img
                      className="mt-2 ml-1 w-9 h-10"
                      onClick={() => {
                        funcHomeBg();
                      }}
                      src={home}
                      alt=""
                    />
                  </div>
                )}
                {stateFilesBg === false && (
                  <img
                    className="mt-5 ml-2 w-7  h-8"
                    src={files}
                    alt=""
                    onClick={() => {
                      funcFilesBg();
                    }}
                  />
                )}
                {stateFilesBg === true && (
                  <div className="bg-[#B2BEB5] h-12 w-12 flex mt-3">
                    {" "}
                    <img
                      className="mt-2 ml-2 w-7  h-8 "
                      src={files}
                      alt=""
                      onClick={() => {
                        funcFilesBg();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {stateFilesBg === true && (
              <div className="h-[629px] col-span-5 bg-[#5e7f66]">
                <div className="max-w-md mx-auto">
                  <div className="relative flex items-center w-44 h-10 rounded-full focus-within:shadow-lg bg-white overflow-hidden mt-8 ml-5">
                    <input
                      className="peer h-full w-full outline-none text-sm text-gray-700 pl-4"
                      type="text"
                      id="search"
                      placeholder="Search something.."
                    />
                    <div className="grid place-items-center h-full w-12 text-gray-300">
                      <img
                        src={search}
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        alt=""
                      ></img>
                    </div>
                  </div>
                </div>
                
              </div>
            )}
          </div>
        </div>
       <div className="col-span-8">
        <div className="w-100"><InfoTable/></div>
       </div>
       
      </div>
          
    </div>
    
    </div>
  )
              }
export default HodMain