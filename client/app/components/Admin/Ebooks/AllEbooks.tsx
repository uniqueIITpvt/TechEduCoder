

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";

import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {  useDeleteEbookMutation, useGetAllEbooksQuery } from "@/redux/features/ebook/ebooksApi";
import MaterialTable from "@material-table/core";
import { CgDanger } from "react-icons/cg";

type Props = {};

const AllEbooks = (props: Props) => {

  const [open, setOpen] = useState(false);
  const [ebookId, setEbookId] = useState("");
  const { isLoading, data, refetch } = useGetAllEbooksQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteEbookMutation({});

  const columns = [
    { field: "id", title: "ID", },
    {
      field: "  ",
      title: "Edit",
      flex: 0.2,
      render: (params: any) => {
        return (
          <>
            <Link href={`/admin/edit-eBooks/${params.rId}`}>
              <FiEdit2 className="dark:text-white text-black" size={20} />
            </Link>
          </>
        );
      },
    },
    {
      field: " ",
      title: "Delete",
   
      render: (params: any) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
                setEbookId(params.rId);
              }}
            >
              <AiOutlineDelete
                className="dark:text-white text-black"
                size={20}
              />
            </Button>
          </>
        );
      },
    },  
 
    { field: "title", title: "Ebook Title",  },
    { field: "ratings", title: "Ratings", },
    { field: "purchased", title: "Purchased", },
    { field: "created_at", title: "Created At",},
  
   
  ];

  const rows: any = [];

  {
    data &&
      data.ebooks.forEach((item: any) => {
        rows.push({
          id: item.id,
          title: item.ebookTitle,
          ratings: item.ratings,
          
          purchased: item.purchased,
          created_at: format(item.createdAt),

  // real Id from mongo db extrected  for delte the ebooks
          rId : item._id
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
  }, [isSuccess, error,refetch]);

  const handleDelete = async () => {
    const id =  ebookId;
    await deleteCourse(id);
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
              title="Live Blogs"
              columns={columns}
              // [
              //   { title: 'Name', field: 'name' },
              //   { title: 'Surname', field: 'surname' },
              //   { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
              //   {
              //     title: 'Birth Place',
              //     field: 'birthCity',
              //     lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' },
              //   },
              // ]
              data={rows}
              // [
              //   { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
              //   { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 },
              // ]

              options={{
                sorting: true,
                search: true,
                searchFieldAlignment: "right",
                searchAutoFocus: true,
                searchFieldVariant: "standard",
                filtering: true,
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
                // rowStyle: {
                //   backgroundColor: '#EEE',
                // }
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
              <div className=" flex items-center justify-center">< CgDanger className="text-red-400"  size={45} /></div>
              <div className="flex items-center justify-center p-8"><h1 className={`${styles.label} !items-center`}>
                Are you sure you want to delete this Ebook?
              </h1></div>
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