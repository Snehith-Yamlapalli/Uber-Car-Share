import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function RideCard({ item, isBooked, setIsBooked }) {
  const handleBook = () => {
    if (!isBooked) {
      setIsBooked(true);
    }
  };

  return (
    <div className="card m-3 shadow" style={{ width: '18rem', backgroundColor: isBooked ? "chartreuse" : "white" }}>
      <div className="card-body">
        <h5 className="card-title">{item["Driver-Name"]}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{item["Vehicle-Type"]}</h6>
        <p className="card-text">
          <strong>Pick-Up:</strong> {item["Pick-Up"]}<br />
          <strong>Drop:</strong> {item["Drop-Location"]}<br />
          <strong>ETA:</strong> {item["Expected-to-come-by"]}<br />
          <strong>Rating:</strong> ⭐ {item["Rating"]}<br />
          <strong>Cost:</strong> {item["Cost-of-ride"]}
        </p>
        <button className='btn btn-primary ml-2' onClick={handleBook} disabled={isBooked}>Book</button>
        <button className='btn btn-primary ml-2'>Chat</button>
      </div>
    </div>
  );
}

// List of rides
const Rides = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const destination = state?.destination ?? null;
  const pickup = "HYD Railway-station";

  const [bookedRideIndex, setBookedRideIndex] = useState(null);
  const [shareVisible, setShareVisible] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);

  function gotochat()
  {
    navigate('/Chats',{
      state:{destination}
    });
  }
  useEffect(()=>{
    if(destination===null)
    { 
      alert("Select a destination")
       navigate("/Home")
    }
  },[destination])


  const rides = [
    {
      "Pick-Up": "Secunderabad Railway Station",
      "Drop-Location": "Shamshabad Airport",
      "Driver-Name": "Ravi Kumar",
      "Vehicle-Type": "Sedan",
      "Rating": "4.7",
      "Expected-to-come-by": "08:45 PM",
      "Cost-of-ride": "₹750"
    },
    {
      "Pick-Up": "Secunderabad Railway Station",
      "Drop-Location": "Shamshabad Airport",
      "Driver-Name": "Asif Ali",
      "Vehicle-Type": "Hatchback",
      "Rating": "4.5",
      "Expected-to-come-by": "08:52 PM",
      "Cost-of-ride": "₹680"
    },
    {
      "Pick-Up": "Secunderabad Railway Station",
      "Drop-Location": "Shamshabad Airport",
      "Driver-Name": "Sandeep Reddy",
      "Vehicle-Type": "SUV",
      "Rating": "4.9",
      "Expected-to-come-by": "09:00 PM",
      "Cost-of-ride": "₹900"
    },
    {
      "Pick-Up": "Secunderabad Railway Station",
      "Drop-Location": "Shamshabad Airport",
      "Driver-Name": "Deepthi Sharma",
      "Vehicle-Type": "Mini",
      "Rating": "4.3",
      "Expected-to-come-by": "08:40 PM",
      "Cost-of-ride": "₹620"
    },
    {
      "Pick-Up": "Secunderabad Railway Station",
      "Drop-Location": "Shamshabad Airport",
      "Driver-Name": "Mohammed Faizan",
      "Vehicle-Type": "Sedan",
      "Rating": "4.6",
      "Expected-to-come-by": "08:50 PM",
      "Cost-of-ride": "₹720"
    },
    {
      "Pick-Up": "Hyderabad Railway station",
      "Drop-Location": "InOrbit - Madhapur",
      "Driver-Name": "Ravi Kumar",
      "Vehicle-Type": "Sedan",
      "Rating": "4.7",
      "Expected-to-come-by": "08:45 PM",
      "Cost-of-ride": "₹750"
    },
    {
      "Pick-Up": "Hyderabad Railway station",
      "Drop-Location": "InOrbit - Madhapur",
      "Driver-Name": "Asif Ali",
      "Vehicle-Type": "Hatchback",
      "Rating": "4.5",
      "Expected-to-come-by": "08:52 PM",
      "Cost-of-ride": "₹680"
    },
    {
      "Pick-Up": "Hyderabad Railway station",
      "Drop-Location": "InOrbit - Madhapur",
      "Driver-Name": "Sandeep Reddy",
      "Vehicle-Type": "SUV",
      "Rating": "4.9",
      "Expected-to-come-by": "09:00 PM",
      "Cost-of-ride": "₹900"
    },
    {
      "Pick-Up": "Hyderabad Railway station",
      "Drop-Location": "InOrbit - Madhapur",
      "Driver-Name": "Deepthi Sharma",
      "Vehicle-Type": "Mini",
      "Rating": "4.3",
      "Expected-to-come-by": "08:40 PM",
      "Cost-of-ride": "₹620"
    },
    {
      "Pick-Up": "Hyderabad Railway station",
      "Drop-Location": "InOrbit - Madhapur",
      "Driver-Name": "Mohammed Faizan",
      "Vehicle-Type": "Sedan",
      "Rating": "4.6",
      "Expected-to-come-by": "08:50 PM",
      "Cost-of-ride": "₹720"
    }
  ];
  
  return (
    <div className="row p-4">
      <div className='col-md-8 d-flex flex-wrap justify-content-start gap-3'>
        {rides
          .filter((item) => item["Drop-Location"] === destination)
          .map((item, index) => (
            <div
              className="card m-3 shadow"
              key={index}
              style={{
                width: '18rem',
                backgroundColor: bookedRideIndex === index ? "chartreuse" : "white"
              }}
            >
              <div className="card-body">
                <h5 className="card-title">{item["Driver-Name"]}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{item["Vehicle-Type"]}</h6>
                <p className="card-text">
                  <strong>Pick-Up:</strong> {item["Pick-Up"]}<br />
                  <strong>Drop:</strong> {item["Drop-Location"]}<br />
                  <strong>ETA:</strong> {item["Expected-to-come-by"]}<br />
                  <strong>Rating:</strong> ⭐ {item["Rating"]}<br />
                  <strong>Cost:</strong> {item["Cost-of-ride"]}
                </p>
                <button
                  className='btn btn-primary ml-2'
                  onClick={() => setBookedRideIndex(index)}
                  disabled={bookedRideIndex !== null}
                >
                  Book
                </button>
                <button className='btn btn-primary ml-2'>Chat</button>
              </div>
            </div>
          ))}
      </div>

      <div className='col-md-4'>
        <div className='bg-info p-3 rounded'>
          <h3>Ride</h3>
          <p>From</p>
          <input type="text" className='form-control mb-2' value={pickup} readOnly />
          <p>To</p>
          <input type="text" className='form-control mb-2' value={destination} readOnly />
          <button
            className='btn btn-primary w-100 mt-2'
            onClick={() => setShareVisible(prev => !prev)}
          >
            {shareVisible ? "Hide Share Options" : "Share Ride"}
          </button>
        </div>

        {shareVisible && (
          <div className='d-flex flex-wrap mt-3 gap-3'>
           <button className='btn btn-primary' onClick={gotochat}>Chat with near-by users</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Rides;