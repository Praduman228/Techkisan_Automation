// src/components/EmployeeDashboard.js
import React,{useEffect, useState} from 'react';
import NavigationBar from './NavigationBar';
import '../styles/EmployeeDashboard.css';
import profileimg from '../assets/img-dashboard.jpg';
import bdayimg from '../assets/P.jpg'
import cakeimg from '../assets/cake-img.png'

function EmployeeDashboard() {
  const [employeedata, setemployeedata]=useState(null)
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
  useEffect(() => {
    const fetchEmployeeData = async () => {
        try {
          const token = getCookie('token');
            if (!token) {
                console.error('Token not found');
                return;
            }

            const response = await fetch('http://localhost:8000/employees/empdata',{
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            console.log(response.ok)
            if (response.ok) {
                const data = await response.json();
                
                setemployeedata(data);
            } else {
                console.error('Failed to fetch employee data');
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    fetchEmployeeData();
}, []);
  
  return (
    <>
      <NavigationBar />
      <div className="dashboard-container">
        <div className="left-side">
          <div className="profile-section">
            <img  src={profileimg} alt="Profile Image" className="profile-image" />
            <h2 className="employee-name">{employeedata ? employeedata.firstName+employeedata.lastName : 'Loading...'}</h2>
            <p className="employee-role">Software Developer</p>
            <div className="work-duration">
              <p>At work for: 1 year 3 months 8 days</p>
            </div>
            <hr />
            <div className="attendance-leaves-awards">
              <div className="attendance-column">
                <p className="number">0/28</p>
                <p className="label">Attendance</p>
              </div>
              <div className="leaves-column">
                <p className="number">0/440</p>
                <p className="label">Leaves</p>
              </div>
              <div className="awards-column">
                <p className="number">0</p>
                <p className="label">Awards</p>
              </div>
            </div>
            <div className="birthdays-section">
              <p><span><img className="cake-img" src={cakeimg} alt="" /></span> &nbsp; Birthdays</p>
              <div className="birthday-person">
                <img src={bdayimg} alt="Birthday Person" className="birthday-image" />
                <p><strong>Zannifer Doe</strong> has a birthday on</p>
              </div>
            </div>
          </div>
        </div>
        <div className="right-side">
          <div className="details-container">
            <div className="personal-company-details">
              <div className="personal-details">
                <div className="details">
                  <h3><i className="fa-solid fa-pen"></i> &nbsp;Personal Details</h3>
                </div>
                <p>Name:{employeedata ? employeedata.firstName+employeedata.lastName : 'Loading...'}</p>
                <hr />
                <p>Father's Name: Robert Doe</p>
                <hr />
                <p>Date of Birth: 01/01/2024</p>
                <hr />
                <p>Gender: Male</p>
                <hr />
                <p>Email:{employeedata ? employeedata.email: 'Loading...'}</p>
                <hr />
                <p>Phone: 1234567890</p>
                <hr />
                <p>Local Address: xyz</p>
                <hr />
                <p>Permanent Address: XYZ</p>
              </div>
              <div className="company-details">
                <div className="details">
                  <h3><i className="fa-solid fa-briefcase"></i>&nbsp; Company Details</h3>
                </div>
                <p>Employee ID: E123456</p>
                <hr ></hr>
                <p>Department: IT</p>
                <hr></hr>
                <p>Designation: Software Developer</p>
              </div>
            </div>
            <div className="notice-board-upcoming-holidays">
              <div className="notice-board">
                <div className="details">
                  <h3><i className="fa-solid fa-bullhorn"></i>&nbsp; Notice Board</h3>
                </div>
                <div className="notice-space">No Notice</div>
              </div>
              <div className="upcoming-holidays">
                <div className="details">
                  <h3><i className="fa-solid fa-paper-plane"></i>&nbsp; Upcoming Holidays</h3>
                </div>
                <div className="holiday">
                  <p>Office Off</p>
                  <p>01/01/2024</p>
                </div>
                <div className="holiday">
                  <p>Office Off</p>
                  <p>15/08/2024</p>
                </div>
                <div className="holiday">
                  <p>Office Off</p>
                  <p>25/12/2024</p>
                </div>
                <div className="holiday">
                  <p>Office Off</p>
                  <p>01/05/2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployeeDashboard;

