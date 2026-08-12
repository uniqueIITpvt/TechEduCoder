import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "./api";

type Props = {
  videoUrl: string;
  title: string;
  courseId?: string;
  isDemo?: boolean;
};

const CoursePlayer: FC<Props> = ({ videoUrl, courseId, isDemo = false }) => {
  const [videoData, setVideoData] = useState({
    otp: "",
    playbackInfo: "",
  });

  useEffect(() => {
    if (!videoUrl) {
      setVideoData({ otp: "", playbackInfo: "" });
      return;
    }

    let isActive = true;

    const loadVideo = async () => {
      try {
        const response = await axios.post(
          apiUrl(isDemo ? "getVdoCipherDemoOTP" : "getVdoCipherOTP"),
          { videoId: videoUrl, courseId },
          { withCredentials: true }
        );

        if (isActive) {
          setVideoData(response.data);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    loadVideo();

    return () => {
      isActive = false;
    };
  }, [courseId, isDemo, videoUrl]);

  return (
    <div style={{position:"relative",paddingTop:"56.25%",overflow:"hidden"}}>
      {videoData.otp && videoData.playbackInfo !== "" && (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${videoData?.otp}&playbackInfo=${videoData.playbackInfo}&player=qsN3nA4clze9pmvH`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0
          }}
          allowFullScreen={true}
          allow="encrypted-media"
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
