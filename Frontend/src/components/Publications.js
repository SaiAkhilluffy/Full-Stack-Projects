import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
function Publications() {
  const names = [
    {
      value: "devil",
      label: "devil",
    },
    {
      value: "alpha",
      label: "alpha",
    },
    {
      value: "gamma",
      label: "gamma",
    },
    {
      value: "delta",
      label: "delta",
    },
    {
      value: "sigma",
      label: "sigma",
    },
  ];


  const { register, handleSubmit, formState: { errors }, control } = useForm();
  const [allPublication, setAllPublication] = useState([])

  let [domains, setDomains] = useState([]);
  let [indexedIn, setIndexedIn] = useState([]);


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
    let res = await axios.post("http://localhost:8080/conference/filters", data);
    setAllPublication(res.data.payload)
  };

  const fetchDomains = async () => {
    let response = await axios.get("http://localhost:8080/conference/domains");
    let temp = response.data.payload;
    let domains = [];
    temp.map((pair) => {
      domains.push(pair.name);
    });
    setDomains(domains);
  };

  const fetchIndexedIn = async () => {
    let response = await axios.get(
      "http://localhost:8080/conference/IndexedIn"
    );
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
      resConferences[i] = { ...resConferences[i], type: "Conference" }
    }
    let resJournals = res2.data.payload
    for (let i = 0; i < resJournals.length; i++) {
      resJournals[i] = { ...resJournals[i], type: "Journal" }
    }
    setAllPublication([...resConferences,...resJournals])
    console.log([...resConferences,...resJournals]);
  }

  useEffect(() => {
    // getJournals()
    // getConferences()
    getAllPublications()
    fetchDomains()
    fetchIndexedIn()
    console.log(allPublication);
  }, [])

  return (
    <div>
      {/* Filters Form */}
      <form className="mt-10 bg-[var(--l5)] bg-glass rounded-[5rem] p-3" onSubmit={handleSubmit(onFormSubmit)} >

        <div className="mt-10">
          <h1 className=" text-3xl text-center text-red-700"> Filters </h1>
          <h3 className=" text-2xl mt-10 flex justify-evenly">
            <button type="submit" className="p-1 bg-emerald-600 rounded-xl text-[15px] hover:bg-emerald-900">Apply</button>
          </h3>

          <div className="flex justify-evenly g-4 mt-4">
            <div>
              <label htmlFor="index" className="text-[15px]">
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
                      className="w-[400px]"
                    />
                  );
                }}
              />
            </div>
            <div>
              <label htmlFor="author" className="text-[15px]">
                Author (Need To Add Faculty Data)
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
                      options={names}
                      onChange={(names) =>
                        field.onChange(names.map((name) => name.value))
                      }
                      className="w-[400px]"
                    />
                  );
                }}
              />
            </div>

            <div>
              <label htmlFor="domain" className="text-[15px]">
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
                      className="w-[400px]"
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className="flex justify-around mt-5">
            <div>
              <label htmlFor="start" className="text-[15px]">
                Start Date
              </label>
              <br />
              <input type="date" id="start" className="border rounded" {...register("startDate")} />
            </div>
            <div>
              <label htmlFor="end" className="text-[15px]">
                End Date
              </label>
              <br />
              <input type="date" id="end" className="border rounded" {...register("endDate")} />
            </div>
          </div>
        </div>
      </form>


      {/* TABLE RENDER CONFERENCES */}
      {allPublication === [] && <p>No Conferences</p>}
      {allPublication !== [] &&
        <table className="w-full pt-10">
          <thead className="bg-grey-50 border-b-2 border-grey-200">
            <tr>
              <th className="p-3 text-xl font-semibold tracking-wide text-left">Type</th>
              <th className="p-3 text-xl font-semibold tracking-wide text-left">Title</th>
              <th className="p-3 text-xl font-semibold tracking-wide text-left">Authors</th>
              <th className="p-3 text-xl font-semibold tracking-wide text-left">Journal / Conference Name</th>
              <th className="p-3 text-xl font-semibold tracking-wide text-left">Publication Date</th>
              <th className="p-3 text-xl font-semibold tracking-wide text-left">Indexed In</th>
              <th className="p-3 text-xl font-semibold tracking-wide text-left">Domains</th>
            </tr>
          </thead>
          <tbody>
            {allPublication.map((publication, key) =>
              <tr key={key}>
                <td className="p-3 text-sm text-grey-700">{publication.type}</td>
                <td className="p-3 text-sm text-grey-700">{publication?.title}</td>
                <td className="p-3 text-sm text-grey-700">{publication.authorsList.map((author) => <span><br />{author}</span>)}</td>
                <td className="p-3 text-sm text-grey-700">{publication?.conferenceName || publication?.journalName}</td>
                <td className="p-3 text-sm text-grey-700">{publication.publicationDate}</td>
                <td className="p-3 text-sm text-grey-700">{publication.indexedIn.map((index) => <span><br />{index}</span>)}</td>
                <td className="p-3 text-sm text-grey-700">{publication.domain.map((domain) => <span><br />{domain}</span>)}</td>
              </tr>
            )}
          </tbody>
        </table>
      }
    </div>

  );
}

export default Publications;
