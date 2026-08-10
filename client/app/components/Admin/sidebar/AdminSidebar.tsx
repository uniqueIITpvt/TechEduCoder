"use client";
import { FC, useEffect, useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import {
  HomeOutlinedIcon,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
  PeopleOutlinedIcon,
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupsIcon,
  OndemandVideoIcon,
  VideoCallIcon,
  WebIcon,
  QuizIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
} from "./Icon";
import { CLOUDINARY_ASSETS } from "@/app/utils/cloudinaryAssets";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { FaFileUpload } from "react-icons/fa";
import { SiUploaded } from "react-icons/si";
import { FaBloggerB } from "react-icons/fa6";
import { RiLiveFill } from "react-icons/ri";
import { useLogOutQuery } from "@/redux/features/auth/authApi";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";



interface itemProps {
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: any;
}

const Item: FC<itemProps> = ({ title, to, icon, selected, setSelected }) => {
  const isActive = selected === title;

  return (
    <Link
      href={to}
      onClick={() => setSelected(title)}
      className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-[15px] transition-colors ${
        isActive
          ? "text-[#6870fa]"
          : "text-black hover:text-[#868dfb] dark:text-[#ffffffc1]"
      }`}
    >
      <span className="text-[20px]">{icon}</span>
      <Typography className="!text-[16px] !font-Poppins">{title}</Typography>
    </Link>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setlogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();


  const {} = useLogOutQuery(undefined, {
    skip: !logout ? true : false,
  });

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }


  const logOutHandler = async () => {
    setlogout(true);
    await signOut();
    router.push("/");
  };


  return (
    <Box
      sx={{
        background: theme === "dark" ? "#111C43" : "#fff",
      }}
      className={`fixed left-0 top-0 z-[999999] h-screen overflow-y-auto border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#111C43] ${
        isCollapsed ? "[&_p]:hidden" : ""
      }`}
      style={{ width: isCollapsed ? 64 : "16%" }}
    >
      <nav className="min-h-full px-2 py-3">
          {/* LOGO AND MENU ICON */}
          <div
            className="mb-5 flex w-full items-center justify-between rounded-md px-3 py-2 text-black hover:text-[#868dfb] dark:text-[#ffffffc1]"
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Link href="/" className="block">
                  <h3 className="text-[15px] font-Poppins uppercase dark:text-white text-black">
                    TechEduCoder
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block"
                >
                  <ArrowBackIosIcon className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
            {isCollapsed && (
              <IconButton onClick={() => setIsCollapsed(false)} className="inline-block">
                <ArrowForwardIosIcon className="text-black dark:text-[#ffffffc1]" />
              </IconButton>
            )}
          </div>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Image
                  alt="profile-user"
                  width={100}
                  height={100}
                  src={user.avatar ? user.avatar.url : CLOUDINARY_ASSETS.avatar}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    border: "3px solid #5b6fe6",
                  }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  className="!text-[20px] text-black dark:text-[#ffffffc1]"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.name}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ m: "10px 0 0 0" }}
                  className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize"
                >
                  - {user?.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box className="space-y-1" paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {!isCollapsed && "Data"}
            </Typography>
            <Item
              title="Users"
              to="/admin/users"
              icon={<GroupsIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Invoices"
              to="/admin/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Content"}
            </Typography>
            <Item
              title="Create Course"
              to="/admin/create-course"
              icon={<VideoCallIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Live Courses"
              to="/admin/courses"
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="upload Ebooks"
              to="/admin/ebook"
              icon={<FaFileUpload />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Uploaded Ebooks"
              to="/admin/AllEbooks"
              icon={<SiUploaded />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Create-Blogs"
              to="/admin/blogs"
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Published Blogs"
              to="/admin/AllBlogs"
              icon={<FaBloggerB />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Events"}
            </Typography>
            <Item
              title="course-Create-Events"
              to="/admin/Course-Create-Events"
              icon={<RiLiveFill />}
              selected={selected}
              setSelected={setSelected}
            />
              <Item
              title="course-Live-Events"
              to="/admin/Course-Live-Events"
              icon={<OndemandVideoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
           
            <Typography
              variant="h5"
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Customization"}
            </Typography>
            <Item
              title="FAQ"
              to="/admin/faq"
              icon={<QuizIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to="/admin/categories"
              icon={<WysiwygIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Controllers"}
            </Typography>
            <Item
              title="Manage Team"
              to="/admin/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Analytics"}
            </Typography>
            <Item
              title="Courses Analytics"
              to="/admin/courses-analytics"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Orders Analytics"
              to="/admin/orders-analytics"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Users Analytics"
              to="/admin/users-analytics"
              icon={<ManageHistoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
              sx={{ m: "15px 0 5px 20px" }}
            >
              {!isCollapsed && "Extras"}
            </Typography>
            <div onClick={logOutHandler} className="flex "
            >
               <p>Logout</p>
                <ExitToAppIcon />
                
            
            </div>
          </Box>
      </nav>
    </Box>
  );
};

export default Sidebar;
