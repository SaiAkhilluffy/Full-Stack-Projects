
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';

function InfoTable() {
    const [allPublications,setAllPublications]=useState([])
    const getAllPublications=()=>{
        axios.get("http://localhost:8080/combined/get-all")
        .then((response)=>{
            setAllPublications(response.data.payload)
        })
        .catch((err)=>{
            alert(err.message)
        })
    }

  const [domainArray,setDomainAray]=useState([])
  const [indexedInArray,setIndexedInArray]=useState([])
  const [userArray,setUserArray]=useState([])

  const initialize=()=>{
    axios.get('http://localhost:8080/adminOps/all-domains')
    .then((res)=>{
      setDomainAray(res.data.payload)
    })
    .catch((err)=>alert(err.message))

    axios.get('http://localhost:8080/adminOps/all-indices')
    .then((res)=>{
      setIndexedInArray(res.data.payload)
    })
    .catch((err)=>alert(err.message))

    axios.get('http://localhost:8080/users/all-users')
    .then((res)=>{
      setUserArray(res.data.payload)
    })
    .catch((err)=>alert(err.message)) 
  }
   // getAllPublications();
    const authorsToString=(authors)=>{
        return authors.join();
    }

    //functions for filters
    const [domain,setDomain]=useState('')
    const [type,setype]=useState('')
    const [indexedIn,setIndexedIn]=useState('')
    const [startDate,setStartDate]=useState('')
    const [endDate,setEndDate]=useState('')
    const [faculty,setFaculty]=useState('')

    const reset=()=>{
      window.location.reload();
    }

    const applyFilters=async()=>{
      let filterObj={
        'type':type,
        'domain':domain,
        'indexedIn':indexedIn,
        'startDate':startDate,
        'endDate':endDate,
        'faculty':faculty
      }
      console.log(filterObj )
      await axios.post('http://localhost:8080/combined/apply-filters',filterObj)
      .then((res)=>{
        console.log(res.data)
        setAllPublications(res.data.payload)
      })
      .catch((err)=>alert('error occured'))
    }

    useEffect(()=>{
      getAllPublications();
      initialize();
    },[])
  return (
    <div>
   
    {/* <div className='w-60 h-60 '>
    <Pie data={data} /> 
    </div> */}
    <div className="m-5 mb-16">
      <div className='flex w-[1010px] m-5'>
        <div className='flex-1'>
          <label className='mr-2'>Type:</label>
          <select defaultValue="select a type" className="w-[313px] h-[30px] ml-[7px] rounded-md text-slate-400 border"
            onChange={(e)=>{setype(e.target.value)}}
           >
            <option disabled selected>Select a type</option>
            <option key="journals" value="Journals" >Journals</option>
            <option  key="conferences" value="Conferences" >Conferences</option>
          </select>
        </div>

        <div className='flex-1'>
          <label className='mr-2'>Indexed_In:</label>
          <select defaultValue="select" className="w-[313px] h-[30px] ml-[7px] rounded-md text-slate-400" 
          onChange={(e)=>{setIndexedIn(e.target.value)}}
          >
            <option disabled selected>Select an Index</option>
              {indexedInArray && indexedInArray.map((ele,index)=>{
                return (<option key={index} value={ele.name}>{ele.name}</option>)
              })}
          </select>
        </div>
      </div>  
      <div className='flex w-[1010px] m-5'>
        <div className='flex-1'>
          <label className='mr-2'>Start:</label>
          <input type="date" name="startDate" id="startDate"  className='m-2' 
            onChange={(e)=>{setStartDate(e.target.value)}}
          />    
          <label >End:</label>
          <input type="date" name="endDate" id="endDate"  className='m-2'
            onChange={(e)=>{setEndDate(e.target.value)}}
          />
        </div>
        <div className='flex-1'>
          <label className='mr-2'>Domains:</label>
          <select defaultValue="select" className="w-[317px] h-[30px] ml-[7px] rounded-md text-slate-400" 
            onChange={(e)=>{setDomain(e.target.value)}}
          >
            <option disabled selected>Select a domain</option>
              {domainArray && domainArray.map((ele,index)=>{
                return (<option key={index} value={ele.name}>{ele.name}</option>)
              })}
          </select>
        </div>
      </div>    
      <div className="flex w-[1010px]">
      <div className="flex-auto">
        <label className='mr-2'>Faculty</label>
        <select defaultValue="select" className='w-[317px] h-[30px] ml-[7px] rounded-md text-slate-400'
          onChange={(e)=>{setFaculty(e.target.value)}}
        >
        <option disabled selected>Select a Faculty</option>
        {
            userArray && userArray.map((ele,index)=>{
              return (<option key={index} value={ele.Mid}>{ele.name}</option>)
            })
        }

        </select>
      </div>
        <div className="flex-auto">
          <button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full' onClick={reset}>Reset</button>
        </div>
        <div className="flex-auto">
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' onClick={applyFilters} >Apply Filters</button>
        </div>
      </div>
    </div>
    <div className='mt-5'>
        <div className=''>
        <table className="border-collapse border border-slate-500  w-[1010px]">
  <thead>
    <tr className='w-100'>
      <th class="border border-slate-600 m-5">Title</th>
      <th class="border border-slate-600 ">Authors</th>
      <th class="border border-slate-600  ">Name</th>
      <th class="border border-slate-600 ...">ISSN</th>
      <th class="border border-slate-600 ...">Date</th>
      <th class="border border-slate-600 ...">Volume</th>
      <th class="border border-slate-600 ...">Domain</th>
      <th class="border border-slate-600 ...">Indexed_In</th>
    </tr>
  </thead>
  <tbody>
    {allPublications!==undefined && allPublications.map((element)=>{
        return(
        <tr className='w-100'>
      <td class="border border-slate-600 m-5">{element.title}</td>
      <td class="border border-slate-600 ">{authorsToString(element.authors)}</td>
      <td class="border border-slate-600  ">{element.name}</td>
      <td class="border border-slate-600 ...">{element.doi}</td>
      <td class="border border-slate-600 ...">{element.publicationDate}</td>
      <td class="border border-slate-600 ...">{element.volume}</td>
      <td class="border border-slate-600 ...">{element.domain}</td>
      <td class="border border-slate-600 ...">{element.indexedIn}</td>
    </tr>
        )
    })}
  </tbody>
</table>
        </div>
    </div>
    </div>
  )
}

export default InfoTable




















// const data = {
//   labels: ["Red", "Green", "Yellow", "Color 1", "Color 2", "Color 3"],
//   datasets: [
//     {
//       data: [300, 50, 100, 20, 80, 200],
//       backgroundColor: [
//         "#FF6384",
//         "#36A2EB",
//         "#FFCE56",
//         "#db3d44",
//         "#4257b2",
//         "#FFCE56",
//         "#FFCE56",
//         "#FFCE56",
//         "#FFCE56"
//       ],
//       hoverBackgroundColor: [
//         "#FF6384",
//         "#36A2EB",
//         "#FFCE56",
//         "#db3d44",
//         "#4257b2",
//         "#36A2EB"
//       ]
//     }
//   ]
// };