import React, {useState, useEffect} from "react";
import { AgGridReact} from'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import Button from'@mui/material/Button';
import Addcar from "./Addcar";
import Editcar from "./Editcar";

export default function Carlist() {
    const [cars, setCars] = useState([]);
  
    useEffect(() => fetchData(), []);
  
    const fetchData = () => {
      fetch('http://carrestapi.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
    }
    
    const deleteCar = (link) => {
        if (window.confirm("Are you sure?")){
            fetch(link, {method: 'DELETE'})
            .then(res => fetchData())
            .catch(err => console.log(err))
        }
    };

    const saveCar = (car) =>{
        fetch('http://carrestapi.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.log(err))
    };

    const updateCar = (car, link) => {
        fetch(link,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.log(err))
    };

    const columns = [
      { field: "brand", filter: true },
      { field: "model", filter: true },
      { field: "color", filter: true },
      { field: "fuel", filter: true },
      { field: "year", filter: true },
      { field: "price", filter: true },
      {
        headerName: "",
        cellRenderer: function(rowData){
            return <Editcar updateCar={updateCar} car={rowData.data} />
        },

    },
       {
            headerName: "",
            field: "_links.self.href",
            cellRenderer: function(field){
                return <Button onClick={() => deleteCar(field.value)} size="small" color="secondary">delete</Button>
            },
            width: 120
        }
    ];
  
    return (
      <div className="ag-theme-material" style={{ height: '900px', width: '100%', margin: 'center' }}>
        <Addcar saveCar={saveCar}/>
        <AgGridReact filterable={true} rowData={cars} columnDefs={columns} />
      </div>
    );
  }