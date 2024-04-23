import React, { useState, useEffect } from "react";
import files from "../images/files.png";
import home from "../images/home.png";
import search from "../images/search.png";
import image1 from "../images/userIcon.png";
// ICONS
import { HiMenu } from "react-icons/hi"
import { GrHomeRounded } from "react-icons/gr"
import { BsFiles } from "react-icons/bs"

// LINKS
import { Link, NavLink } from "react-router-dom"

// COMPONENTS
import SideMenu from "./SideMenu";
import HomePage from "./HomePage";
import LandingPage from "./LandingPage";
// ADD JOURNAL / CONFERENCE
import AddConference from "./AddConference";
import AddJournal from "./AddJournal";
// VIEW
import ViewConferences from "./ViewConferences";
import ViewJournals from "./ViewJournals";
import ViewAllPublications from "./ViewAllPublications";
// MODIFY
import ModifyJournal from "./ModifyJournal";
import ModifyConference from "./ModifyConference";
import ModifyPublication from "./ModifyPublication";

// Generalize any one structure and change other one accordingly
// Similarly we get viewJournals

function Main() {

  const [open, setOpen] = useState(true);
  const [FilesSubMenu, setFilesSubMenu] = useState(false);

  const [addPublications, setAddPublications] = useState(false);
  const [viewPublications, setViewPublications] = useState(false);
  const [modifyPublications, setModifyPublications] = useState(false);
  // Variables to Handle SideMenu Icons and Background ---------------
  let [FilesBg, setFilesBg] = useState(false);
  let [HomeBg, setHomeBg] = useState(true);
  let [publicationType, setPublicationType] = useState(false);
  // let [viewConferences, setViewConferences] = useState(false);

  // Used to set Publication Type in Files
  let [value, setStatus] = useState("select");


  // HANDLING THE BACKGROUNDS -- Set and Unset of Values of the Varaibles -------
  async function funcHomeBg() {
    // Things that must be false
    setFilesBg(false);          // remove the background of Files
    setFilesSubMenu(false);     // close the submenu
    setAddPublications(false);
    setViewPublications(false);
    // Things that must be true
    setHomeBg(true);            // Toggle The background of Files
  };

  async function funcFilesBg() {
    // Things that must be false
    setHomeBg(false);
    setAddPublications(false);
    setViewPublications(false);
    // Things that must be true
    setFilesBg(true);          // remove the background of Files
    setFilesSubMenu(!FilesSubMenu)
  }

  async function selectAddPublications() {
    console.log("Publications Selected")
    // Things that must become false
    setStatus('select')
    setViewPublications(false);
    setModifyPublications(false);
    setFilesBg(false);
    setHomeBg(false);
    // Things that must be true
    setAddPublications(true);
  }

  async function selectViewPublications() {
    console.log("View Publications Selected")
    // Things that must become false
    setStatus('select')
    setAddPublications(false);
    setModifyPublications(false);
    setFilesBg(false);
    setHomeBg(false);
    // Things that must be true
    setViewPublications(true);
  }

  async function selectModifyPublications() {
    console.log("Modify Publications Selected")
    // Things that must become false
    setStatus('select')
    setAddPublications(false);
    setViewPublications(false);
    setFilesBg(false);
    setHomeBg(false);
    // Things that must be true
    setModifyPublications(true);
  }

  async function HandleError() {
    //Nothing
  }

  const menu_items = [
    {
      name: "Home", link: "/", icon: GrHomeRounded, dropdown: false, active: HomeBg,
      dropdownItems: [],
      func: funcHomeBg,
    },
    {
      name: "My Files", link: "/", icon: BsFiles, dropdown: true, active: FilesSubMenu,
      dropdownItems: [
        {
          name: "Add Publications", link: "/", func: selectAddPublications, icon: "", active: addPublications,
        },
        {
          name: "View Publications", link: "/", func: selectViewPublications, icon: "", active: viewPublications,
        },
        {
          name: "Modify Publications", link: "/", func: selectModifyPublications, icon: "", active: modifyPublications,
        }
      ],
      func: funcFilesBg,
    },
  ];


  // Opens the Files Page Consisting of Publications + Other Options


  // -----------------------------------------------------------------------------

  /* SINGLE TYPE SELECTION
    Status : ON or OFF
    for Publications Component:
        SubComponents:
            - Journal 
            - Conference
  */
  const funcPublication = () => {
    setPublicationType(true);
    setViewPublications(false);
  };

  const funcViewConferences = () => {
    // console.log("Function called")
    setViewPublications(true);
    setPublicationType(false);
  }


  // MAIN -------------------------------------------------------------------
  return (
    // Main Container --> Consists of [Header, SideMenu, Content]
    // bg-[var(--bg)]
    <div className="container bg-[#e6ccb2] min-h-screen min-w-full object-cover">
      {/* HEADER */}
      <div className="h-15 flex">
        <img
          className="w-10 h-10 display-block mx-auto mr-7 mt-2 mb-2 cursor-pointer" src={image1} alt="">
        </img>
      </div>
      {/* END of Header -------------------------------------------------------------- */}

      <hr className="w-100% h-1 bg-[#000]" />

      {/* SIDEBAR + CONTENT -----------------------------------------------------------*/}
      <section className="flex gap-4">
        {/* SIDENAV ----------------------------------------------------------- */}
        <div className="">
          <SideMenu
            // Complete menu info
            menu_items={menu_items}
            // Handles menu open/close
            open={open} setOpen={setOpen}
            FilesSubMenu={FilesSubMenu} setFilesSubMenu={setFilesSubMenu}
            // Handles features in Submenu - addPublications & viewPublications
            addPublications={addPublications} setAddPublications={setAddPublications}
            viewPublications={viewPublications} setViewPublications={setViewPublications}
            modifyPublications={modifyPublications} setModifyPublications={setModifyPublications}
            // Functions to handles the edges and effects
            selectAddPublications={selectAddPublications}
            selectViewPublications={selectViewPublications}
            selectModifyPublications={selectModifyPublications}
            // Variables to access the 
            FilesBg={FilesBg} setFilesBg={setFilesBg}
            HomeBg={HomeBg} setHomeBg={setHomeBg}
            publicationType={publicationType} setPublicationType={setPublicationType}
            HandleError={HandleError}
          />
        </div>

        {/* END OF SIDENAV ---------------------------------------------------- */}

        {/* CONTENT ----------------------------------------------------------- */}
        <div className="m-3 text-xl text-gray font-semibold relative z-0">
          {/* Rendering components w.r.t conditions  */}
          {
            (HomeBg || FilesBg) &&
            <>
              <h3> <HomePage /> </h3>
            </>
          }
          {FilesSubMenu && addPublications &&
            <div className="">
              <h1 className="mt-5 text-4xl"> <i> Add Publications </i> </h1>
              {/* Selection of Components */}
              <div className="relative w-full lg:max-w-sm mt-7">
                <select value={value}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  className=" bg-[#f4eee5]
                  w-[15rem] h-[2.1rem] p-0.5 text-center text-lg  
                  border rounded-md shadow-sm outline-none"
                >
                  <option value="select" disabled> Select Publication Type </option>
                  <option value="journal" > Journal </option>
                  <option value="conference"> Conference </option>
                </select>
              </div>
              {/* End of Selection ---------------------------------------------------------------------- */}

              {/* Display of Components */}

              {/* JOURNAL COMPONENT ------------------------------------------------------ */}
              {value === "journal" && (
                <AddJournal />
              )}
              {/* End of Journal ---------------------------------------------------------- */}

              {/* CONFERENCE COMPONENT ---------------------------------------------------- */}
              {value === "conference" && (
                <AddConference />
              )}
              {/* End of Conference -------------------------------------------------------- */}
            </div>
          }
          {FilesSubMenu && viewPublications &&
            <>
              <h1 className="mt-5 text-4xl"> <i> View Publications </i> </h1>
              <div className="relative w-full lg:max-w-sm mt-7">
                <select value={value}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  className=" bg-[#f4eee5]
                  w-[15rem] h-[2.1rem] p-0.5 text-center text-lg   
                  border rounded-md shadow-sm outline-none"
                >
                  <option value="select" disabled> Select Publication Type </option>
                  <option value="journal" > Journals </option>
                  <option value="conference"> Conferences </option>
                  <option value="allPublications"> All Publications </option>
                </select>
              </div>

              {/* Display of Components */}

              {/* JOURNAL COMPONENT ------------------------------------------------------ */}
              {value === "journal" && (
                <>
                  {/* Journal Table */}
                  {/* <h1 className="text-center text-4xl pt-5"> JOURNALS </h1> */}
                  <ViewJournals />
                </>
              )}
              {/* End of Journal ---------------------------------------------------------- */}

              {/* CONFERENCE COMPONENT ---------------------------------------------------- */}
              {value === "conference" && (
                <>
                  {/* <h1 className="text-center text-4xl pt-5"> CONFERENCES </h1> */}
                  <ViewConferences />
                </>
              )}
              {/* End of Conference -------------------------------------------------------- */}

              {/* ALL Publications COMPONENT ---------------------------------------------------- */}
              {value === "allPublications" && (
                <>
                  {/* <h1 className="text-center text-4xl pt-5"> ALL PUBLICATIONS </h1> */}
                  <ViewAllPublications />
                </>
              )}
              {/* End of Conference -------------------------------------------------------- */}

              {/* <Publications /> */}
            </>
          }
          {FilesSubMenu && modifyPublications &&
            <>
              <h1 className="mt-5 text-4xl"> <i> Modify Publications </i> </h1>
              <div className="relative w-full lg:max-w-sm mt-7">
                <select value={value}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  className=" bg-[#f4eee5]
                  w-[15rem] h-[2.1rem] p-0.5 text-center text-lg   
                  border rounded-md shadow-sm outline-none"
                >
                  <option value="select" disabled> Select Publication Type </option>
                  <option value="journal" > Journal </option>
                  <option value="conference"> Conference </option>
                </select>
              </div>
              {/* Display of Components */}
              {/* JOURNAL COMPONENT ------------------------------------------------------ */}
              {value === "journal" && (
                <>
                  {/* Journal List */}
                  <h5 className="text-center pt-5"> -- JOURNALS LIST CREATED BY USER --  </h5>
                  <ModifyJournal />
                </>
              )}
              {/* End of Journal ---------------------------------------------------------- */}

              {/* CONFERENCE COMPONENT ---------------------------------------------------- */}
              {value === "conference" && (
                <>
                  <h3 className="text-center pt-5"> -- CONFERENCES LIST CREATED BY USER -- </h3>
                  <ModifyConference />
                </>
              )}
              {/* End of Conference -------------------------------------------------------- */}
            </>
          }

          {/* Edge Cases + Conditions */}
          {/* After Integration */}
        </div>
        {/* END OF CONTENT ---------------------------------------------------- */}
      </section>
      {/* END OF SIDEBAR + CONTENT (BODY) ------------------------------------------------------ */}

    </div>
  );
}

export default Main;
