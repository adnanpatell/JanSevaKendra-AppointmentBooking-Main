// incomplete for booking with valid details and 


import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertsSlice";
import {  useParams } from "react-router-dom";
import moment from "moment";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
  

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const { user } = useSelector((state) => state.user);
  const [department, setDepartment] = useState(null);
  const params = useParams();
  const dispatch = useDispatch();

  const getDepartmentData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/department/get-department-info-by-id",
        {
          departmentId: params.departmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDepartment(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          departmentId: params.departmentId,
          userId: user._id,
          departmentInfo: department,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        console.log(response.data.error)
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error("error booking appointment");
      dispatch(hideLoading());
    }
  };
  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          departmentId: params.departmentId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      }
      else{
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("error booking appointment");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDepartmentData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      {department && (
        <div>
          <h1 className="page-title">{department.departmentName}</h1>
          <hr />
          <Row gutter={20} className='mt-5' align='middle'>
          <Col span={8} sm={24} xs={24} lg={8}>
             <img src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg" width="100%" height='300' />
              </Col>
            <Col span={8} sm={24} xs={24} lg={8}>
            <p>
            <b>Phone Number :</b> {department.phoneNumber}
            </p>
            <p>
            <b>Address :</b> {department.address}
            </p>
            <p>
            <b>Fess per document : </b>{department.minFee}
            </p> 
             

              <div className="d-flex flex-column pt-2">
                <DatePicker
                  format="DD-MM-YYYY"
                  onChange={(value) =>{
                    setDate(moment(value).format("DD-MM-YYYY"));
                    setIsAvailable(false); 
                  }}
                />
                <TimePicker
                  format="HH:mm"
                  className="mt-3"
                  onChange={(value) => {
                    setIsAvailable(false);
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
                <Button className="primary-button mt-3 full-width-button" onClick={checkAvailability}>
                  Check Availability
                </Button>
               {isAvailable && (
                 <Button
                 className="primary-button mt-3 full-width-button"
                 onClick={bookNow}
               >
                 Book Now
               </Button>
               )}
              </div>
            </Col>
            <Col span={8} sm={24} xs={24} lg={8} >
          
             <p>
            <b>Phone Number :</b> {department.phoneNumber}
            </p>
            <p>
        <b>Address :</b> {department.address}
            </p>
            <p>
        <b>Fees per document : </b>{department.minFee}
      </p>
    

            </Col>
            
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;
