import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { BsTrash3Fill } from "react-icons/bs";
import { AiFillPlusCircle } from "react-icons/ai";

// ALERTS
// import Swal from 'sweetalert2/dist/sweetalert2.js'
import swal from 'sweetalert';

// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

function AddJournal() {
  // States for author field's react-select-creatable
  let [inputArrayLabels, setinputArrayLabels] = useState([""]); // stores label to render in input of react-creatable
  let [inpVal, setInpVal] = useState([""]); // stores value to submit into the form 
  let [currIndex, setCurrIndex] = useState(-1);

  // holds the domain related data which is rendered in the add domain's input field
  let [domains, setDomains] = useState([]);

  // holds the domain related data which is rendered in the add domain's input field
  let [indexedIn, setIndexedIn] = useState([]);

  // functions for author field's react-select-creatable
  let [faculty, setFaculty] = useState([])

  const extendInp = () => {
    // for label
    let temp = [...inputArrayLabels];
    temp.push("");
    setinputArrayLabels([...temp]);
    // for value
    temp = [...inpVal];
    temp.push("");
    setInpVal([...temp]);
  };

  const spliceInpAtIndex = (index) => {
    console.log(index)
    // for label
    let temp = [...inputArrayLabels];
    temp.splice(index, 1);
    setinputArrayLabels([...temp]);
    // for value
    temp = [...inpVal];
    temp.splice(index, 1);
    setInpVal([...temp]);
    console.log(temp)
  };

  const random = (data) => {
    console.log(data, currIndex);
    if (data !== null) {
      // for label
      let temp = [...inputArrayLabels];
      temp[currIndex] = data.label;
      setinputArrayLabels([...temp]);
      // for value
      temp = [...inpVal];
      temp[currIndex] = data.value;
      setInpVal([...temp]);

    }
  };

  // ASSSUMPTION CURRENT LOGGED IN USER
  let currentLoggedInUser = "5K0"

  // FORM -------------------------------------------------------------
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();
  // -----------------------------------------------------------------

  // ALERTS
  const FormSubmitAlert = async () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'success',
      title: 'Journal Added successfully'
    })
  }

  const JournalExists = async (issn) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: 'warning',
      title: `Journal with ISSN <b>${issn}</b> Exists`
    })
  }

  const handleFormErrors = async (err) => {
    const Toast = Swal.fire({
      icon: 'error',
      title: 'Something went wrong!',
      text: err.message,
    })
  }

  //Function after submit ----------------------------------------------
  const addJournal = async (userObj) => {
    userObj = { ...userObj, type: "Journal", createdBy: currentLoggedInUser }
    userObj.authorsList = inpVal;
    await axios
      .post("http://localhost:8080/journal/add-journal", userObj)
      .then((res) => {
        if (res.data.message === 'Journal Already uploaded by other authors please check in your list')
          JournalExists(userObj.issn)
        else if (res.data.message === 'journal uploaded successfully')
          FormSubmitAlert()
        else
          throw res;
      })
      .catch((err) => {
        handleFormErrors(err)
      });
    console.log(userObj);
  };

  // function to fetch domains data using axios from Domains database
  const fetchDomains = async () => {
    let response = await axios.get("http://localhost:8080/journal/domains");
    let temp = response.data.payload;
    let domains = [];
    temp.map((pair) => {
      domains.push(pair.name);
    });
    setDomains(domains);
  };

  // function to fetch IndexedIn data using axios from IndexedIn database
  const fetchIndexedIn = async () => {
    let response = await axios.get(
      "http://localhost:8080/journal/IndexedIn"
    );
    let temp = response.data.payload;
    let IndexedIn = [];
    temp.map((pair) => {
      IndexedIn.push(pair.name);
    });
    setIndexedIn(IndexedIn);
    console.log(IndexedIn);
  };

  // function to fetch faculty data using axios from all users database
  const fetchFaculty = async () => {
    let response = await axios.get("http://localhost:8080/journal/Faculty");
    let temp = response.data.payload;
    console.log(temp)
    let Faculty = [];
    temp.map((pair) => {
      Faculty.push({ value: pair.Mid, label: pair.name })
    });
    setFaculty(Faculty);
    console.log(Faculty);
  }

  // useffect runs once per page reload / load, fetches the domains list at the point of component entry
  useEffect(() => {
    fetchFaculty()
    fetchDomains();
    fetchIndexedIn();
  }, []);

  return (
    <div className="">

      <form className="mt-9" onSubmit={handleSubmit(addJournal)}>
        <div className="grid 
          lg:grid-cols-8 
          md:grid-cols-4
          sm:grid-cols-1
          gap-8 border p-6 rounded-2xl border-black shadow-2xl">
          {/* Title ------------------------------------------------------------------------ */}
          <div className="grid col-span-8
            grid-cols-10">
            <label className="title col-span-2 text-md">Title :</label>
            <input
              id="title"
              className="rounded-md col-span-8 h-9
              w-[95.2%]
              "
              type="text"
              placeholder="    Enter your title"
              {...register("title", { required: true })}
            />
            {errors.title?.type === "required" && (
              <div className="col-span-10 grid grid-cols-10">
                <span className="col-span-2"> </span>
                <span className="col-span-8 text-sm ml-1 mt-2 text-red-500"> *Enter Title </span>
              </div>
            )}
          </div>

          {/* ----------------------------------------------------------------------------- */}

          {/* REACT SELECT AUTHORS -------------------------------------------------------------------- */}
          <div className="grid col-span-8
            grid-cols-10">
            <label className="col-span-2">Authors :</label>
            <div className="col-span-8">
              <div className="grid grid-cols-3 gap-4">
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
                          transition duration-200 ease-in-out delay-100 hover:scale-110"/>
                        </button>
                      </span>
                    </div>

                  </div>
                ))}

              </div>
              <button type="button" className="text-sm flex border border-b-slate-400 hover:shadow-10
              bg-[#ede0d4] p-1
              transition duration-200 ease-in-out delay-100 col-span-2 rounded-2xl hover:scale-105 hover:bg-[#ede0d4]
              " onClick={extendInp}>
                <span className="add author">
                  Add Author
                </span>
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

          {/* Journal Name ------------------------------------------------------------- */}
          <div className="grid col-span-8 mt-1
            grid-cols-10 gap-4">
            <label className="Journal col-span-2 text-md">Journal Name :</label>
            <input
              className="rounded-md col-span-8 h-9
              w-[95.2%]"
              type="text"
              placeholder="   Enter the Journal Name"
              {...register("journalName", { required: true })}
            />
            {errors.journalName?.type === "required" && (
              <div className="col-span-10 grid grid-cols-10">
                <span className="col-span-2"> </span>
                <span className="col-span-8 text-sm ml-2 text-red-500"> *Enter Journal Name </span>
              </div>
            )}
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* ISSN Number + Impact Factor ------------------------------------------------- */}
          <div className="grid col-span-8 mt-2
            grid-cols-2 gap-2">
            {/* ISSN Number */}
            <div className="grid grid-cols-5 gap-1 col-span-1 ">
              <label className="justify-self-start col-span-2"> ISSN :</label>
              <span className="flex col-span-3">
                <input
                  className="rounded-md w-[22.2rem] ml-1"
                  type="text"
                  placeholder=" Enter ISSN number"
                  {...register("issn", { required: true })}
                />
              </span>
              {errors.issn?.type === "required" && (
                <div className="col-span-5 grid grid-cols-5 gap-1">
                  <span className="col-span-2"> </span>
                  <span className="col-span-3 ml-2 mt-2 text-sm text-red-500"> *Enter ISSN Number </span>
                </div>
              )}
            </div>
            {/* Impact Factor */}
            <div className="grid grid-cols-5 gap-2 col-span-1">
              <label className="col-span-2
              lg:ml-[3rem]"
              > Impact Factor :</label>
              <span className="col-span-3">
                <input
                  className="w-[18.6rem] h-9
                  rounded-md"
                  type="text"
                  placeholder="  Enter Impact Factor"
                  {...register("impactFactor", { required: true })}
                />
              </span>
              {errors.impactFactor?.type === "required" && (
                <div className="col-span-5 grid grid-cols-5 gap-1">
                  <span className="col-span-2"> </span>
                  <span className="col-span-3 ml-2 mt-1 text-sm text-red-500"> *Enter Impact Factor </span>
                </div>
              )}
            </div>
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* No. of Pages + Published Date ------------------------------------------------- */}
          <div className="grid col-span-8 mt-2
            grid-cols-2 gap-2">
            {/* No.of Pages */}
            <div className="grid grid-cols-5 gap-1 col-span-1 ">
              <label className="justify-self-start col-span-2"> No. of Pages :</label>
              <span className="flex col-span-3">
                <input
                  className="rounded-md w-[22.2rem] ml-1"
                  type="text"
                  placeholder=" Enter No of Pages"
                  {...register("volume", { required: true })}
                />
              </span>
              {errors.volume?.type === "required" && (
                <div className="col-span-5 grid grid-cols-5 gap-1">
                  <span className="col-span-2"> </span>
                  <span className="col-span-3 ml-2 mt-2 text-sm text-red-500"> *Enter Volume/No. of Pages</span>
                </div>
              )}
            </div>
            {/* Publication Date */}
            <div className="grid grid-cols-5 gap-1 col-span-1">
              <label className="col-span-2 ml-[3rem]
                  lg:ml-[3rem]">Publication Date :</label>
              <span>
                <input
                  className="w-[18.6rem] h-9 rounded-md col-span-3 p-1"
                  type="date"
                  placeholder=" Enter the Date"
                  {...register("publicationDate", { required: true })}
                />
              </span>
              {errors.publicationDate?.type === "required" && (
                <div className="col-span-5 grid grid-cols-5 gap-1">
                  <span className="col-span-2"> </span>
                  <span className="col-span-3 ml-2 mt-2 text-sm text-red-500"> *Enter Publication Date </span>
                </div>
              )}
            </div>
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Indexed In ------------------------------------------------------------- */}
          <div className="grid grid-cols-10 col-span-8">
            <label className="col-span-2">Indexed_In :</label>
            <span className="col-span-8 
            lg:w-[95%]
            md:w-[60%]
            sm:w-[50%]
            ml-1">
              <Controller
                name="indexedIn"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      isMulti
                      isClearable
                      options={indexedIn.map((indexed) => {
                        return { label: indexed, value: indexed };
                      })}
                      onChange={(indexedIn) =>
                        field.onChange(indexedIn.map((indexed) => indexed.value))
                      }

                    />

                  );
                }}
                rules={{ required: true }}
              />
              {/* {errors.indexedIn?.type === "required" && (
                <span className="col-span-4 text-md text-red-500"> *Enter Indexed In </span>
              )} */}
            </span>
            {errors.indexedIn?.type === "required" && (
              <div className="col-span-10 grid grid-cols-10">
                <span className="col-span-2"> </span>
                <span className="col-span-8 text-sm ml-2 mt-2 text-red-500"> *Enter Indexed in Values  </span>
              </div>
            )}
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Domains --------------------------------------------------------------------- */}
          <div className="col-span-8 grid grid-cols-10 ">
            <label className="col-span-2">Domains :</label>
            <span className="col-span-8 w-[95.4%]">
              <Controller
                name="domain"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      isMulti
                      isClearable
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
              {/* {errors.domain?.type === "required" && (
                <span className="col-span-4 text-md text-red-500"> *Enter Domains </span>
              )} */}
            </span>
            {errors.domain?.type === "required" && (
              <div className="col-span-10 grid grid-cols-10">
                <span className="col-span-2"> </span>
                <span className="col-span-8 text-sm ml-2 mt-2 text-red-500"> *Enter Domain  </span>
              </div>
            )}
          </div>
          {/* ----------------------------------------------------------------------------- */}

          {/* Add Button ---------------------------------------------------------------- */}
          <div className="text-center col-span-8">
            <button
              type="submit"
              className="bg-[#ede0d4] text-dark shadow-sm h-9 pl-4 pr-4 rounded-3xl mt-3 hover:shadow-lg"
            >
              ADD JOURNAL
            </button>
          </div>
          {/* ----------------------------------------------------------------------------- */}
        </div>
      </form>
      <br />
    </div>
  );
}

export default AddJournal;