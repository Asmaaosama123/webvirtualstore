import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/stylesheet.css';
cpnsole.log(1);
const RegisterOwner=()=>{
    const[owner,setOwner]=useState({
        FName:"",
        LName:"",
        UserName:"",
        Email:"",
        Password:"",
        ConfirmPassword:"",
        Address:"",
        PhoneNumber:"",
        Image:"",
        Shop_Name:"",
        Shop_Description:"",

    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

}