import React, { useEffect, useState } from "react";
import axios from "axios";
import LiveSearch from "../components/LiveSearch";

function InputForAuthors(props) {
    const [results, setResults] = useState({ Mid: "", name: "" });
    const [selectedProfile, setSelectedProfile] = useState({
      Mid: "",
      name: "",
    });
  const [profiles,setProfiles]=useState([])
  const initialize=()=>{
    axios.get('http://localhost:8080/users/all-users')
    .then((res)=>{
      setProfiles(res.data.payload)
    })
    .catch((err)=>alert(err.message))
  }

  useEffect(()=>{
    initialize();
  },[])


    const handleChange = (e) => {
        e.preventDefault();
        const { target } = e;
        if (!target.value.trim()) return setResults([]);
        
        const filteredValue = profiles.filter((profile) =>
          profile.name.toLowerCase().startsWith(target.value)
        );
        setResults(filteredValue);
      
      };
  return (
    <div>
         <LiveSearch
                          results={results}
                          value={selectedProfile?.name}
                          renderItem={(item) => <p>{item.name}</p>}
                          onChange={handleChange}
                          onSelect={(item) => {
                            setSelectedProfile(item)
                            props.props.func(item.Mid,props.props.idx)
                            props.props.func2(item.name,props.props.idx)
                            }}
                        />
    </div>
  )
}

export default InputForAuthors