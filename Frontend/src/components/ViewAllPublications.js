import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'


function ViewAllPublications() {


  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const [allPublications, setAllPublications] = useState([])
  let [domains, setDomains] = useState([]);
  let [indexedIn, setIndexedIn] = useState([]);
  let [authors, setAuthors] = useState([])

  const onFormSubmit = async (data) => {
    console.log("object");
    if (data.indexedIn === undefined) {
      data = { ...data, indexedIn: [] }
    }
    if (data.author === undefined) {
      data = { ...data, author: [] }
    }
    if (data.domain === undefined) {
      data = { ...data, domain: [] }
    }
    console.log(data);
    let res1 = await axios.post("http://localhost:8080/conference/filters", data);
    let res2 = await axios.post("http://localhost:8080/journal/filters", data);
    setAllPublications([...res1.data.payload, ...res2.data.payload])
    if ([...res1.data.payload, ...res2.data.payload].length === 0) {
      Alert("warning", "No Journals")
    }
    else {
      Alert("success", "Filters Applied")
    }
  };

  const fetchDomains = async () => {
    let response = await axios.get("http://localhost:8080/journal/domains");
    let temp = response.data.payload;
    let domains = [];
    temp.map((pair) => {
      domains.push(pair.name);
    });
    setDomains(domains);
  };

  const fetchIndexedIn = async () => {
    let response = await axios.get("http://localhost:8080/journal/IndexedIn");
    let temp = response.data.payload;
    let IndexedIn = [];
    temp.map((pair) => {
      IndexedIn.push(pair.name);
    });
    setIndexedIn(IndexedIn);
    console.log(IndexedIn);
  };


  const getAllPublications = async () => {
    let res1 = await axios.get("http://localhost:8080/conference/all-conferences");
    let res2 = await axios.get("http://localhost:8080/journal/all-journals");
    let resConferences = res1.data.payload
    for (let i = 0; i < resConferences.length; i++) {
      resConferences[i] = { ...resConferences[i] }
    }
    let resJournals = res2.data.payload
    for (let i = 0; i < resJournals.length; i++) {
      resJournals[i] = { ...resJournals[i] }
    }
    setAllPublications([...resConferences, ...resJournals])
    console.log([...resConferences, ...resJournals]);
  }

  const fetchAuthors = async () => {
    let res = await axios.get("http://localhost:8080/journal/Faculty");
    let data = res.data.payload;
    let userArray = []
    let midArray = []
    for (let i = 0; i < data.length; i++) {
      userArray.push({ value: data[i].name, label: data[i].name, Mid: data[i].Mid })
      midArray.push(data[i].Mid)
    }
    console.log(userArray);
    setAuthors(userArray);
    console.log(res.data.payload);
  }

  const Alert = async (icon, text) => {
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
      icon: icon,
      title: text
    })
  }


  useEffect(() => {
    getAllPublications()
    fetchAuthors()
    fetchDomains()
    fetchIndexedIn()
    Alert("info", "All Publications Loaded")
  }, [])



  return (
    <div>
      {/* Filters Form */}
      <form className="mt-6 bg-[#ede0d4] bg-glass rounded-3xl p-1 shadow-2xl" onSubmit={handleSubmit(onFormSubmit)} >
        <div className="grid
                lg:grid-cols-9 
                md:grid-cols-2
                sm:grid-cols-1
                gap-3 p-3">

          <h1 className="text-3xl lg:text-3xl md:text-md 
                    lg:col-span-9 md:col-span-2 sm:col-span-1
                    text-center font-Alkatra"> Filters </h1>

          {/* 3 MAIN FILTERS */}
          <div className="col-span-9 grid 
                    lg:grid-cols-9 
                    md:grid-cols-5
                    sm:grid-cols-1 gap-4
                    text-center">
            <div className="lg:col-span-3 md:col-span-5 sm:cols-span-1 text-left
                                lg:grid-cols-3 
                                md:grid-cols-3
                                sm:grid-cols-1 gap-2">
              {/* IndexedIn */}
              <label htmlFor="index" className="text-[1.1rem] justify-start ml-2 mb-2">
                Indexed In
              </label>
              <br />
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
                      className="lg:w-[100%]
                                                       md:w-[100%]
                                                       sm:w-[100%]"
                    />
                  );
                }}
              />
            </div>

            <div className="lg:col-span-3 md:col-span-5 sm:cols-span-1 text-left
                        lg:grid-cols-3 
                        md:grid-cols-3
                        sm:grid-cols-1 
                        gap-2">
              {/* Authors */}
              <label htmlFor="author" className="text-[1.1rem] ml-2 mb-2">
                Authors
              </label>
              <br />
              <Controller
                name="author"
                control={control}
                render={({ field }) => {
                  return (
                    <Select
                      isMulti
                      isClearable
                      options={authors}
                      onChange={(names) =>
                        field.onChange(names.map((name) => name.Mid))
                      }
                      className="lg:w-[100%] md:w-[100%] sm:w-[100%]"
                    />
                  );
                }}
              />
            </div>

            <div className="lg:col-span-3 md:col-span-5 sm:cols-span-1 text-left
                        lg:grid-cols-3 
                        md:grid-cols-3
                        sm:grid-cols-1 
                        gap-2">
              {/* Domain */}
              <label htmlFor="domain" className="text-[1.1rem] ml-2 mb-2">
                Domain
              </label>
              <br />
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
                      className="lg:w-[100%]
                                                       md:w-[100%]
                                                       sm:w-[100%]"
                    />
                  );
                }}
              />
            </div>
          </div>

          {/* START & END DATES */}
          <div className="col-span-9 grid grid-cols-8 text-center p-2">
            <div className="col-span-4">
              {/* Start Date */}
              <label htmlFor="start" className="text-[1.1rem] ml-auto justify-content-start">
                Start Date
              </label>
              <br />
              <input type="date" id="start" className="border rounded-lg p-1 text-center
                            w-[60%]
                            " {...register("startDate")} />
            </div>
            <div className="col-span-4">
              {/* End Date */}
              <label htmlFor="end" className="text-[1.1rem] ml-auto justify-content-start">
                End Date
              </label>
              <br />
              <input type="date" id="end" className="border rounded-lg p-1 text-center
                            w-[60%]" {...register("endDate")} />
            </div>
          </div>
          {/* FILTER APPLY BUTTON */}
          <div className="col-span-9 text-center">
            {/* bg-[#ddb892c4] */}
            <button type="submit" className=" 
                        bg-[#f4eee5] p-2 text-lg font-Alkatra rounded-xl pl-5 pr-5 shadow-md
                        text-[1.1rem] hover:bg-[#ddb892c4] hover:text-[#f4eee5] hover:shadow-2xl 
                        hover:scale-110 transition delay-150 font-light"

              onClick={() => { }} // Future use of Reset
            > Apply </button>
          </div>
        </div>
      </form>


      {/* TABLE RENDER FOR ALL PUBLICATIONS */}
      <table className="mt-6 bg-[#ede0d4] bg-glass rounded-3xl p-1 w-full shadow-2xl">
        <thead className="bg-[#ede0d4] border-b-2 border-black rounded-3xl">
          <tr>
            <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left" >S.No</th>
            <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left" >Type </th>
            <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left" >Title</th>
            <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left" >Authors</th>
            <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left" >Journal/Conference Name</th>
            <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left" >Publication Date</th>
            <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left" >Indexed In</th>
            <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left" >Domains</th>
          </tr>
          <hr className="bg-black w-4" />
        </thead>
        <tbody>
          {allPublications.length === 0 &&
            <tr className="text-4xl text-center font-bold"><td className="text-red-400" colSpan="10">No Publications</td></tr>}

          {allPublications !== [] &&
            allPublications.map((publication, key) => {
              return key % 2 === 0 ?
                <tr key={key}
                  className={`
                                    bg-[#f4eee5]
                            `}>
                  <td className="p-4 text-sm text-grey-700">{key + 1}.</td>
                  <td className="p-4 text-sm text-grey-700">{publication.type}</td>
                  <td className="p-4 text-sm text-grey-700">{publication.title}</td>
                  <td className="p-4 text-sm text-grey-700">{
                    publication.authorsList.map((author, k) => {
                      return k === 0 ? <span>{author}</span>
                        : <span><br />{author}</span>
                    })
                  }</td>
                  <td className="p-4 text-sm text-grey-700">
                    {publication?.conferenceName || publication?.journalName}
                  </td>
                  <td className="p-4 text-sm text-grey-700">{
                    publication.indexedIn.map((index, k) => {
                      return k === 0 ? <span>{index}</span>
                        : <span><br />{index}</span>
                    })
                  }</td>
                  <td className="p-4 text-sm text-grey-700">{publication.publicationDate}</td>
                  <td className="p-4 text-sm text-grey-700">{
                    publication.domain.map((domain, k) => {
                      return k === 0 ? <span>{domain}</span>
                        : <span><br />{domain}</span>
                    })
                  }</td>
                </tr>
                :
                <tr key={key}
                  className={`
                                 bg-[#ede0d4]
                            `}>
                  <td className="p-4 text-sm text-grey-700">{key + 1}.</td>
                  <td className="p-4 text-sm text-grey-700">{publication.type}</td>
                  <td className="p-4 text-sm text-grey-700">{publication.title}</td>
                  <td className="p-4 text-sm text-grey-700">{
                    publication.authorsList.map((author, k) => {
                      return k === 0 ? <span>{author}</span>
                        : <span><br />{author}</span>
                    })
                  }</td>
                  <td className="p-4 text-sm text-grey-700">
                    {publication?.conferenceName || publication?.journalName}
                  </td>
                  <td className="p-4 text-sm text-grey-700">{
                    publication.indexedIn.map((index, k) => {
                      return k === 0 ? <span>{index}</span>
                        : <span><br />{index}</span>
                    })
                  }</td>
                  <td className="p-4 text-sm text-grey-700">{publication.publicationDate}</td>
                  <td className="p-4 text-sm text-grey-700">{
                    publication.domain.map((domain, k) => {
                      return k === 0 ? <span>{domain}</span>
                        : <span><br />{domain}</span>
                    })
                  }</td>
                </tr>
            })
          }
        </tbody>
      </table>
      <br /> <br />


    </div>

  );
}

export default ViewAllPublications;
