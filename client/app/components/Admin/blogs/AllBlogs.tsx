import React, { useEffect, useState } from "react";
import { DataGrid, GridDeleteIcon } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";

import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  useDeleteBlogMutation,
  useGetAdminAllBlogQuery,
} from "@/redux/features/blogs/blogsApi";
import MaterialTable from "@material-table/core";
import { pink } from "@mui/material/colors";

type Props = {};

const AllBlogs = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [ebookId, setEbookId] = useState("");
  const { isLoading, data, refetch } = useGetAdminAllBlogQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteBlog, { isSuccess, error }] = useDeleteBlogMutation({});
  const actions = [
    {
      icon: () => <GridDeleteIcon sx={{ color: pink[500] }} />,
      tooltip: "Delete Blog",
      onClick: (event: any, rowData: any) => {
        setOpen(!open);
        setEbookId(rowData.rId);
      },
      iconProps: {
        style: {
          margin: "0 2rem 0 2rem", // Add margin around the icon
        },
      },
    },
  ];

  const columns = [
    {
      field: "  ",
      title: "",

      render: (params: any) => {
        return (
          <>
            <Link href={`/admin/edit-blog/${params.rId}`}>
              <FiEdit2
                className="dark:text-white text-black"
                size={20}
                color="#3343a7"
              />
            </Link>
          </>
        );
      },
    },
    { field: "id", title: "ID", width: "10%" },

    // {
    //   field: " ",
    //   title: "Delete",

    //   render: (params: any) => {
    //     return (
    //       <>
    //         <Button
    //           onClick={() => {
    //             setOpen(!open);
    //             setEbookId(params.rId);
    //           }}
    //         >
    //           <AiOutlineDelete
    //             className="dark:text-white text-black"
    //             size={20}
    //           />
    //         </Button>
    //       </>
    //     );
    //   },
    // },

    { field: "title", title: "Course Title", width: "50%" },
    { field: "author", title: "Author", width: "10%" },

    { field: "created_at", title: "Created At", width: "15%" },
  ];

  const rows: any = [];

  {
    data &&
      data.blogs.forEach((item: any) => {
        rows.push({
          id: item.id,
          title: item.Title,
          author: item.authorName,
          created_at: format(item.createdAt),
          // real Id from mongo db extrected  for delte the blogs
          rId: item._id,
        });
      });
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Blogs Deleted Successfully");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    const id = ebookId;
    await deleteBlog(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className="w-full pt-1 mt-1 bg-white">
            {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
            <MaterialTable
              actions={actions}
              title="Live Blogs"
              columns={columns}
            
              data={rows}
              options={{
                sorting: true,
                search: true,
                searchFieldAlignment: "right",
                searchAutoFocus: true,
                searchFieldVariant: "standard",
                // filtering: true,
                paging: true,
                pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
                pageSize: 10,
                paginationType: "stepped",
                showFirstLastPageButtons: false,
                paginationPosition: "both",
                // exportButton: true,
                exportAllData: true,
                // exportFileName: 'Abo_Hala_AllCoupons ',
                addRowPosition: "first",
                grouping: true,
                columnsButton: true,
                rowStyle: (data: any, index: any) =>
                  index % 2 === 0 ? { background: "#f5f5f5" } : {},
                headerStyle: {
                  background: "red",
                  color: "#fff",
                  fontSize: "1rem",
                  padding: "1rem",
                },
              }}
              // components={{
              // Toolbar: (props) => (
              //  <MTableToolbar {...props} /> // Add Material Table toolbar
              // ),
              // }}
              // options={{
              //   rowStyle: {
              //     backgroundColor: '#EEE',
              //   }
              // }}
            />
            {/* </ThemeProvider> */}
          </div>
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this course?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#47d097]`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllBlogs;
