import { useForm } from "react-hook-form";
import React, { useState } from "react";
import loginimg from "../assets/background.png";
import axios from 'axios';

const Loginform = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }, 
      } = useForm();
    const [token,setToken]=useState('')
    const [currentUser,setCurrentUser]=useState({})
    // function to login 
    const login=async (userObj)=>{
        await axios.post('http://localhost:8080/users/login',userObj)
        .then((res)=>{
            alert(res.data.message)
            if(res.data.payload){
                setToken(res.data.payload);
                setCurrentUser(res.data.userData);
            }
        })
        .catch((err)=>{
            alert(err.message)
        })
        console.log(token);
        console.log(currentUser);
    }  
    return(
    <div className="w-full h-screen">
    <div className="w-full h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage:`url(${loginimg})` }}>
        <div className="w-1/3 h-screen bg-[#d9d9d980]">
            <div className="w-4/5 text-center text-4xl pt-48 px-32 h-1/10 italic inline-block align-baseline font-bold">
                EDUPRIME PUBLICATIONS
            </div>
            <div className="h-2/3 flex flex-col justify-center">
                {/* <pre>{JSON.stringify(userInfo,undefined,2)}</pre> */}
                <form className="max-w-[400px] w-full mx-auto pb-48  px-16" onSubmit={handleSubmit(login)}>
                    <div className="flex flex-col [#F5F5F5] py-4">
                    <input {...register("name", { required: true })} className="bg-[#F5F5F5] mt-2 p-2" type="text" placeholder="USERNAME" />
                    </div>
                    <div className="flex flex-col [#F5F5F5] py-4">
                    <input {...register("password", { required: true })} className="mt-2 p-2 bg-[#F5F5F5]" type="password" placeholder="PASSWORD" />
                    </div>
                    <button type="submit" className="max-w-[400px] w-full mx-auto my-5 py-2 bg-[#354545] ">LOGIN</button>
                </form>
            </div>
        </div>
    </div> 
    </div>   
    )
}
export default Loginform;