import React, { FC, useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { IoLockClosedOutline } from "react-icons/io5";
import { MdOutlineOndemandVideo } from "react-icons/md";

type Props = {
  data: any;
  activeVideo?: number;
  setActiveVideo?: any;
  isDemo?: boolean;
};

const CourseContentList: FC<Props> = (props) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(
    new Set<string>(props.data?.length > 0 ? [props.data[0].videoSection] : [])
  );

  // Find unique video sections
  const videoSections: string[] = [
    ...new Set<string>(props.data?.map((item: any) => item.videoSection)),
  ];

  let totalCount: number = 0; // Total count of videos from previous sections

  const toggleSection = (section: string) => {
    const newVisibleSections = new Set(visibleSections);
    if (newVisibleSections.has(section)) {
      newVisibleSections.delete(section);
    } else {
      newVisibleSections.add(section);
    }
    setVisibleSections(newVisibleSections);
  };

  return (
    <div
      className={`mt-[15px] w-full ${
        !props.isDemo && "ml-[-30px] min-h-screen sticky top-24 left-0 z-30"
      } border-[1px]  border-neutral-500`}
    >
      {videoSections.map((section: string, sectionIndex: number) => {
        const isSectionVisible = visibleSections.has(section);

        // Filter videos by section
        const sectionVideos: any[] = props.data.filter(
          (item: any) => item.videoSection === section
        );

        const sectionVideoCount: number = sectionVideos.length; // Number of videos in the current section
        const sectionVideoLength: number = sectionVideos.reduce(
          (totalLength: number, item: any) => totalLength + item.videoLength,
          0
        );
        const sectionStartIndex: number = totalCount; // Start index of videos within the current section
        totalCount += sectionVideoCount; // Update the total count of videos

        const sectionContentHours: number = sectionVideoLength / 60;

        return (
          <div
            className={` ${
              !props.isDemo && "border-b  rounded-lg  dark:border-[#ffffff8e] "
            }  bg-[#f7f9fa]`}
            key={section}
          >
            <div className="w-full flex  p-2 border-[1px] border-b-neutral-500 ">
              {/* Render video section */}
              <div className="w-full flex justify-between items-center  ">
                <div className="flex">
                  <button
                    className="mr-4 cursor-pointer text-black dark:text-white"
                    onClick={() => toggleSection(section)}
                  >
                    {isSectionVisible ? (
                      <BsChevronUp size={20} />
                    ) : (
                      <BsChevronDown size={20} />
                    )}
                  </button>
                  <h2 className="text-[16px] font-[600] text-black dark:text-white  ">
                    {section}
                  </h2>
                </div>

                <h5 className="text-black dark:text-white font-[500] text-[17px] font-poppins">
                  {sectionVideoCount} Lessons ·{" "}
                  {sectionVideoLength < 60
                    ? sectionVideoLength
                    : sectionContentHours.toFixed(2)}{" "}
                  {sectionVideoLength > 60 ? "hours" : "minutes"}
                </h5>
              </div>
            </div>

            {isSectionVisible && (
              <div className="w-full">
                {sectionVideos.map((item: any, index: number) => {
                  const videoIndex: number = sectionStartIndex + index; // Calculate the video index within the overall list
                  const contentLength: number = item.videoLength / 60;
                  return (
                    <div
                      className={`w-full  flex   justify-between  ${
                        videoIndex === props.activeVideo
                          ? "bg-neutral-300"
                          : "bg-white "
                      } cursor-pointer p-2 hover:bg-neutral-300`}
                      key={item._id}
                      onClick={() =>
                        props.isDemo ? null : props?.setActiveVideo(videoIndex)
                      }
                    >
                      <div className="flex items-start ">
                        <div>
                          <MdOutlineOndemandVideo
                            size={20}
                            className="mr-2 mt-1"
                            color="#1cdada"
                          />
                        </div>
                        <h1 className="text-[17px] inline-block break-words text-black dark:text-white  font-poppins font-[500]">
                          {item.title.slice(0, 14)}
                        </h1>
                      </div>
                      <div className={` text-black dark:text-white flex  ${props.isDemo? "flex items-center justify-center":""}`}>
                      <h2>  {item.videoLength > 60
                          ? contentLength.toFixed(2)
                          : item.videoLength.toFixed(2)}{" "}</h2>
                        <p className={`${props.isDemo? "px-5": "px-3"}`}>{props.isDemo
                          ? <IoLockClosedOutline  size={20}/>
                          : item.videoLength > 60
                          ? "hours"
                          : "minutes"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseContentList;
