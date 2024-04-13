// Import necessary libraries
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface CountDownProps {
  item: any;
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const EventsCount: React.FC<CountDownProps> = ({ item }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      typeof timeLeft.days === "undefined" &&
      typeof timeLeft.hours === "undefined" &&
      typeof timeLeft.minutes === "undefined" &&
      typeof timeLeft.seconds === "undefined"
    ) {
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  function calculateTimeLeft(): TimeLeft {
    const difference = +new Date(item.endDate) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  return (
    <div className=" flex items-center justify-center bg-black  mb-10 p-2 ">
      <div className="grid grid-cols-1 lg:grid lg:grid-cols-3  gap-1 w-[70%]  ">
        <div className="flex items-center justify-center">
          <span className=" text-[17px] font-poppins font-[700] text-yellow-400 ">
            {item.eventsName} <br />up to { " "+ item.eventPercentage}% OFF
          </span>
        </div>
        <div className="col-span-1 flex  items-center justify-center w-[80%] ">
          {" "}
          {Object.keys(timeLeft).map((interval) => {
            if (!timeLeft[interval as keyof TimeLeft]) {
              return null;
            }

            return (
              <div
                key={interval}
                className="mx-2  text-white  text-center"
              >
                <div className=" flex  text-black bg-yellow-400  items-center justify-center font-[700] text-[18px] rounded-sm ">
                  {timeLeft[interval as keyof TimeLeft]}
                </div>
                <div className="text-yellow-400 text-xs uppercase mt-1">
                  {interval}
                </div>
              </div>
            );
          })}
          {Object.keys(timeLeft).length === 0 && (
            <div className="bg-red-300 bg-opacity-50 border border-red-500 p-2 rounded-md shadow-md text-center">
              <div className="text-red font-semibold text-2xl">Time &apos;s Up</div>
            </div>
          )}
        </div>
        <div className="flex items-center  lg:justify-start sm:flex sm:items-center sm:justify-center  ">
          {" "}
          <Link href={`/events`} className="text-[20px]  bg-yellow-400 px-2 lg:px-4 py-1 rounded-sm ">
            Purchase Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventsCount;
