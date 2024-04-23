import { HiMenu } from "react-icons/hi"
import { GrHomeRounded } from "react-icons/gr"
import { RiArrowDropDownLine } from "react-icons/ri"

import React, { useState, useEffect } from "react";

function SideMenu({ menu_items, open, setOpen,
    FilesSubMenu, setFilesSubMenu,
    
    addPublications, setAddPublications,
    viewPublications, setViewPublications,
    modifyPublications, setModifyPublications,

    selectAddPublications, selectViewPublications, selectModifyPublications,

    FilesBg, setFilesBg,
    HomeBg, setHomeBg,
    publicationType, setPublicationType,
    HandleError
}) {

    // -----------------------------------------------------------------------------

    /* SINGLE TYPE SELECTION
      Status : ON or OFF
      for Publications Component:
          SubComponents:
              - Journal 
              - Conference
    */

    // bg-[var(--l)]

    return (
        <>
            <div className={` 
            bg-[#ddb892] 
            h-[96%] 
            ${open ? 'w-[16rem]' : 'w-[3.4rem]'} 
            rounded-3xl 
            border transition-all duration-500 border-solid m-2
            border-black min-h-screen backdrop-blur-sm cursor-pointer
            `}>
                <div className="py-3 px-3 flex justify-end">
                    <HiMenu
                        size={25}
                        className="cursor-pointer"
                        onClick={
                            open ? () => setOpen(!open) : () => setOpen(!open)
                        }
                    />
                </div>

                <div className="mt-4 flex flex-col gap-4 transition-all duration-500 delay-200 relative">
                    {
                        menu_items?.map((menu, i) => (
                            <div key={i} className="duration-600 transition-all delay-250">
                                {menu?.dropdown === true &&
                                    <div className="gap-4 duration-500">
                                        <div
                                            to={"/"}   // for future routing 
                                            key={i}
                                            className={`group flex items-center text-md gap-3 font-medium p-2
                                            ${menu?.active ? 'bg-[#ede0d4]' : ''}    
                                             hover:bg-[#ede0d4] rounded-md duration-500`}
                                            onClick={
                                                open ? menu?.func : HandleError
                                            }
                                        >
                                            {/* Icons of menu elements */}
                                            <span className="ml-2">
                                                {React.createElement(menu?.icon, { size: "20" })}
                                            </span>

                                            {/* Menu Names */}
                                            <span
                                                style={{ transitionDelay: `${i + 3}00ms`, }}
                                                className={`whitespace-pre duration-500
                                                ${!open && 'opacity-0 translate-x-5 overflow-hidden'}`}
                                            >
                                                {menu?.name}
                                            </span>

                                            {/* Dropdown or Submenu Conditions */}
                                            <span
                                                className={`flex cursor-pointer duration-400 ${!open && 'opacity-0 translate-y-10 overflow-hidden'} mx-auto`}
                                                style={{ transitionDelay: `${i + 3}00ms`, }}
                                            >
                                                <RiArrowDropDownLine className={`${FilesSubMenu ? '' : '-rotate-90'} duration-500`}
                                                    size={25}
                                                />
                                            </span>

                                            {/* Hover effect on menus */}
                                            <span className={` ${open && "hidden"} 
                                                absolute left-48

                                                bg-[#ede0d4]
                                                font-semibold whitespace-pre
                                                rounded-md drop-shadow-lg px-0 py-0 w-0 

                                                overflow-hidden  

                                                group-hover:px-2 group-hover:py-1 
                                                group-hover:left-16 group-hover:duration-300
                                                group-hover:w-fit
                                            `}>
                                                {menu?.name}
                                            </span>
                                        </div>

                                        {FilesSubMenu
                                            &&
                                            <div className={`ml-14 mt-4 
                                            ${open && HomeBg === true ? 'mr-3' : 'mr-10'}
                                            flex flex-col gap-3 duration-100
                                            text-sm font-semibold translate-x-25`}
                                                style={{ transitionDelay: `${i + 2}00ms`, }} >
                                                {menu?.dropdownItems.map((item, k) =>
                                                    <span key={k}
                                                        // style={{ transitionDelay: `${i + 2}00ms`, }}
                                                        className={`whitespace-pre text-center p-[.4rem] transition-all duration-200
                                                        ${!open && 'opacity-0 translate-x-5 overflow-hidden'}
                                                        ${(addPublications && item?.name === 'Add Publications') ? 'bg-[#ede3d4] hover:bg-[#ede3d4] rounded-3xl' : ''}
                                                        ${(addPublications && item?.name === 'Add Publications') ? '' : ' hover:bg-[#ede0d4] rounded-xl'}
                                                        
                                                        ${(viewPublications && item?.name === 'View Publications') ? '' : ' hover:bg-[#ede0d4] rounded-xl'}
                                                        ${(viewPublications && item?.name === 'View Publications') ? 'bg-[#ede3d4] hover:bg-[#ede3d4] rounded-3xl' : ''}

                                                        ${(modifyPublications && item?.name === 'Modify Publications') ? '' : ' hover:bg-[#ede0d4] rounded-xl'}
                                                        ${(modifyPublications && item?.name === 'Modify Publications') ? 'bg-[#ede3d4] hover:bg-[#ede3d4] rounded-3xl' : ''}
                                                        `}
                                                        onClick={
                                                            open && FilesSubMenu && item?.func
                                                        }
                                                    >
                                                        {item?.name}
                                                    </span>
                                                )
                                                }
                                            </div>
                                        }
                                    </div>
                                }
                                {menu?.dropdown === false &&
                                    <div className="gap-4 duration-500">
                                        <div
                                            to={"/"}   // for future routing 
                                            key={i}
                                            className={`group flex items-center text-md gap-3 font-medium p-2
                                            ${menu.active ? 'bg-[#ede0d4]' : ''}
                                            hover:bg-[#ede0d4] rounded-md`}
                                            // hover: bg-gray-300
                                            onClick={
                                                open === true ? menu?.func : HandleError
                                            }
                                        >
                                            {/* Icons of menu elements */}
                                            <span className="ml-2">
                                                {React.createElement(menu?.icon, { size: "20" })}
                                            </span>

                                            {/* Menu Names */}
                                            <span
                                                style={{ transitionDelay: `${i + 3}00ms`, }}
                                                className={`whitespace-pre duration-500
                                                ${!open && 'opacity-0 translate-x-5 overflow-hidden'}`}
                                            // onClick={menu?.func}
                                            >
                                                {menu?.name}
                                            </span>

                                            {/* Hover effect on menus */}
                                            <span className={` ${open && "hidden"} 
                                                absolute left-48 
                                                
                                                bg-[#ede0d4]

                                                font-semibold whitespace-pre
                                                rounded-md drop-shadow-lg px-0 py-0 w-0 

                                                overflow-hidden  

                                                group-hover:px-2 group-hover:py-1 
                                                group-hover:left-16 group-hover:duration-300
                                                group-hover:w-fit
                                            `} >
                                                {menu?.name}
                                            </span>
                                        </div>
                                    </div>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>

        </>
    )
}

export default SideMenu