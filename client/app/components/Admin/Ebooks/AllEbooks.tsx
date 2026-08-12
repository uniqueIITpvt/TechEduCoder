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
  useDeleteEbookMutation,
  useGetAdminAllEbooksQuery,
} from "@/redux/features/ebook/ebooksApi";
import { CgDanger } from "react-icons/cg";
import { pink } from "@mui/material/colors";

type Props = {};

const AllEbooks = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [ebookId, setEbookId] = useState("");
  const { isLoading, data, refetch } = useGetAdminAllEbooksQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteEbookMutation({});

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
            <Link href={`/admin/edit-eBooks/${params.row.rId}`}>
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
              aria-label="Delete ebook"
            >
              <GridDeleteIcon sx={{ color: pink[500] }} />
            </button>
          </div>
        );
      },
    },
    { field: "displayId", headerName: "ID", width: 90 },
    { field: "title", headerName: "Ebook Title", flex: 1, minWidth: 240 },
    { field: "ratings", headerName: "Ratings", width: 120 },
    { field: "purchased", headerName: "Purchased", width: 130 },
    { field: "created_at", headerName: "Created At", flex: 1, minWidth: 160 },
  ];

  const rows: any = [];

  {
    data &&
      data.ebooks.forEach((item: any) => {
        rows.push({
          id: item._id,
          displayId: item.id,
          title: item.ebookTitle,
          ratings: item.ratings,

          purchased: item.purchased,
          created_at: format(item.createdAt),

          // real Id from mongo db extrected  for delte the ebooks
          rId: item._id,
        });
      });
  }

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Ebooks Deleted Successfully");
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
    await deleteCourse(id);
  };

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <div className="w-full pt-1 mt-1 bg-white">
            <h2 className="mb-3 text-[20px] font-poppins font-[600]">
              Live ebooks
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
                <div className=" flex items-center justify-center">
                  <CgDanger className="text-red-400" size={45} />
                </div>
                <div className="flex items-center justify-center p-8">
                  <h1 className={`${styles.label} !items-center`}>
                    Are you sure you want to delete this Ebook?
                  </h1>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex w-[70%] items-center justify-between mb-6  ">
                    <div
                      className={`${styles.button} !w-auto h-[30px] bg-[#47d097] cursor-pointer`}
                      onClick={() => setOpen(!open)}
                    >
                      Cancel
                    </div>
                    <div
                      className={`  inline-flex items-center  justify-center md:justify-start px-5 py-4 text-sm font-medium text-center text-white rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full md:w-fit hover:text-gradient-to-r from-blue-500 to-[#521088]"!w-[120px] h-[30px] !bg-[#d63f3f] cursor-pointer`}
                      onClick={handleDelete}
                    >
                      Delete
                    </div>
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

export default AllEbooks;
