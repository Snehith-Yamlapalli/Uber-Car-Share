
import Map from './Map';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';         // your firebase init
import useLocationStore from '../Store/useLocationStore';

export function RidesPast({ item }) {
  if (!item || !item.driver) return null;

  return (
    <div className="card m-3 shadow" style={{ width: '18rem' }}>
      <img
        src={item.driver.profile_image_url}
        className="card-img-top"
        alt={`${item.driver.first_name} ${item.driver.last_name}`}
        style={{ height: "180px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">
          {item.driver.first_name} {item.driver.last_name}
        </h5>
        <p className="card-text">
          <strong>Pick-Up:</strong> {item.origin_address}<br />
          <strong>Drop:</strong> {item.destination_address}<br />
          <strong>Rating:</strong> ⭐ {item.driver.rating}<br />
          <strong>Fare:</strong> ₹{item.fare_price}<br />
          <strong>Status:</strong> {item.payment_status}
        </p>
      </div>
    </div>
  );
}



export default function Home() {

  const recentrides = [
    {
      "ride_id": "1",
      "origin_address": "Kathmandu, Nepal",
      "destination_address": "Pokhara, Nepal",
      "origin_latitude": "27.717245",
      "origin_longitude": "85.323961",
      "destination_latitude": "28.209583",
      "destination_longitude": "83.985567",
      "ride_time": 391,
      "fare_price": "19500.00",
      "payment_status": "paid",
      "driver_id": 2,
      "user_id": "1",
      "created_at": "2024-08-12 05:19:20.620007",
      "driver": {
        "driver_id": "2",
        "first_name": "David",
        "last_name": "Brown",
        "profile_image_url": "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        "car_image_url": "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
        "car_seats": 5,
        "rating": "4.60"
      }
    },
    {
      "ride_id": "2",
      "origin_address": "Jalkot, MH",
      "destination_address": "Pune, Maharashtra, India",
      "origin_latitude": "18.609116",
      "origin_longitude": "77.165873",
      "destination_latitude": "18.520430",
      "destination_longitude": "73.856744",
      "ride_time": 491,
      "fare_price": "24500.00",
      "payment_status": "paid",
      "driver_id": 1,
      "user_id": "1",
      "created_at": "2024-08-12 06:12:17.683046",
      "driver": {
        "driver_id": "1",
        "first_name": "James",
        "last_name": "Wilson",
        "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
        "car_seats": 4,
        "rating": "4.80"
      }
    },
    {
      "ride_id": "3",
      "origin_address": "Zagreb, Croatia",
      "destination_address": "Rijeka, Croatia",
      "origin_latitude": "45.815011",
      "origin_longitude": "15.981919",
      "destination_latitude": "45.327063",
      "destination_longitude": "14.442176",
      "ride_time": 124,
      "fare_price": "6200.00",
      "payment_status": "paid",
      "driver_id": 1,
      "user_id": "1",
      "created_at": "2024-08-12 08:49:01.809053",
      "driver": {
        "driver_id": "1",
        "first_name": "James",
        "last_name": "Wilson",
        "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
        "car_seats": 4,
        "rating": "4.80"
      }
    },
    {
      "ride_id": "4",
      "origin_address": "Okayama, Japan",
      "destination_address": "Osaka, Japan",
      "origin_latitude": "34.655531",
      "origin_longitude": "133.919795",
      "destination_latitude": "34.693725",
      "destination_longitude": "135.502254",
      "ride_time": 159,
      "fare_price": "7900.00",
      "payment_status": "paid",
      "driver_id": 3,
      "user_id": "1",
      "created_at": "2024-08-12 18:43:54.297838",
      "driver": {
        "driver_id": "3",
        "first_name": "Michael",
        "last_name": "Johnson",
        "profile_image_url": "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
        "car_image_url": "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
        "car_seats": 4,
        "rating": "4.70"
      }
    }
  ]
  const navigate = useNavigate();
  const {
    userLatitude,
    userLongitude,
    userAddress,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();

  const [user, setUser] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [error, setError] = useState('');

  // 👉 Watch Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (!fbUser) {
        navigate('/login');
      } else {
        setUser(fbUser);
      }
    });
    return unsubscribe;
  }, [navigate]);

  // 👉 Get browser geolocation & reverse-geocode
  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      async ({ coords }) => {
        try {
          console.log("getting current postion")
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${coords.latitude
            }&lon=${coords.longitude}&apiKey=${process.env.REACT_APP_GEO_APIFY}`
          );

          const data = await res.json();
          console.log("data is ", data)
          const address = data.features?.[0]?.properties?.address_line2 || 'Unknown';
          console.log(address)
          setUserLocation({
            // latitude: coords.latitude,
            // longitude: coords.longitude,
            latitude: 17.982609738462155,
            longitude: 79.53627788922866,
            address,
          });
        } catch {
          setError('Failed to reverse-geocode');
        } finally {
          setLoadingLoc(false);
        }
      },
      (err) => {
        setError(err.message);
        setLoadingLoc(false);
      }
    );
  }, [setUserLocation]);

  const handleDestinationSelect = (loc) => {
    alert("this is handle destinatino select")
    setDestinationLocation(loc);
    navigate('/find-ride');
  };

  if (!user) return null; // waiting for auth check
  if (loadingLoc) return <div>Loading location…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;



  function handlebutton(destination){
    navigate("/Rides",{
      state:{destination}
    })
  }

  return (

    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 ">
          <h3>Recent Rides</h3>
          <div className="d-flex flex-wrap justify-content-start gap-3">
            {recentrides.map((item, idx) => (
              <RidesPast key={idx} item={item} />
            ))}
          </div>

        </div>
        <div className="col-md-6">
          <section >
            <h2>Your Current Location</h2>
            <p>
              {userAddress} ({userLatitude.toFixed(4)}, {userLongitude.toFixed(4)})
            </p>
          </section>
          <div>
            <section style={{ marginTop: 32 }}>
              <h2>Select Your Destination</h2>
              <button className='btn btn-primary me-2' onClick={() => handlebutton("Shamshabad Airport")}>Shamshabad Airport</button>
              <button className='btn btn-primary' onClick={() => handlebutton("InOrbit - Madhapur")}>InOrbit - Madhapur</button>
            </section>
          </div>
          <Map />
        </div>
      </div>
    </div>
  );
}
