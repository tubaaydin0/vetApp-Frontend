import React, { useEffect, useState } from 'react'
import './Report.css';

import {getReport,createReport,updateReports,deleteReport} from '../../API/Report'
import {getAppointment} from '../../API/Appointment'
import DeleteIcon from '@mui/icons-material/Delete'; // material icon ekleme
import UpdateIcon from '@mui/icons-material/Update';
import ErrorModal from '../ErrorModal/ErrorModal';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Paper from '@mui/material/Paper';


//Update işlemi sırasında updatebtna tıklayınca randevu tarihini getirmiyor ve ikinci kez update ederken tarih seçili kalınca hata veriyor.
function Report() {
  const [reports, setReports]= useState([]);
  const [reload, setReload]=useState(true);
  const [appointments,setAppointments]=useState([]);
  const [newReport,setNewReport]=useState({
    title:"",
    diagnosis:"",
    price:""
  })

  const [updateReport, setUpdateReport]= useState({
    title:"",
    diagnosis:"",
    price:""
  })

  const [createError, setCreateError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [readError, setReadError] = useState(null);
  const [warning, setWarning] = useState(false);

  //READ
  useEffect(() => {
    getReport().then((data) => {
      setReports(data);
    })
    .catch((error) => {
    setReadError("Rapor bilgileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
    setWarning(true)
    });

    getAppointment().then((data) => {
      setAppointments(data);
    })
    .catch((error) => {
      setReadError("Randevu bilgileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });

    setReload(false);
}, [reload]);

//ERROR
useEffect(()=>{
  if(createError!=null){
      setTimeout(()=>{
      setCreateError(null)
      },5000)
    }
  else if(updateError!=null){
    setTimeout(()=>{
      setUpdateError(null)
    },5000)
  }
  else if (deleteError !=null){
    setTimeout(()=>{
      setDeleteError(null)
    },5000)
  }
  else if (readError !=null){
    setTimeout(()=>{
      setReadError(null)
    },10000)
  }
 
  setWarning(false)  

  }, [warning]);

  //CREATE

  const handleNewReport = (e) => {

    if (e.target.name === "appointment") {
        return setNewReport({
            ...newReport,
            appointment: {
                id: e.target.value
  
            }
        })
    } else {
        setNewReport({
            ...newReport,
            [e.target.name]: e.target.value,
        })
    }
   
  };

  const handleCreate = () => {

    if (!newReport.title) {
      setCreateError('Başlık boş bırakılamaz!');
      setWarning(true)
      return;
    }
  
    if (!newReport.diagnosis) {
      setCreateError('Tanı alanı boş bırakılamaz');
      setWarning(true)
      return;
    }
  
    if (!newReport.price) {
      setCreateError('Fiyat alanı boş bırakılamaz');
      setWarning(true)
      return;
   }

   if (!newReport.appointment?.id) {
    setCreateError('Randevu alanı boş bırakılamaz');
    setWarning(true)
    return;
 }
   
    createReport(newReport).then(() => {
      setReload(true);
      setNewReport(
          {
            title:"",
            diagnosis:"",
            price:""
          }
      )
      document.getElementById("selectCreateAppointment").selectedIndex = 0;

    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
        setCreateError('Aynı randevu tarihi tekrar kaydedilemez!');
        setWarning(true)
      } else {
        setCreateError('Bir hata oluştu. Lütfen tekrar deneyin.');
        setWarning(true)
    }    });
};






//UPDATE


const handleUpdateBtn = (report) => {
 // console.log(report)
  setUpdateReport(report);
  
}


const handleUpdateChange = (event) => {
  if (event.target.name === "appointment") {
      return setUpdateReport({
          ...updateReport,
          appointment: {
              id: event.target.value

          }
      });
  } else {
      setUpdateReport(
          {
          ...updateReport,
          [event.target.name]: event.target.value

          }
      )
  }
}

const handleUpdate = () => {
  
  if (!updateReport.title) {
    setUpdateError('Başlık boş bırakılamaz!');
    setWarning(true)
    return;
  }

  if (!updateReport.diagnosis) {
    setUpdateError('Tanı alanı boş bırakılamaz');
    setWarning(true)
    return;
  }

  if (!updateReport.price) {
    setUpdateError('Fiyat alanı boş bırakılamaz');
    setWarning(true)
    return;
 }

 

updateReports(updateReport).then(() => {
  setReload(true);

  setUpdateReport(
    {
      
      title:"",
      diagnosis:"",
      price:"",
  
    }
    
  )
  document.getElementById("selectUpdateAppointment").selectedIndex = 0;

})
  .catch((error) => {
    if (error.response && error.response.status === 409) {
      setUpdateError('Aynı randevu tarihi tekrar kaydedilemez!');
      setWarning(true)
    }else if (!updateReport.appointment?.id) {
      setUpdateError('Randevu alanı boş bırakılamaz');
      setWarning(true)
      return;
      }
    else {
      setUpdateError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setWarning(true)
    }    
  });

 
 
 

}

//DELETE
const handleDelete=(id)=>{
  deleteReport(id).then(()=> {
    setReload(true);
  })
  .catch((error) => {
    setDeleteError("Bir hata oluştu, tekrar deneyiniz!")
    setWarning(true)
  });
}
  return (
    <>

    <div className='report-page'> 
      <h1>RAPOR YÖNETİMİ</h1>     
      <h2>Rapor Listesi</h2>
      <div className="error-message">  
        {readError && <ErrorModal error={readError} />}
      </div>      <TableContainer component={Paper}>
      
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className='report-table-head'>
          <TableRow>
            
            <TableCell>Rapor No</TableCell>
            <TableCell>Randevu Tarihi</TableCell>
            <TableCell>Rapor Başlık</TableCell>
            <TableCell>Rapor Tanı</TableCell>
            <TableCell>Fiyat</TableCell>
            <TableCell>Hayvan Adı</TableCell>
            <TableCell>Müşteri Adı</TableCell>
            <TableCell>Doktor Adı</TableCell>
            <TableCell>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='report-table-body'>
          {reports.map((report) => (
            <TableRow key={report.id}>
            
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.appointment?.appointmentDate}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.diagnosis}</TableCell>
                <TableCell>{report.price}</TableCell>
                <TableCell>{report.animalName}</TableCell>
                <TableCell>{report.customerName}</TableCell>
                <TableCell>{report.doctorName}</TableCell>
                <TableCell>
                  {<DeleteIcon onClick={() => handleDelete(report.id)} />}
                  {<UpdateIcon onClick={() => {handleUpdateBtn(report) }} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="error-message">
        {deleteError && <ErrorModal error={DeleteError} />}
      </div>

      <h2><span>Yeni Rapor Ekle</span> </h2>
        <div className="report-create">
                  
          <input type="text"
            placeholder='Başlık Yaz'
            name='title'
            value={newReport.title}
            onChange={handleNewReport}
          />
          <input type="text"
            placeholder='Tanı Yaz'
            name='diagnosis'
            value={newReport.diagnosis}
            onChange={handleNewReport}
          />
          <input type="number"
            placeholder='Fiyat Yaz'
            name='price'
            value={newReport.price}
            onChange={handleNewReport}
          />

                
          <select id='selectCreateAppointment' name='appointment'
            value={newReport?.appointment?.id}
            onChange={handleNewReport}>

            <option value="" disabled selected>Randevu Seçiniz</option>
              {appointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.appointmentDate}
                </option>
              ))}
          </select>

          <button onClick={handleCreate}>create</button>
        </div>
        <div className="error-message">
          {createError && <ErrorModal error={createError} />}
        </div>

        <h2><span>Rapor Bilgilerini Güncelle</span></h2>
        <div className="report-update">
              
      
        <input type="text"
          placeholder='Başlık Yaz'
          name='title'
          value={updateReport.title}
          onChange={handleUpdateChange}
        />
        <input type="text"
          placeholder='Tanı Yaz'
          name='diagnosis'
          value={updateReport.diagnosis}
          onChange={handleUpdateChange}
        />
        <input type="number"
          placeholder='Fiyat Yaz'
          name='price'
          value={updateReport.price}
          onChange={handleUpdateChange}
        />

                
        <select id='selectUpdateAppointment' name='appointment'
          value={updateReport?.appointment?.id}
          onChange={handleUpdateChange}>

          <option value="" disabled selected>Randevu Seçiniz</option>
            {appointments.map((appointment) => (
            <option key={appointment.id} value={appointment.id}>
              {appointment.appointmentDate}
            </option>
          ))}
        </select>
        <button onClick={handleUpdate}>update</button>
      
      </div>
      <div className="error-message">
        {updateError && <ErrorModal error={updateError} />}
      </div>
    </div>

    </>
  )
}

export default Report
