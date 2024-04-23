import { useEffect } from "react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { BsTrash3Fill } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";
import { BiExit } from "react-icons/bi";

// ALERTS
// ES6 Modules or TypeScript
import Swal from "sweetalert2";

function ManageConference({
  conferences,
  setConferences,
  targetIndex,
  fetchCreatedPublications,
  switchToEditPublication,
  domains,
  faculty,
  indexedIn,
}) {
  // conference to be modified
  let [currentConference, setCurrentConference] = useState({});

  // States for author field's react-select-creatable
  let [inputArrayLabels, setinputArrayLabels] = useState([]); // stores label to render in input of react-creatable
  let [inputValues, setinputValues] = useState([]); // stores value to submit into the form
  let [currIndex, setCurrIndex] = useState(-1);

  // ASSSUMPTION CURRENT LOGGED IN USER
  // Need to be modified by redux variable
  let currentLoggedInUser = "5K8";

  // useffect runs once per page reload / load, fetches the domains list at the point of component entry
  useEffect(() => {
    console.log(inputArrayLabels);
    // working with the target conference
    setCurrentConference(conferences[targetIndex]);
    // push into inpArrayLabels and inpVal
    let temp = [...inputValues];
    let tempLabel = [...inputArrayLabels];
    let authors = [...conferences[targetIndex].authorsList];
    for (let i = 0; i < authors.length; ++i) {
      temp.push(authors[i]);
      let key = faculty.find((fac) => fac.value == authors[i]);
      key !== undefined
        ? tempLabel.push(key.label)
        : tempLabel.push(authors[i]);
    }

    setinputArrayLabels(tempLabel);
    setinputValues(temp);

    setValue("title", conferences[targetIndex].title);
    setValue("doi", conferences[targetIndex].doi);
    setValue("conferenceType", conferences[targetIndex].conferenceType);
    setValue("impactFactor", conferences[targetIndex].impactFactor);
    setValue("conferenceName", conferences[targetIndex].conferenceName);
    setValue("publicationDate", conferences[targetIndex].publicationDate);
    setValue("volume", conferences[targetIndex].volume);
    setValue("domain", conferences[targetIndex].domain);
    setValue("indexedIn", conferences[targetIndex].indexedIn);

    console.log(temp, tempLabel);
    console.log(conferences[targetIndex]);
  }, []);

  const extendInp = () => {
    // for label
    let temp = [...inputArrayLabels];
    temp.push("");
    setinputArrayLabels([...temp]);
    // for value
    temp = [...inputValues];
    temp.push("");
    setinputValues([...temp]);
  };

  const spliceInpAtIndex = (index) => {
    // for label
    let temp = [...inputArrayLabels];
    temp.splice(index, 1);
    setinputArrayLabels([...temp]);
    // for value
    temp = [...inputValues];
    temp.splice(index, 1);
    setinputValues([...temp]);
  };

  const random = (data) => {
    console.log(data, currIndex);
    if (data !== null) {
      // for label
      let temp = [...inputArrayLabels];
      temp[currIndex] = data.label;
      setinputArrayLabels([...temp]);
      // for value
      temp = [...inputValues];
      temp[currIndex] = data.value;
      setinputValues([...temp]);
    }
  };

  // FORM -------------------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm();
  // -----------------------------------------------------------------

  //Function after submit ----------------------------------------------
  const updateConference = async (userObj) => {
    console.log(userObj);
    userObj = {
      ...userObj,
      type: "Conference",
      createdBy: currentLoggedInUser,
    };
    userObj.authorsList = inputValues;
    userObj.oldDoi = conferences[targetIndex].doi;
    let res = await axios
      .put("http://localhost:8080/conference/update-conference", userObj)
      .then((res) => {
        if (res.data.message === "Update Successful") {
          Alert("success", res.data.message)
          switchToEditPublication(-1);
        }
        else if (res.data.message === "Conference Exists") {
          Alert("warning", res.data.message)
        }
        fetchCreatedPublications();
      })
      .catch((err) => {
        Alert('warning', "Error Occured")
      });
  };

  // ALERTS
  const Alert = async (icon, text) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: icon,
      title: text,
    });
  };

  return (
    <div className="">
      <form className="mt-9" onSubmit={handleSubmit(updateConference)}>
        <div
          className="grid 
          lg:grid-cols-8 
          md:grid-cols-4
          sm:grid-cols-1
          gap-8 border p-6 rounded-2xl border-black shadow-2xl"
        >
          {/* Title ------------------------------------------------------------------------ */}
          <div
            className="grid col-span-8
            grid-cols-10"
          >
            <label className="title col-span-2 text-md">Title:</label>
            <input
              id="title"
              className="rounded-md col-span-8 h-9
              w-[95%]
              "
              type="text"
              placeholder="    Enter your title   "
              {...register("title", { required: true })}
            />
          </div>
          {errors.title?.type === "required" && (
            <p className="text-sm text-red-500"> *Enter Title </p>
          )}

          {/* ----------------------------------------------------------------------------- */}

          {/* REACT SELECT -------------------------------------------------------------------- */}
          <div
            className="grid col-span-8
            grid-cols-10"
          >
            <label className="col-span-2">Authors :</label>
            <div className="col-span-8">
              <div className="grid grid-cols-3 gap-2">
                {inputArrayLabels.map((data, index) => (
                  <div className="grid grid-cols-6" key={index}>
                    <div className="relative col-span-6 flex">
                      <span className="col-span-2 mt-2 mr-2">{index + 1}.</span>
                      <CreatableSelect
                        autoFocus
                        hideSelectedOptions
                        options={faculty}
                        onChange={random}
                        {...(data !== "" && {
                          value: { ...{ label: data, value: data } },
                        })}
                        onMenuOpen={() => setCurrIndex(index)}
                        className="w-[13.5rem] h-[2rem] cols-span-4 m-1"
                        placeholder="Enter name"
                        formatCreateLabel={(data) => `Add author "${data}"`}
                      />
                      <span className="col-span-1 mb-2 mr-2">
                        <button
                          type="button"
                          className="h-[3.2rem]"
                          onClick={() => spliceInpAtIndex(index)}
                        >
                          <BsTrash3Fill
                            className="text-red-400 hover:text-red-600 ml-1
                          transition duration-200 ease-in-out delay-100 hover:scale-110"
                          />
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="text-sm flex border border-b-slate-400 hover:shadow-10
              bg-[#ede0d4] p-1
              transition duration-200 ease-in-out delay-100 col-span-2
                       rounded-2xl
                       hover:scale-105 hover:bg-[#ede0d4]
              "
                onClick={extendInp}
              >
                <span className="add author">add author</span>
                <span className="ml-1">
                  <AiFillPlusCircle
                    className="text-xl transition duration-200 ease-in-out delay-100 col-span-2
                      text-[#34d399] bg-white rounded-2xl
                      hover:text-[#10b981] hover:scale-110 hover:bg-gray-300"
                  />
                </span>
              </button>
            </div>
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Conference Name ------------------------------------------------------------- */}
          <div
            className="grid col-span-8 mt-1
            grid-cols-10 gap-4"
          >
            <label className="Conference col-span-2 text-md">
              Conference Name:
            </label>
            <input
              className="rounded-md col-span-8 h-9
              w-[95.2%]"
              type="text"
              placeholder="   Enter the Conference Name"
              {...register("conferenceName")}
            />
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* DOI Number + Conference Type ------------------------------------------------- */}
          <div
            className="grid col-span-8 mt-2
            grid-cols-2 gap-2"
          >
            {/* DOI Number */}
            <div className="grid grid-cols-5 gap-1 col-span-1 ">
              <label className="justify-self-start col-span-2"> DOI:</label>
              <span className="flex col-span-3">
                <input
                  className="rounded-md bg-slate-200 mr-1 ml-1 text-black h-9
                w-[11rem]"
                  type="text"
                  placeholder=" https://doi.org/10."
                  disabled
                />
                <input
                  className="rounded-md w-[11rem]"
                  type="text"
                  placeholder=" Enter doi number"
                  {...register("doi", { required: true })}
                />
              </span>
            </div>
            {/* Conference Type */}
            <div className="grid grid-cols-5 gap-2 col-span-1">
              <label
                className="col-span-2
              lg:ml-[3rem]"
              >
                {" "}
                ConferenceType :
              </label>
              <span className="col-span-3">
                <select
                  className="lg:w-[18.6rem] 
                  h-9 rounded-md p-1"
                  {...register("conferenceType")}
                >
                  <option value="select" disabled>
                    {" "}
                    Select Type{" "}
                  </option>
                  <option value="National" className="">
                    {" "}
                    National{" "}
                  </option>
                  <option value="International"> International </option>
                </select>
              </span>
            </div>
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Impact Factor + Published Date -------------------------------------------------- */}
          <div className="grid grid-cols-4 col-span-8 mt-2">
            {/* Impact Factor */}
            <div className="grid grid-cols-5 col-span-2">
              <label className="col-span-2"> Impact Factor :</label>
              <span className="col-span-3">
                <input
                  className="w-[22.2rem] ml-1 h-9
                  rounded-md"
                  type="text"
                  placeholder="  Enter Impact Factor"
                  {...register("impactFactor", { required: true })}
                />
              </span>
            </div>
            {/* Date */}
            <div className="grid grid-cols-5 col-span-2">
              <label
                className="col-span-2
            lg:ml-[3.2rem]"
              >
                Publication Date :
              </label>
              <span>
                <input
                  className="w-[18.7rem] ml-1 h-9 rounded-md col-span-3 p-1"
                  type="date"
                  placeholder="  Enter the Date"
                  {...register("publicationDate", { required: true })}
                />
              </span>
            </div>
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Indexed In ------------------------------------------------------------- */}
          <div className="grid grid-cols-10 col-span-8">
            <label className="col-span-2">Indexed_In :</label>
            <span
              className="col-span-8 
            lg:w-[95%]
            md:w-[60%]
            sm:w-[50%]
            ml-1"
            >
              <Controller
                name="indexedIn"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      isMulti
                      isClearable
                      defaultValue={conferences[targetIndex].indexedIn.map(
                        (i) => {
                          return { label: i, value: i };
                        }
                      )}
                      options={indexedIn.map((indexed) => {
                        return { label: indexed, value: indexed };
                      })}
                      onChange={(indexedIn) =>
                        field.onChange(
                          indexedIn.map((indexed) => indexed.value)
                        )
                      }
                    />
                  );
                }}
                rules={{ required: true }}
              />
            </span>
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Volume/No.of Pages ------------------------------------------------------------*/}
          <div className="grid grid-cols-10 col-span-8">
            <label className="col-span-2">No of Pages:</label>
            <span className="col-span-8">
              <input
                className="w-[95%] h-9 ml-1 rounded-md"
                type="text"
                placeholder="  Enter No of Pages"
                {...register("volume", { required: true })}
              />
            </span>
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Domains --------------------------------------------------------------------- */}
          <div className="col-span-8 grid grid-cols-10 ">
            <label className="col-span-2">Domains :</label>
            <span
              className="col-span-8
            lg:w-[95.4%]
            md:w-[60%]
            sm:w-[50%]
            "
            >
              <Controller
                name="domain"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      isMulti
                      isClearable
                      defaultValue={conferences[targetIndex].domain.map((d) => {
                        return { label: d, value: d };
                      })}
                      options={domains.map((domain) => {
                        return { label: domain, value: domain };
                      })}
                      onChange={(domains) =>
                        field.onChange(domains.map((domain) => domain.value))
                      }
                      className="ml-1"
                    />
                  );
                }}
                rules={{ required: true }}
              />
            </span>
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Add Button ---------------------------------------------------------------- */}
          <div className="text-center col-span-8 flex justify-center gap-[30px]">
            <button
              type="button"
              onClick={() => switchToEditPublication(-1)}
              className="bg-[#ede0d4] justify-center flex items-center text-dark shadow-sm h-9 pl-4 pr-4 rounded-3xl mt-3 hover:shadow-lg hover:bg-white"
            >
              Exit <BiExit className="ml-2" />
            </button>
            <button
              type="submit"
              className="bg-[#f4eee5] p-2 text-lg font-Alkatra rounded-xl pl-5 pr-5 shadow-md
                        text-[1.1rem] hover:bg-[#ddb892c4] hover:text-[#f4eee5] hover:shadow-2xl 
                        hover:scale-110 transition delay-150 font-light"
              // className="bg-[#ede0d4] text-dark shadow-sm h-9 pl-4 pr-4 rounded-3xl mt-3 hover:shadow-lg hover:bg-emerald-500 hover:text-white"
            //   onClick={() => FormSubmitAlert()}
            >
              UPDATE CONFERENCE
            </button>
          </div>
          {/* ----------------------------------------------------------------------------- */}
        </div>
      </form>
      <br />
      <br />
    </div>
  );
}

export default ManageConference;
