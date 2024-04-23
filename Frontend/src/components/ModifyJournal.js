import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { FiEdit } from "react-icons/fi";
import { BsTrash3Fill } from "react-icons/bs";
import ManageJournal from "./ManageJournal";
import Swal from "sweetalert2";

function ModifyJournal() {
  // ASSSUMPTION CURRENT LOGGED IN USER
  // Need to be modified by redux variable
  let [journals, setJournals] = useState([]);
  let [updateState, setUpdateState] = useState(false);
  let [currIndex, setCurrIndex] = useState(-1);
  let currentLoggedInUser = "5K0";

  // holds the domain related data which is rendered in the add domain's input field
  let [domains, setDomains] = useState([]);

  // holds the domain related data which is rendered in the add domain's input field
  let [indexedIn, setIndexedIn] = useState([]);

  // functions for author field's react-select-creatable
  let [faculty, setFaculty] = useState([]);

  // function to fetch domains data using axios from Domains database
  const fetchDomains = async () => {
    let response = await axios.get("http://localhost:8080/conference/domains");
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

  // function to fetch faculty data using axios from all users database
  const fetchFaculty = async () => {
    let response = await axios.get("http://localhost:8080/conference/Faculty");
    let temp = response.data.payload;
    console.log(temp);
    let Faculty = [];
    temp.map((pair) => {
      Faculty.push({ value: pair.Mid, label: pair.name });
    });
    setFaculty(Faculty);
    console.log(Faculty);
  };

  const fetchCreatedPublications = async () => {
    let response = await axios.get(
      `http://localhost:8080/journal/MyJournals/${currentLoggedInUser}`
    );
    setJournals(response.data.payload);
  };

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

  const deleteJournal = async (index) => {
    let issn = { issn: [...journals][index].issn };
    let response = await axios
      .post("http://localhost:8080/journal/delete-journal", issn)
      .then((response) => {
        if (response.data.message === "journal deleted successfully") {
          Alert("info", response.data.message);
          fetchCreatedPublications();
        }
      })
      .catch((err) => {
        Alert("warning","Deletion unsuccessful");
      });
  };

  const switchToEditPublication = (index) => {
    setUpdateState(updateState ? false : true);
    setCurrIndex(index);
  };

  useEffect(() => {
    fetchDomains();
    fetchFaculty();
    fetchIndexedIn();
    fetchCreatedPublications();
    Alert("info","Journals Loaded")
  }, []);

  return (
    <div>
      {updateState === false ? (
        <table className="mt-6 bg-[#ede0d4] bg-glass rounded-3xl p-1 w-full shadow-2xl">
          <thead className="bg-[#ede0d4] border-b-[1px] border-black rounded-3xl">
            <tr>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Action
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Title Of Journal
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Authors List
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Journal Name
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                ISSN Number
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Impact Factor
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Indexed In
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Publication Date
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Pages of Journal
              </th>
              <th className="p-4 text-[1.1rem] font-Alkatra tracking-wide text-left">
                Domains
              </th>
            </tr>
          </thead>
          <tbody>
            {journals.length === 0 && (
              <tr className="text-4xl text-center font-bold">
                <td className="text-red-400" colSpan="10">
                  No journals
                </td>
              </tr>
            )}

            {journals !== [] &&
              journals.map((journal, key) => {
                return key % 2 === 0 ? (
                  <tr
                    key={key}
                    className={`
                                    bg-[#f4eee5]
                                    transition duration-200 delay-100 ease-in-out hover:bg-white hover:scale-110
                            `}
                  >
                    <td className="p-4 text-xl text-grey-700">
                      <div className="flex justify-evenly">
                        <button
                          type="button"
                          onClick={() => switchToEditPublication(key)}
                        >
                          <FiEdit
                            className="transition duration-200 ease-in-out delay-100
                                      text-yellow-700 scale-100
                                      hover:text-yellow-900 hover:scale-150"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteJournal(key)}
                        >
                          <BsTrash3Fill
                            className="transition duration-200 ease-in-out delay-100
                      text-red-500 scale-100
                      hover:text-red-900 hover:scale-150"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.title}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.authorsList.map((author, k) => {
                        return k === 0 ? (
                          <span key={k}>{author}</span>
                        ) : (
                          <span key={k}>
                            <br />
                            {author}
                          </span>
                        );
                      })}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.journalName}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.issn}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.impactFactor}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.indexedIn.map((index, k) => {
                        return k === 0 ? (
                          <span key={k}>{index}</span>
                        ) : (
                          <span key={k}>
                            <br />
                            {index}
                          </span>
                        );
                      })}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.publicationDate}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.volume}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.domain.map((domain, k) => {
                        return k === 0 ? (
                          <span key={k}>{domain}</span>
                        ) : (
                          <span key={k}>
                            <br />
                            {domain}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={key}
                    className={`
                                 bg-[#ede0d4]
                                 transition duration-200 delay-100 ease-in-out hover:bg-white hover:scale-110
                            `}
                  >
                    <td className="p-4 text-xl text-grey-700">
                      <div className="flex justify-evenly">
                        <button
                          type="button"
                          onClick={() => switchToEditPublication(key)}
                        >
                          <FiEdit
                            className="transition duration-200 ease-in-out delay-100
                                      text-yellow-700 scale-100
                                      hover:text-yellow-900 hover:scale-150"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteJournal(key)}
                        >
                          <BsTrash3Fill
                            className="transition duration-200 ease-in-out delay-100
                      text-red-500 scale-100
                      hover:text-red-900 hover:scale-150"
                          />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.title}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.authorsList.map((author, k) => {
                        return k === 0 ? (
                          <span key={k}>{author}</span>
                        ) : (
                          <span key={k}>
                            <br />
                            {author}
                          </span>
                        );
                      })}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.journalName}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.issn}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.impactFactor}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.indexedIn.map((index, k) => {
                        return k === 0 ? (
                          <span key={k}>{index}</span>
                        ) : (
                          <span key={k}>
                            <br />
                            {index}
                          </span>
                        );
                      })}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.publicationDate}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.volume}
                    </td>
                    <td className="p-4 text-sm text-grey-700">
                      {journal.domain.map((domain, k) => {
                        return k === 0 ? (
                          <span key={k}>{domain}</span>
                        ) : (
                          <span key={k}>
                            <br />
                            {domain}
                          </span>
                        );
                      })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      ) :
        (
          <ManageJournal
            journals={journals}
            setJournals={setJournals}
            targetIndex={currIndex}
            fetchCreatedPublications={fetchCreatedPublications}
            switchToEditPublication={switchToEditPublication}
            domains={domains}
            faculty={faculty}
            indexedIn={indexedIn}
          />
        )}
    </div>
  );
}

export default ModifyJournal;
