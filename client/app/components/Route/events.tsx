import React, { useEffect, useState } from "react";
import { useGetUsersAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import Link from "next/link";
import { useUserGetCourseEventQuery } from "@/redux/features/course-Events/courseEventsApi";
import EventsCount from '../events/eventsCount';
import EventsCard from "../events/eventsCard";


type Props = {

};

const Events = (props: Props) => {
  const { data, isLoading } = useGetUsersAllCoursesQuery({});
  const [courses, setCourses] = useState<any[]>([]);
  const [event, setEvent] = useState<any[]>([]);
  const { data: events, refetch } = useUserGetCourseEventQuery({}, { refetchOnMountOrArgChange: true });
  const [matchingCoursesCount, setMatchingCoursesCount] = useState(0); 

  useEffect(() => {
    if (data && events) {
      setCourses(data?.courses);
      setEvent(events.courseEvent);
    }
  }, [data, events]);

  useEffect(() => {
    // Calculate the total count of matching courses across all events
    const totalMatchingCourses = event.reduce((total, currentItem) => {
      const matchingCoursesForCurrentItem = currentItem.filteredCourseId.filter( (i:any)=> courses.some(course => course._id === i.courseId));
      return total + matchingCoursesForCurrentItem.length;
    }, 0);

    setMatchingCoursesCount(totalMatchingCourses);
  }, [courses, event]); // Recalculate whenever courses or event data changes

  
  return (
    <div className="pb-10 ">
      <div className="w-full relative">
        <div>
          {event &&
            event.map((item, index) => (
              <React.Fragment key={index}>
                <div>
                  <EventsCount item={item} />
                </div>
                <div className="grid grid-cols-1 justify-start items-center gap-10 mb-10 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:p-1 md:p-0 md:justify-start md:items-start md:mx-20 md:gap-10 p-10">
                  {item.filteredCourseId.map((i:any,) => {
                    const matchingCourse = courses.find(course => course._id === i.courseId);
                    return (
                      matchingCourse && (
                        <div key={matchingCourse._id}>
                          <EventsCard matchingCourse={matchingCourse} />
                        </div>
                      )
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
        </div>
        {/* Conditionally render the Link based on matchingCoursesCount */}
        {matchingCoursesCount > 4 && (
          <Link href={`/events`} className="absolute bottom-40 z-9999 right-10 hover:translate-x hover:translate-x-1 transition duration-300">
            <IoIosArrowDroprightCircle size={50} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Events;

