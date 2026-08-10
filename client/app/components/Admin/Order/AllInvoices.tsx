import React, { useEffect, useState } from "react";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";
import { DataGrid, GridColDef } from "@mui/x-data-grid";


type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { isLoading, data } = useGetAllOrdersQuery({});
  const { data: usersData } = useGetAllUsersQuery({});
  const { data: coursesData } = useGetAllCoursesQuery({});

  const [orderData, setOrderData] = useState<any>([]);

  useEffect(() => {
    if (data) {
      const temp = data.orders.map((item: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === item.userId
        );
        const course = coursesData?.courses.find(
          (course: any) => course._id === item.courseId
        );
        return {
          ...item,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price:  "RS " +course?.discountPrice.toFixed(2),
        };
      });
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const columns: GridColDef[] = [
    { field: "userName", headerName: "Name", flex: 1, minWidth: 160 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1, minWidth: 220 },
          { field: "title", headerName: "Course Title", flex: 1, minWidth: 220 },
        ]),
        ...(isDashboard
          ? [{ field: "created_at", headerName: "Created At", flex: 1, minWidth: 160 }]
          : [
           
            ]),
    { field: "price", headerName: "Price", width: 120 },
    ...(isDashboard
      ? []
      : [
          {
            field: "mail",
            headerName: "Mail",
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params: any) => (
              <a href={`mailto:${params.row.userEmail}`} aria-label="Mail user">
                <AiOutlineMail size={20} />
              </a>
            ),
          },
        ]),
    
  ];

  const rows: any = [];

  orderData &&
    orderData.forEach((item: any) => {
      rows.push({
        id: item._id,
        userName: item.userName,
        userEmail: item.userEmail,
        title: item.title,
        price: item.price,
        created_at: format(item.createdAt),
      });
    });

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
      <div className='w-full mx-8 pt-1 m-3 bg-white'>
        <DataGrid
          autoHeight
          columns={columns}
          rows={rows}
          pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
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
 
    </>
      )}
    </div>
  );
};

export default AllInvoices;
