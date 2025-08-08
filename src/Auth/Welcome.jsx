import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import car1 from "../assets/images/onboarding1.png"
import img2 from "../assets/images/onboarding2.png"
import img3 from "../assets/images/onboarding3.png"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Onboarding() {
    const navigate = useNavigate();
    const [actidx, setactidx] = useState()

    const GotoSignUp = () => {
        navigate("/Auth/SignUp");
    };

    return (
        <div className="relative h-screen bg-white">
            {/* Skip button at top right */}
            <button
                onClick={GotoSignUp}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    zIndex: 1000,
                }}
            >
                Skip
            </button>
            <Swiper
                modules={[Navigation]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={50}
                slidesPerView={1}
                className="h-full"
                onRealIndexChange={(index) => setactidx(index)}

            >
                <SwiperSlide>
                    <div className="flex flex-col justify-center items-center text-center min-h-screen p-4">
                        <h1 className="mt-20 text-black text-2xl" style={{ fontFamily: 'Recursive' }}>
                            The Perfect Ride is just a tap away
                        </h1>
                        <img src={car1} alt="just a car" className="max-w-xs my-4"  style={{ width: '420px' }} />
                        <h3 className="text-black text-lg">The journey begins with a ride.Find your ride effort lessly</h3>
                    </div>
                </SwiperSlide>


                <SwiperSlide>
                    <div className="flex flex-col justify-center items-center text-center min-h-screen p-4">
                    <h1 className="mt-20 text-black text-2xl" style={{ fontFamily: 'Recursive' }}>
                    The Perfect Ride is just a tap away
                </h1>
                    <img src={img2} alt="just a car" className='max-w-xs' style={{ width: '420px' }} />
                    <h3 className="text-black text-lg">The journey begins with a ride.Find your ride effort lessly</h3>
                     </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="flex flex-col justify-center items-center text-center min-h-screen p-4">
                    <h1 className="mt-20 text-black text-2xl" style={{ fontFamily: 'Recursive' }}>
                    The Perfect Ride is just a tap away
                </h1>
                    <img src={img3} alt="just a car" className='max-w-xs' style={{ width: '400px' }} />
                    <h3 className="text-black text-lg">The journey begins with a ride.Find your ride effort lessly</h3> <br /> <br />
                    <button className='btn btn-primary' onClick={GotoSignUp}>Sign-Up</button>
                </div>
                </SwiperSlide>
            </Swiper>
        </div>
    );
}
