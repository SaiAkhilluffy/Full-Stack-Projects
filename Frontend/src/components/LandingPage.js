import axios from 'axios'
import React, { useEffect, useState } from 'react'

function LandingPage() {
  const [user, setUser] = useState({})
  const [conferences, setConferences] = useState([])
  useEffect(() => {
    const getRequest = async () => {
      let res = await axios.get("http://localhost:8080/conference/all-conferences");
      setUser(res.data.payload)
      console.log(res.data.payload);
    }
    const getConferences = async () => {
      getRequest()
      let res = await axios.get("http://localhost:8080/conference/all-conferences");
      setConferences(res.data.payload)
      console.log(res.data.payload);
    }
    // getJournals() Need to be done
    getConferences()
  }, [])
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      {user === {} &&
        <p>
          Data is empty
        </p>}
      {/* Conferences */}
      <h1 className='text-4xl'>All Conferences</h1>
      <br />
      {user !== {} &&
        <table className='w-full text-sm text-left text-white-500 dark:text-white-400'>
          <thead className='text-xs text-white-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-black-400'>
            <tr>
              <th scope="col" class="px-6 py-3">Title</th>
              <th scope="col" class="px-6 py-3">Publication Date</th>
              <th scope="col" class="px-6 py-3">Impact Factor</th>
              <th scope="col" class="px-6 py-3">DOI</th>
              <th scope="col" class="px-6 py-3">Index In</th>
              <th scope="col" class="px-6 py-3">Pages</th>
              <th scope="col" class="px-6 py-3">Authors</th>
              <th scope="col" class="px-6 py-3">Conference Type</th>
              <th scope="col" class="px-6 py-3">Conference Name</th>
              <th scope="col" class="px-6 py-3">Authors</th>
              <th scope="col" class="px-6 py-3">Domain</th>
            </tr>
          </thead>
          <tbody>
            {
              conferences.map((ele, key) => <tr key={key}>
                <th scope="col" class="px-6 py-3">{ele.title}</th>
                <th scope="col" class="px-6 py-3">{ele.publicationDate}</th>
                <th scope="col" class="px-6 py-3">{ele.impactFactor}</th>
                <th scope="col" class="px-6 py-3">{ele.doi}</th>
                <th scope="col" className="px-6 py-3">{
                  ele.indexedIn.map((index, key) => <span key={key}>{index}<br /></span>)
                }</th>
                <th scope="col" class="px-6 py-3">{ele.volume}</th>
                <th scope="col" class="px-6 py-3">{ele.authors}</th>
                <th scope="col" class="px-6 py-3">{ele.conferenceType}</th>
                <th scope="col" class="px-6 py-3">{ele.conferenceName}</th>
                <th scope="col" class="px-6 py-3">{
                  ele.authorsList.map((user, key) => <span key={key}>{user} </span>)
                }</th>
                <th scope="col" class="px-6 py-3">{ele.domain}</th>
              </tr>)
            }
          </tbody>
        </table>
      }
    </div>
  )
}

export default LandingPage