import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridDeleteIcon } from "@mui/x-data-grid";
import { Box, Modal } from "@mui/material";
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
import { pink } from "@mui/material/colors";

type Props = {};

const AllBlogs = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [ebookId, setEbookId] = useState("");
  const { isLoading, data, refetch } = useGetAdminAllBlogQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteBlog, { isSuccess, error }] = useDeleteBlogMutation({});
  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "",
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <div className="flex items-center gap-4">
            <Link href={`/admin/edit-blog/${params.row.rId}`}>
              <FiEdit2
                className="dark:text-white text-black"
                size={20}
                color="#3343a7"
              />
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(!open);
                setEbookId(params.row.rId);
              }}
              aria-label="Delete blog"
            >
              <GridDeleteIcon sx={{ color: pink[500] }} />
            </button>
          </div>
        );
      },
    },
    { field: "displayId", headerName: "ID", width: 90 },
    { field: "title", headerName: "Blog Title", flex: 1, minWidth: 240 },
    { field: "author", headerName: "Author", flex: 1, minWidth: 160 },
    { field: "created_at", headerName: "Created At", flex: 1, minWidth: 160 },
  ];

  const rows: any = [];

  {
    data &&
      data.blogs.forEach((item: any) => {
        rows.push({
          id: item._id,
          displayId: item.id,
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
            <h2 className="mb-3 text-[20px] font-poppins font-[600]">
              Live Blogs
            </h2>
            <DataGrid
              autoHeight
              columns={columns}
              rows={rows}
              pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "red",
                  color: "#fff",
                  fontSize: "1rem",
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
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
