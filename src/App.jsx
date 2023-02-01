import React, { useState, useEffect } from "react"

import { IoMdSunny, IoMdRainy, IoMdCloud, IoMdSnow, IoMdThunderstorm, IoMdSearch } from 'react-icons/io'
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind } from 'react-icons/bs'
import { TbHaze, TbTemperatureCelsius, TbMist } from 'react-icons/tb'
import { ImSpinner8 } from 'react-icons/im'

import axios from 'axios';

const APIkey = 'bc0168858a86053b050a6ecedb857419';


function App() {

  const [data, setData] = useState(null);
  const [location, setLocation] = useState('West Bengal');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  }

  const handleSubmit = (e) => {
    if (inputValue !== '') {
      setLocation(inputValue);
    }

    const input = document.querySelector('input');

    if (input.value === '') {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 500)
    }

    input.value = '';

    e.preventDefault();
  }


  useEffect(() => {
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios.get(url).then((res) => {
      setTimeout(() => {
        setData(res.data);
        setLoading(false);
      }, 1500)
    }).catch(err => {
      setLoading(false);
      setErrorMsg(err)
    })
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('')
    }, 2000)
    return () => clearTimeout(timer);
  }, [errorMsg])



  if (!data) {
    return (
      <div className="w-full h-screen bg-gradient-to-l from-[#090979] to-[#00d4ff] flex flex-col items-center justify-center text-white">
        <div>
          <ImSpinner8 className="text-6xl animate-spin" />
        </div>
      </div>
    )
  }

  let icon;
  console.log(data.weather[0].main);

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloud />;
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />;
      break;
    case 'Rain':
      icon = <IoMdRainy className="text-[#31cafb]" />;
      break;
    case 'Clear':
      icon = <IoMdSunny className="text-[#ffde33]" />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className="text-[#31cafb]" />;
      break;
    case 'Snow':
      icon = <IoMdSnow className="text-[#31cafb]" />;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
    case 'Mist':
      icon = <TbMist />;
      break;
  }

  const date = new Date();



  return (
    <>
      <div className="w-full h-screen bg-gradient-to-l from-[#090979] to-[#00d4ff] flex flex-col items-center justify-center px-4 lg:px-0">
        {errorMsg && (<div className="absolute w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white top-1 p-4 capitalize rounded-md">{`${errorMsg.response.data.message}`}</div>)}
        <form className={`${animate ? 'animate-bounce' : 'animate-none'} h-16 mt-12 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-5`}>
          <div className="h-full relative flex items-center justify-between p-2">
            <input onChange={(e) => handleInput(e)} className="flex-1 bg-transparent outline-none placeholder:text-white text-white font-light pl-6 h-full" type="text" placeholder="Search by city or country" />
            <button onClick={(e) => handleSubmit(e)} className="bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 flex justify-center items-center rounded-full transition"><IoMdSearch className="text-2xl text-white" /></button>
          </div>
        </form>



        <div className="w-full max-w-[450px] bg-black/20 min-h-[548px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
          {loading ? <div className="w-full h-full flex justify-center items-center"><ImSpinner8 className="text-white text-5xl animate-spin" /></div> : <div>
            {/* {card top} */}
            <div className="flex items-center gap-x-5">
              <div className="text-[87px]">{icon}</div>
              <div>
                <div className="text-2xl font-semibold">{data.name}, {data.sys.country}</div>
                <div>{date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}</div>
              </div>
            </div>
            {/* {card body} */}
            <div className="my-20">
              <div className="flex justify-center items-center">
                <div className="text-[144px] leading-none font-light">{parseInt(data.main.temp)}</div>
                <div className="text-4xl"><TbTemperatureCelsius /></div>
              </div>
              <div className="text-center capitalize">{data.weather[0].description}</div>
            </div>

            {/* {card bottom} */}
            <div className="max-w-[378px] m-auto flex flex-col gap-y-6">
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]"><BsEye /></div>
                  <div>Visibility {' '}<span className="ml-2">{data.visibility / 1000} km</span></div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]"><BsThermometer /></div>
                  <div className="flex">Feels like <span className="ml-2">{parseInt(data.main.feels_like)}</span> <TbTemperatureCelsius /></div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]"><BsWater /></div>
                  <div>Humidity<span className="ml-2">{data.main.humidity} %</span></div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]"><BsWind /></div>
                  <div className="">Wind <span className="ml-2">{data.wind.speed}m/s</span></div>
                </div>
              </div>
            </div>
          </div>}

        </div>
      </div>
    </>
  )
}

export default App
