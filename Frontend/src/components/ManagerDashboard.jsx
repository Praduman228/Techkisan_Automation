import React,{useEffect, useState} from 'react';
import ManagerNavigation from './ManagerNavigation';
import '../styles/ManagerDashboard.css';
import axios from 'axios';
import profileimg from '../assets/img-dashboard.jpg';
import bdayimg from '../assets/P.jpg'
import cakeimg from '../assets/cake-img.png'
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ManagerDashboard() {
  const [employeedata, setemployeedata]=useState("")
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate(); 
   const [leaves, setLeaves] = useState([])
  const [activeSection, setActiveSection] = useState('home');
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [activeRequestPage, setActiveRequestPage] = useState('leave');
  const [activeReportPage, setActiveReportPage] = useState('leave-balance');
  const [punchRecord, setPunchRecord] = useState([])
  const handlePunchIn = () => setIsPunchedIn(true);
  const handlePunchOut = () => setIsPunchedIn(false);
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
 
   
const joiningDate = new Date(employeedata.dateOfHire);
const currentDate = new Date();

  const diffInTime = currentDate - joiningDate;

  
  let diffInYears = currentDate.getFullYear() - joiningDate.getFullYear();
  let diffInMonths = currentDate.getMonth() - joiningDate.getMonth();
  let diffInDays = currentDate.getDate() - joiningDate.getDate();

  
  if (diffInDays < 0) {
    diffInMonths--;
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    diffInDays += prevMonth;
  }

  if (diffInMonths < 0) {
    diffInYears--;
    diffInMonths += 12;
  }
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
          navigate("/")
          return;
        }
        const decode =jwtDecode(token)
        if (decode.role!=="manager") {
          navigate("/")
          return;
        }

        const response = await axios.get('http://localhost:8000/manager/managerdata', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true, 
        });
      
        if (response.status === 200) {
          const empdata = response.data;
          setemployeedata(empdata.employee)
          setLeaves(empdata.empleaves)
          setPunchRecord(empdata.employee.punchRecords)
     
          if(empdata.empimg[0]){
            if (empdata.empimg) {
              const binaryString = new Uint8Array(empdata.empimg[0].Image.data).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
              const base64String = btoa(binaryString);
              const imageUrl = `data:${empdata.empimg[0].Imagetype};base64,${base64String}`;
              setAvatarUrl(imageUrl);
            }

             }
               
            } else {
                console.error('Failed to fetch employee data');
            }
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    fetchEmployeeData();
}, []);



  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="manager-dashboard-container">
            <div className="manager-left-side">
            <div className="manager-profile-section">
          {avatarUrl ? (
              <img src={avatarUrl}  alt="Profile" className="manager-profile-image" />
            ) : (
              <p>Loading....</p>
            )}
            <h2 className="manager-name">{employeedata ? employeedata.firstName+employeedata.lastName : 'Loading...'}</h2>
            <p className="manager-role">{employeedata ? employeedata.jobTitle : 'Loading'}</p>
            <div className="manager-work-duration">
              <p> At work for: {diffInYears} year{diffInYears !== 1 && 's'} {diffInMonths} month{diffInMonths !== 1 && 's'} {diffInDays} day{diffInDays !== 1 && 's'}</p>
            </div>
                <div className="manager-button-section">
                  <button
                    className="manager-punch-button"
                    onClick={handlePunchIn}
                    disabled={isPunchedIn}
                  >
                    Punch In
                  </button>
                  <button
                    className="manager-punch-button"
                    onClick={handlePunchOut}
                    disabled={!isPunchedIn}
                  >
                    Punch Out
                  </button>
                </div>
                <hr />
                <div className="attendance-awards">
                  <div className="manager-attendance-column">
                    <p className="num">0/28</p>
                    <p className="labels">Attendance</p>
                  </div>
                  <div className="manager-leaves-column">
                    <p className="num">0/440</p>
                    <p className="labels">Leaves</p>
                  </div>
                  <div className="manager-awards-column">
                    <p className="num">0</p>
                    <p className="labels">Awards</p>
                  </div>
                </div>
                <div className="birthdays-sctn">
              <p><span><img className="cake-img" src={cakeimg} alt="" /></span> &nbsp; Birthdays</p>
              <div className="birthday-prsn">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Birthday Person" className="birthday-img" />
                ) : (
                <p>Loading Image...</p>
              )}
                <p><strong>{employeedata ? employeedata.firstName+" "+employeedata.lastName : 'Loading...'}</strong> has a birthday on {employeedata ? new Date(employeedata.dob).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              }) 
                              : 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>
            <div className="manager-right-side">
              <div className="manager-details-container">
                <div className="manager-personal-details">
                <div className="personal-info">
                <div className="info">
                  <h3><i className="fa-solid fa-pen"></i> &nbsp;Personal Details</h3>
                </div>
                <p>Name:{employeedata ? employeedata.firstName+" "+employeedata.lastName : 'Loading...'}</p>
                <hr />
                <p>Father's Name:{employeedata ? employeedata.fatherName: 'Loading...'}</p>
                <hr />
                <p>
                    Date of Birth: {employeedata ? new Date(employeedata.dob).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit'
                              }) 
                              : 'Loading...'}
                            </p>
                <hr />
                <p>Gender: {employeedata ? employeedata.gender : 'Loading...'}</p>
                <hr />
                <p>Email:{employeedata ? employeedata.email: 'Loading...'}</p>
                <hr />
                <p>Phone:{employeedata ? employeedata.mobile: 'Loading...'} </p>
                <hr />
                <p>Local Address: xyz</p>
                <hr />
                <p>Permanent Address: XYZ</p>
              </div>
              <div className="company-info">
                <div className="info">
                  <h3><i className="fa-solid fa-briefcase"></i>&nbsp; Company Details</h3>
                </div>
                <p>Employee ID: {employeedata ? employeedata.employeeId: 'Loading...'}</p>
                <hr ></hr>
                <p>Department: {employeedata ? employeedata.department: 'Loading...'}</p>
                <hr></hr>
                <p>Designation: {employeedata ? employeedata.jobTitle : 'Loading'}</p>
              </div>
            </div>
                <div className="notice-board-holidays">
                  <div className="notice-brd">
                    <div className="info">
                      <h3><i className="fa-solid fa-bullhorn"></i>&nbsp; Notice Board</h3>
                    </div>
                    <div className="space">No Notice</div>
                  </div>
                  <div className="manager-upcoming-holidays">
                    <div className="info">
                      <h3><i className="fa-solid fa-paper-plane"></i>&nbsp; Upcoming Holidays</h3>
                    </div>
                    <div className="holidy">
                      <p>Office Off</p>
                      <p>01/01/2024</p>
                    </div>
                    <div className="holidy">
                      <p>Office Off</p>
                      <p>15/08/2024</p>
                    </div>
                    <div className="holidy">
                      <p>Office Off</p>
                      <p>25/12/2024</p>
                    </div>
                    <div className="holidy">
                      <p>Office Off</p>
                      <p>01/05/2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'request':
        return (
          <div className="manager-request-section">
            <nav className="manager-request-nav">
              <button onClick={() => setActiveRequestPage('leave')} className={activeRequestPage === 'leave' ? 'active' : ''}>Leave</button>
              <button onClick={() => setActiveRequestPage('attendance-regularization')} className={activeRequestPage === 'attendance-regularization' ? 'active' : ''}>Attendance Regularization</button>
              <button onClick={() => setActiveRequestPage('on-duty')} className={activeRequestPage === 'on-duty' ? 'active' : ''}>On Duty/Work From Home</button>
              <button onClick={() => setActiveRequestPage('permission')} className={activeRequestPage === 'permission' ? 'active' : ''}>Permission</button>
            </nav>

    <div className="manager-request-content">{activeRequestPage === 'leave' && (
             <>
   
    <div className="content-wrap">
      <div className="leave-left-block">
        <div className="leave-date-section">
          <h4>Date:</h4>
          <p>16/08/2024</p>
        </div>
        <div className="leave-contact">
          <h4>1st leave contact:</h4>
          <p>14-Sankalp Dhekwar</p>
        </div>
        <div className="joining-date">
          <h4>Date of Joining:</h4>
          <p>01/06/2020</p>
        </div>
      </div>
      <div className="leave-right-block">
        <form className="manager-leave-form">
          <div className="manager-form-row">
            <div className="manager-form-group">
              <label>Type of leave:</label>
              <select>
                <option>-Select-</option>
                <option>Sick Leave</option>
                <option>Casual Leave</option>
                <option>Earned Leave</option>
              </select>
            </div>
          </div>
          <div className="manager-form-row">
            <div className="manager-form-group">
              <label>From Date:</label>
              <input type="date" />
            </div>
            <div className="manager-form-group">
              <label>To Date:</label>
              <input type="date" />
            </div>
          </div>
          <div className="manager-form-row">
            <div className="manager-form-group">
              <select>
                <option>FULL DAY</option>
                <option>HALF DAY</option>
              </select>
            </div>
            <div className="manager-form-group">
              <select>
                <option>FULL DAY</option>
                <option>HALF DAY</option>
              </select>
            </div>
          </div>
          <div className="manager-form-row">
            <div className="manager-form-group">
              <label>Reason:</label>
              <input type="text" />
            </div>
            <div className="manager-form-group">
              <label>Leave Station:</label>
              <select>
                <option>No</option>
                <option>Out of Town</option>
              </select>
            </div>
          </div>
          <div className="manager-form-row">
            <div className="manager-form-group">
              <label>Vacation Address:</label>
              <input type="text" />
            </div>
            <div className="manager-form-group">
              <label>Contact Number:</label>
              <input type="text" />
            </div>
          </div>
          <div className="manager-form-row">
            <div className="manager-form-group">
              <input className="form-add" type="submit" value="Add" />
            </div>
          </div>
        </form>
      </div>
    </div>
    <div className="previous-leaves">
      <h4>Previous Leaves</h4>
      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>From Date</th>
            <th>Half/Full Day</th>
            <th>To Date</th>
            <th>Half/Full Day</th>
            <th>No. of Days</th>
            <th>Leave Type</th>
            <th>Attachment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><button>Approved</button></td>
            <td>08/01/2024</td>
            <td>First Half</td>
            <td>08/01/2024</td>
            <td>First Half</td>
            <td>0.5</td>
            <td>Sick Leave</td>
            <td></td>
            <td><button className="cancelled">Cancel</button></td>
          </tr>
          <tr>
            <td><button>Approved</button></td>
            <td>15/01/2024</td>
            <td>Full Day</td>
            <td>15/01/2024</td>
            <td>Full Day</td>
            <td>1</td>
            <td>Casual Leave</td>
            <td></td>
            <td><button className="cancelled">Cancel</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
)}
{activeRequestPage === 'attendance-regularization' && (
  <>
    <div className="attendance-regularization-sectn">
      {/* Search Block */}
      <div className="attendance-search">
        <div className="inputsearch">
          <input type="date" placeholder="Start Date" />
          <input type="date" placeholder="End Date" />
          <button className="search-btns">Search</button>
        </div>
        <button className="search-btn-bottom">Search....</button>
      </div>

      {/* Attendance Records Table */}
      <div className="attendance-regularization-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>In Date</th>
              <th>In Time</th>
              <th>Out Date</th>
              <th>Out Time</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>01/04/2024</td>
              <td>01/04/2024</td>
              <td>10:17</td>
              <td>01/04/2024</td>
              <td>21:05</td>
              <td></td>
              <td>-</td>
              <td><button className="update-btn">Update</button></td>
            </tr>
            <tr>
              <td>02/04/2024</td>
              <td>02/04/2024</td>
              <td>09:00</td>
              <td>02/04/2024</td>
              <td>18:00</td>
              <td></td>
              <td>-</td>
              <td><button className="update-btn">Update</button></td>
            </tr>
            
          
          </tbody>
        </table>
        <div className="attendance-regularization-pagination">
          <p>Showing 1 to 10 of 51 entries</p>
          <div className="attendance-regularization-pagination-controls">
            <span>Show</span>
            <input type="number" min="0" defaultValue="0" />
            <span>entries</span>
          </div>
        </div>
      </div>
    </div>
  </>
)}
{activeRequestPage === 'on-duty' && (
  <div className="on-duty-section">
    <div className="form-container">
      <form>
        <div className="row-input">
          <div className="group-input">
            <label htmlFor="start-date">Start Date</label>
            <input type="date" id="start-date" name="start-date" />
          </div>
          <div className="group-input">
            <label htmlFor="end-date">End Date</label>
            <input type="date" id="end-date" name="end-date" />
          </div>
        </div>

        <div className="row-input">
          <div className="group-input day-type-group">
            <label htmlFor="day-type">Day Type</label>
            <select id="day-type" name="day-type">
              <option value="">--Select--</option>
              <option value="working">Working</option>
              <option value="holiday">Holiday</option>
              <option value="sick">Sick Leave</option>
              <option value="half-day">Half Day</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="row-input">
          <div className="group-input">
            <label htmlFor="in-time">In Time</label>
            <input type="time" id="in-time" name="in-time" />
          </div>
          <div className="group-input">
            <label htmlFor="out-time">Out Time</label>
            <input type="time" id="out-time" name="out-time" />
          </div>
        </div>

        <div className="row-input">
          <div className="group-input">
            <label htmlFor="remark">Remark</label>
            <input type="text" id="remark" name="remark" />
          </div>
        </div>

        <div className="row-input">
          <button type="submit" className="save-btn">Save</button>
        </div>
      </form>
    </div>
    <div className="no-record-block">
      No previous record found for current month.
    </div>
  </div>
)}


              {activeRequestPage === 'permission' && <h1>This is the Permission Page</h1>}
            </div>
          </div>
        );
        case 'report':
          return (
            <div className="manager-report-section">
              <nav className="manager-report-nav">
                <button onClick={() => setActiveReportPage('leave-balance')} className={activeReportPage === 'leave-balance' ? 'active' : ''}>Leave Balance</button>
                <button onClick={() => setActiveReportPage('in-out-details')} className={activeReportPage === 'in-out-details' ? 'active' : ''}>In-Out Details</button>
                <button onClick={() => setActiveReportPage('leave-details')} className={activeReportPage === 'leave-details' ? 'active' : ''}>Leave Details</button>
                <button onClick={() => setActiveReportPage('annual-attendance-summary')} className={activeReportPage === 'annual-attendance-summary' ? 'active' : ''}>Annual Attendance Summary</button>
                <button onClick={() => setActiveReportPage('holidays')} className={activeReportPage === 'holidays' ? 'active' : ''}>Holidays</button>
                <button onClick={() => setActiveReportPage('on-duty')} className={activeReportPage === 'on-duty' ? 'active' : ''}>On Duty</button>
              </nav>
        
              <div className="manager-report-content">
                {activeReportPage === 'leave-balance' && (
                  <div class="leave-balance-section">
                 
                  <div class="search-block">
                    <input type="text" placeholder="Search..."></input>
                  
                  </div>
                
              
                  <div class="leave-balance-table-block">
                 <table>
                   <thead>
                     <tr>
                       <th>Leave Type</th>
                       <th>Opening</th>
                       <th>Credit</th>
                       <th>Debit</th>
                       <th>Used</th>
                       <th>Balance</th>
                       <th>Action</th>
                     </tr>
                   </thead>
                   <tbody>
                   <tr>
                       <td>Casual Leave</td>
                       <td>2</td>
                       <td>8</td>
                       <td>0</td>
                       <td>3</td>
                       <td>7</td>
                       <td>
                  <button class="action-btn">View Used</button>
                  <button class="action-btn">View Debited</button>
              </td>
            </tr>
            <tr>
                       <td>Emergency Leave</td>
                       <td>0</td>
                       <td>0</td>
                       <td>0</td>
                       <td>0</td>
                       <td>0</td>
                       <td>
                  <button class="action-btn">View Used</button>
                  <button class="action-btn">View Debited</button>
              </td>
            </tr>
          
            <tr>
                       <td>Sick leave</td>
                       <td>2</td>
                       <td>8</td>
                       <td>0</td>
                       <td>3.5</td>
                       <td>0.5</td>
                       <td>
                  <button class="action-btn">View Used</button>
                  <button class="action-btn">View Debited</button>
              </td>
            </tr>
          </tbody>
       </table>
      </div>
      <div className="leave-blnce-pagination">
          <p>Showing 1 to 5 of 5 entries</p>
          <div className="leave-blnce-pagination-controls">
            <span>Show</span>
            <input type="number" min="0" defaultValue="0" />
            <span>entries</span>
          </div>
        </div>
      </div>
    )}
                {activeReportPage === 'in-out-details' && (
                   <div className="in-out-details-container">

                   
                      
                       <div className="report-type-block">
                       <div className="in-out-block">
                       <label htmlFor="report-type">Report Type</label>
                       <select id="report-type" name="report-type">
                         <option value="">Select Report Type</option>
                         <option value="daily">Daily Report</option>
                         <option value="weekly">Weekly Report</option>
                         <option value="monthly">Monthly Report</option>
                         <option value="yearly">Yearly Report</option>
                        </select>
                     </div>
                         <div className="in-out-block">
                           <label htmlFor="from-date">From Date</label>
                           <input type="date" id="from-date" name="from-date" />
                         </div>
                         <div className="in-out-block">
                           <label htmlFor="to-date">To Date</label>
                           <input type="date" id="to-date" name="to-date" />
                         </div>
                         <div className="btn-block">
                           <button className="btn-search">Search</button>
                           <button className="export-btn">Export to Excel</button>
                         </div>
                       </div>
                       <div class="srch-btn">
                    <input type="text" placeholder="Search..."></input>
                  
                  </div>
                       <div className="in-out-table-block">
                        
                         <div className="in-out-table-container">
                           <table className="in-out-info-table">
                             <thead>
                               <tr>
                                 <th>Code</th>
                                 <th>Name</th>
                                 <th>Entry Date</th>
                                 <th>Location In</th>
                                 <th>Location Out</th>
                                 <th>In Time</th>
                                 <th>Out Time</th>
                                 <th>Total Working Hour</th>
                                 <th>In Geolocation</th>
                                 <th>Out Geolocation</th>
                                 <th>Leave</th>
                                 <th>Morning Late</th>
                                 <th>Early</th>
                               </tr>
                             </thead>
                             <tbody>
                               <tr>
                                 <td>47</td>
                                 <td>xyz</td>
                                 <td>11/08/2024</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>WeekOff</td>
                                 <td>Weekoff</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                               </tr>
                               <tr>
                                 <td>47</td>
                                 <td>xyz</td>
                                 <td>12/08/2024</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>Unswiped</td>
                                 <td>Unswiped</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                               </tr>
                               <tr>
                                 <td>47</td>
                                 <td>xyz</td>
                                 <td>13/08/2024</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>WeekOff</td>
                                 <td>Weekoff</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                               </tr>
                               <tr>
                                 <td>47</td>
                                 <td>xyz</td>
                                 <td>14/08/2024</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>Holiday</td>
                                 <td>Independance Day</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                                 <td>-</td>
                               </tr>
                             </tbody>
                           </table>
                         </div>
                         <div className="in-out-pagination">
                          <p>Showing 1 to 5 of 5 entries</p>
                          <div className="in-out-pagination-controls">
                          <span>Show</span>
                          <input type="number" min="0" defaultValue="0" />
                          <span>entries</span>
                         </div>
                       </div>
                       </div>
                     </div>
                  
             
                )}
                {activeReportPage === 'leave-details' &&(
                        <div className="leave-details-section">
                        <div className="leave-details-fil">
                        <div className="leave-details-container">
                        <label htmlFor="leave-status">Leave status</label>
                        <select id="leave-status" name="leave-status">
                          <option value="">All</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="cancelled">Cancelled</option>
                         </select>
                      </div>
                      <div className="leave-details-container">
                        <label htmlFor="leave-type">Leave type</label>
                        <select id="leave-type" name="leave-type">
                          <option value="">All</option>
                          <option value="casual">Casual Leave</option>
                          <option value="sick">Sick Leave</option>
                          <option value="earned">Earned Leave</option>
                          <option value="maternity">Maternity Leave</option>
                          <option value="paternity">Paternity Leave</option>
                          <option value="unpaid">Unpaid Leave</option>
                         </select>
                      </div>
                          <div className="leave-details-container">
                            <label htmlFor="from-date">From Date</label>
                            <input type="date" id="from-date" name="from-date" />
                          </div>
                          <div className="leave-details-container">
                            <label htmlFor="to-date">To Date</label>
                            <input type="date" id="to-date" name="to-date" />
                          </div>
                          <div className="button-container">
                            <button className="srch-button">Search</button>
                            <button className="dwnld-button">Download</button>
                          </div>
                        </div>
                        <div className="table-container">
                        <table className="leave-details-table-container">
                          <thead>
                            <tr>
                              <th>Status</th>
                              <th>From Date</th>
                              <th>Half/Full Day</th>
                              <th>To Date</th>
                              <th>Half/Full Day</th>
                              <th>No. of Days</th>
                              <th>Leave Type</th>
                              <th>Attachment</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><button className="status-button-approved">Approved</button></td>
                              <td>12/07/2024</td>
                              <td>Full Day</td>
                              <td>12/07/2024</td>
                              <td>Full Day</td>
                            <td>1</td>
                            <td>sick leave</td>
                            <td></td>
                          </tr>
                          <tr>
                              <td><button className="status-button-approved">Approved</button></td>
                              <td>15/07/2024</td>
                              <td>Full Day</td>
                              <td>15/07/2024</td>
                              <td>Full Day</td>
                            <td>1</td>
                            <td>sick leave</td>
                            <td></td>
                          </tr>
                          <tr>
                              <td><button className="status-button approved">Approved</button></td>
                              <td>18/07/2024</td>
                              <td>Full Day</td>
                              <td>18/07/2024</td>
                              <td>Second half</td>
                            <td>0.5</td>
                            <td>Casual Leave</td>
                            <td></td>
                          </tr>
                    
                      </tbody>
                    </table>
                    <div className="leave-details-pagination">
                          <p>Showing 1 to 3 of 3 entries</p>
                          <div className="leave-details-pagination-controls">
                          <span>Show</span>
                          <input type="number" min="0" defaultValue="0" />
                          <span>entries</span>
                         </div>
                       </div>
</div>
                   </div>
                )}
             {activeReportPage === 'annual-attendance-summary' && (
  <div className="annual-attendance-summary">
    
    <div className="first-block">
       <label htmlFor="year-select">Select Year: </label>
       <select id="year-select" name="year-select">
       <option value="2024">01/01/2024 - 31/12/2024</option>
       <option value="2025">01/01/2025 - 31/12/2025</option>
       <option value="2026">01/01/2026 - 31/12/2026</option>
       <option value="2027">01/01/2027 - 31/12/2027</option>
       <option value="2028">01/01/2028 - 31/12/2028</option>
       <option value="2029">01/01/2029 - 31/12/2029</option>
       <option value="2030">01/01/2030 - 31/12/2030</option>
     </select>
      <button className="srch-button">Search</button>
      <button className="exprt-button">Export to Excel</button>
    </div>

    
    </div>

)}



              {activeReportPage === 'holidays' && (
                <div className="holidays-page">
                  <div className="holidays-buttons">
                    <button className="print-button">Print</button>
                    <button className="excel-button">Export to Excel</button>
                  </div>

                  <div className="holidays-table-section">
                    <table className="holidays-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Reason</th>
                          <th>Day</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1st January, 2024</td>
                          <td>New Year's Day</td>
                          <td>Monday</td>
                        </tr>
                        <tr>
                          <td>15th January, 2024</td>
                          <td>Makar Sankranti</td>
                          <td>Monday</td>
                        </tr>
                        <tr>
                          <td>26th January, 2024</td>
                          <td>Republic Day</td>
                          <td>Friday</td>
                        </tr>
                        <tr>
                          <td>8th March, 2024</td>
                          <td>Maha Shivratri</td>
                          <td>Friday</td>
                        </tr>
                        <tr>
                          <td>25th March, 2024</td>
                          <td>Holi</td>
                          <td>Monday</td>
                        </tr>
                        <tr>
                          <td>1st May, 2024</td>
                          <td>Maharashtra Day</td>
                          <td>Wednesday</td>
                        </tr>
                        <tr>
                          <td>15th August, 2024</td>
                          <td>Independence Day</td>
                          <td>Thursday</td>
                        </tr>
                        <tr>
                          <td>7th September, 2024</td>
                          <td>Ganesh Chaturthi</td>
                          <td>Saturday</td>
                        </tr>
                        <tr>
                          <td>16th September, 2024</td>
                          <td>Eid-e-Milad</td>
                          <td>Monday</td>
                        </tr>
                        <tr>
                          <td>2nd October, 2024</td>
                          <td>Gandhi Jayanti</td>
                          <td>Wednesday</td>
                        </tr>
                        <tr>
                          <td>12th October, 2024</td>
                          <td>Dussehra/Vijaya Dasami</td>
                          <td>Saturday</td>
                        </tr>
                        <tr>
                          <td>31st October, 2024</td>
                          <td>Diwali/Deepawali</td>
                          <td>Thursday</td>
                        </tr>
                        <tr>
                          <td>1st November, 2024</td>
                          <td>Diwali/Deepawali</td>
                          <td>Friday</td>
                        </tr>
                        <tr>
                          <td>25th December, 2024</td>
                          <td>Christmas</td>
                          <td>Wednesday</td>
                        </tr>
         
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

                {activeReportPage === 'on-duty' && <h1>This is the On Duty Page</h1>}
              </div>
            </div>
          );
          case 'pending':
            return (
                <div className="pending-section">
                <div className="pending-leave-container">
                <h4>Pending Leave</h4>
                <table className="pending-leaves-table">
                  <thead>
                    <tr>
                      <th>Employee Name</th>
                      <th>Leave Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Number of Days</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                     
                      <td>XYZ</td>
                      <td>Sick Leave</td>
                      <td>02/09/2024</td>
                      <td>13/09/2024</td>
                      <td>11</td>
                      <td><button className="pending-approved-button">Approved</button>
                      <button className="pending-cancel-button">Cancel</button></td>
                    </tr>
                    <tr>
                      <td>ABC</td>
                      <td>Casual Leave</td>
                      <td>05/09/2024</td>
                      <td>10/09/2024</td>
                      <td>6</td>
                      <td><button className="pending-approved-button">Approved</button>
                      <button className="pending-cancel-button">Cancel</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              </div>
            );
      default:
        return null;
    }
  };

  return (
    <div className="manager-dashboard">
      <ManagerNavigation activeSection={activeSection} onNavigate={setActiveSection} />
      {renderSection()}
    </div>
  );
}

export default ManagerDashboard;