import React, { useEffect, useState } from 'react'
import './AvailableDate.css'
import { getAvailableDate,createAvailableDate, updateAvailableDates
, deleteAvailableDate} from '../../API/AvailableDate'
import { getDoctor} from '../../API/Doctor'
import DeleteIcon from '@mui/icons-material/Delete'; // material icon ekleme
import UpdateIcon from '@mui/icons-material/Update';
import ErrorModal from '../ErrorModal/ErrorModal';


import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Paper from '@mui/material/Paper';

function AvailableDate({isUpdate, setIsUpdate}) {
  const [availableDates, setAvailableDates]=useState([]);
  const [reload, setReload]=useState(true);
  const [doctors, setDoctors]=useState([]);
  const [newAvailableDate, setNewAvailableDate] = useState({
    availableDate:"",
      
  })
  const [updateAvailableDate, setUpdateAvailableDate] = useState({
    availableDate:"",
    
  })

  const [createError, setCreateError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [readError, setReadError] = useState(null);
  const [warning, setWarning] = useState(false);


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
  
  //READ
  setIsUpdate(false); // Doctor güncellenince availabledate de güncellensin.
    useEffect(()=>{
      getAvailableDate().then((data)=>{
        setAvailableDates(data);
       // console.log(data)
      })
      .catch((error) => {
        setReadError('Uygun tarihler alınamadı. Lütfen daha sonra tekrar deneyiniz!');
        setWarning(true);
    });
      getDoctor().then((data) => {
        setDoctors(data);
       // console.log(data)
    })
    .catch((error) => {
      setReadError('Doktor verileri alınamadı. Lütfen daha sonra tekrar deneyiniz!');
      setWarning(true);
  });
      setReload(false);
    }, [reload, isUpdate]);

  //CREATE
  const handleCreate = () => { // doctor listesi oluşturmak için
    
    const today = new Date();
    const selectedDate = new Date(newAvailableDate.availableDate);

    // Zaman bileşenlerini (saat, dakika, saniye) 00:00:00 olarak ayarla
    today.setHours(0, 0, 0, 0);
    if (!newAvailableDate.availableDate) {
      setCreateError('Tarih alanı boş bırakılamaz');
      setWarning(true);
      return;
    }
    if (selectedDate <= today) {
       setCreateError('Müsait gün tarihi, bugünden geri bir tarih olamaz!');
       setWarning(true)
      return;
    }
   
  
    if (!newAvailableDate?.doctor?.id) {
       setCreateError('Doktor adı alanı boş bırakılamaz!');
       setWarning(true)
        return;
    }
  
    createAvailableDate(newAvailableDate).then(() => {
      setReload(true);
      setNewAvailableDate(
          {
              availableDate: "",
            
      
          }
      )
    })
    .catch((error) => {
      if (error.response && error.response.status === 409) {
          setCreateError('Aynı bilgiler tekrar Kaydedilemez!');
          setWarning(true)
        } else {
          setCreateError('Bir hata oluştu. Lütfen tekrar deneyin.');
          setWarning(true)
      }
  });
};

const handleNewAvailableDate = (e) => {

    if (e.target.name === "doctor") {
        return setNewAvailableDate({
            ...newAvailableDate,
            doctor: {
                id: e.target.value

            }
        })
    } else {
        setNewAvailableDate({
            ...newAvailableDate,
            [e.target.name]: e.target.value,
        })
    }
    //console.log(newAvailableDate)
};
  
  //UPDATE
  

const handleUpdateBtn = (available) => {
  
    setUpdateAvailableDate(available);
    
}
useEffect(() => {
    //console.log(updateAvailableDate);
}, [updateAvailableDate]);

const handleUpdateChange = (event) => {
    if (event.target.name === "doctor") {
        return setUpdateAvailableDate({
            ...updateAvailableDate,
            doctor: {
                id: event.target.value

            }
        });
    } else {
        setUpdateAvailableDate(
            {
            ...updateAvailableDate,
            [event.target.name]: event.target.value

            }
        )
    }
}

const handleUpdate = () => {
  const today = new Date();
    const selectedDate = new Date(updateAvailableDate.availableDate);

    // Zaman bileşenlerini (saat, dakika, saniye) 00:00:00 olarak ayarla
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setUpdateError('Müsait gün tarihi, bugünden geri bir tarih olamaz!');
      setWarning(true)
      return;
    }
  

  if (!updateAvailableDate?.doctor?.id) {
     setUpdateError('Doktor adı alanı boş bırakılamaz!');
     setWarning(true)
      return;
  }
  updateAvailableDates(updateAvailableDate).then(() => {
    setReload(true);
    setUpdateAvailableDate(
    {
      availableDate:""
    }
  )
})
  .catch((error) => {
    if (error.response && error.response.status === 409) {
        setUpdateError('Aynı bilgiler tekrar Kaydedilemez!');
        setWarning(true)
      } else {
        setUpdateError('Bir hata oluştu. Lütfen tekrar deneyin.');
        setWarning(true)
    }
});
}

//DELETE
const handleDelete = (id) => {
  deleteAvailableDate(id).then(() => {
      setReload(true);
  })
  .catch((error) => {
    setDeleteError("Bir hata oluştu, tekrar deneyiniz!")
    setWarning(true)
  });
}


  return (
    <>
     
    <div className="available-page">
      <h1>MÜSAİT GÜN YÖNETİMİ</h1>
      <h2>Doktor Müsait Olduğu Gün Listesi</h2>
      <div className="error-message">  
        {readError && <ErrorModal error={readError} />}
      </div>

      <TableContainer component={Paper} >
        
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className='available-table-head'>
            <TableRow>
              <TableCell>Müsait Olduğu Gün</TableCell>
              <TableCell>Doktor Adı</TableCell>
              <TableCell>Doktor Mail</TableCell>
              <TableCell>Doktor Telefon</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='available-table-body'>
            {availableDates.map((availableDate) => (
              <TableRow key={availableDate.id}>
                <TableCell>{availableDate.availableDate}</TableCell>
                <TableCell>{availableDate?.doctor?.name}</TableCell>
                <TableCell>{availableDate?.doctor?.mail}</TableCell>
                <TableCell>{availableDate?.doctor?.phone}</TableCell>
                <TableCell>
                {<DeleteIcon onClick={() => handleDelete(availableDate.id)} />}
                  {<UpdateIcon onClick={() => {handleUpdateBtn(availableDate) }} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="error-message">
        {deleteError && <ErrorModal error={DeleteError} />}
      </div>
      
      <h2><span>Müsait Gün Ekle</span> </h2>
      <div className="available-create">
                
        <input type="date"
          placeholder=''
          name='availableDate'
          value={newAvailableDate.availableDate}
          onChange={handleNewAvailableDate}
        />

              
        <select name='doctor'
          value={newAvailableDate?.doctor?.id}
          onChange={handleNewAvailableDate}>

          <option value="" disabled selected>Doktor Seçiniz</option>
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
                {doctor.name}
            </option>
          ))}
        </select>

        <button onClick={handleCreate}>Kaydet</button>
     
      </div>

      <div className="error-message">
        {createError && <ErrorModal error={createError} />}
      </div>

      <h2><span>Müsait Gün Bilgilerini Güncelle</span></h2>

      <div className="available-update">
        

        <input type="date"
          placeholder=''
          name='availableDate'
          value={updateAvailableDate.availableDate}
          onChange={handleUpdateChange}
        />

              
        <select name='doctor'
          value={updateAvailableDate?.doctor?.id}
          onChange={handleUpdateChange}>

          <option value="" disabled selected>Doktor Adı</option>
                   
          {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>
    
        <button onClick={handleUpdate}>Güncelle</button>

      </div>
      <div className="error-message">
        {updateError && <ErrorModal error={updateError} />}
      </div>

    </div> 
    </> 
    
  )
}

export default AvailableDate
