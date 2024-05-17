import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { AiOutlineMail } from "react-icons/ai";
import { pink } from "@mui/material/colors";
import MaterialTable from "@material-table/core";


type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme, setTheme } = useTheme();
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
          price:  "RS " +course?.discountPrice,
        };
      });
      setOrderData(temp);
    }
  }, [data, usersData, coursesData]);

  const columns: any = [
 

    { field: "userName", title: "Name", },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", title: "Email",  },
          { field: "title", title: "Course Title",  },
        ]),
        ...(isDashboard
          ? [{ field: "created_at", title: "Created At",  }]
          : [
           
            ]),
    { field: "price", title: "Price",  },
    
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
    
    const actions = [
     
      // {
      //   icon: () => <GridDeleteIcon sx={{ color: pink[500] }} />,
      //   tooltip: 'Delete users',
      //   onClick: (event:any, rowData:any) => {
      //     // handleDelete(rowData.id);
      //     // setProductDeleteName(rowData.name);
      //   },
      // },
      {
        icon: () => <AiOutlineMail sx={{ color: pink[500] , padding: '10px'  }} />,
        tooltip: 'Mail users',
        cellStyle: {
          backgroundColor: '#039be5',
          color: '#FFF',
          marginTop: '5rem'
        },
        onClick: (event:any, rowData:any) => {
          
         
          window.location.href = `mailto:${rowData.userEmail}`;
        
        },
      },


      // {
      //   field: " ",
      //   title: "Email",
      
      //   render: (params: any) => {
      //     return (
      //       <a href={`mailto:${params.userEmail}`}>
      //         <AiOutlineMail
      //           className="dark:text-white text-black"
      //           size={20}
      //         />
      //       </a>
      //     );
      //   },
      // },

    ];
  

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-[0px]"}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
      <div className='w-full mx-8 pt-1 m-3 bg-white'>
        <MaterialTable
          title=''
          actions={actions}
          // columns={
          //   [
          //   {
          //     render: (rowData) => (
          //       <Button
          //         className='cursor-pointer'
          //         onClick={() => setOpen(rowData.id)}
          //         style={{ color: 'D55B45' }}
          //         title='Quick view'
          //       >
          //         <AiFillEye size={22} color='#D55B45' />
          //       </Button>
          //     ),
          //   },
          //   { title: 'Product Id', field: 'id' },
          //   { title: 'Name', field: 'name' },
          //   { title: 'Price', field: 'price' },
          //   { title: 'Stock', field: 'Stock' },
          //   { title: 'Sold out', field: 'sold' },
          // ]}
          columns={columns}
          data={rows}
          options={{
            sorting: true,
            search: true,
            searchFieldAlignment: 'right',
            searchAutoFocus: true,
            searchFieldVariant: 'standard',
            filtering: true,
            paging: true,
            pageSizeOptions: [2, 5, 10, 20, 25, 50, 100],
            pageSize: 5,
            paginationType: 'stepped',
            showFirstLastPageButtons: false,
            paginationPosition: 'both',
            // exportButton: true,
            exportAllData: true,
            // exportFileName: 'Abo_Halal_AllProducts',
            addRowPosition: 'first',
            grouping: true,
            columnsButton: true,
            rowStyle: (data, index) =>
              index % 2 === 0 ? { background: '#f5f5f5' } : {},
            headerStyle: { background: 'red', color: '#fff' ,
             fontSize:"1rem",
             padding:"0.5rem"

          
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
