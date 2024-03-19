import React, { useEffect, useState } from 'react'
import './Doctor.css'
import AvailableDate from '../AvailableDate/AvailableDate';
import { getDoctor,createDoctor,updateDoctors,deleteDoctor } from '../../API/Doctor'
import DeleteIcon from '@mui/icons-material/Delete'; // material icon ekleme
import UpdateIcon from '@mui/icons-material/Update';
import ErrorModal from '../ErrorModal/ErrorModal';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Paper from '@mui/material/Paper';
function Doctor() {

  const [doctors, setDoctors]=useState([]);
  const [reload, setReload]=useState(true);
  const [isUpdate, setIsUpdate]=useState(false);
 
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    mail: "",
    address: "",
    city:"",
    phone:""

})
const [updateDoctor, setUpdateDoctor] = useState({
  name: "",
  mail: "",
  address: "",
  city:"",
  phone:""
})

const [createError, setCreateError] = useState(null);
const [updateError, setUpdateError] = useState(null);
const [deleteError, setDeleteError] = useState(null);
const [readError, setReadError] = useState(null);
const [warning, setWarning] = useState(false);

//READ
useEffect(()=>{
  getDoctor().then((data)=>{
    setDoctors(data);
    //console.log(data)
  })
  .catch((error) => {
    setReadError("Doktor verileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
    setWarning(true)
  });
  setReload(false);
}, [reload]);



//DELETE
const handleDelete = (id) => {
  deleteDoctor(id)
      .then(() => {
          setReload(true);
      })
      .catch((error) => {
        setDeleteError("Bir hata oluştu, tekrar deneyiniz!")
        setWarning(true)
      });
}

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
 
  const validateEmail = (email) => {
    //email formatı kontrolü
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};
//CREATE

const handleNewDoctor = (event) => {
  setNewDoctor({
      ...newDoctor,
      [event.target.name]: event.target.value
  })

}

const handleCreate = () => {
  if (doctors.some(doctor => doctor.mail === newDoctor.mail || doctor.phone===newDoctor.phone)) {
    setCreateError('Sistemde aynı mail ve telefona sahip doktor kayıtlıdır!');
    setWarning(true)
    return;
  }
  if (!newDoctor.name) {
    setCreateError('Doktor ismi boş bırakılamaz!');
    setWarning(true)
      return;
  }

  if (!newDoctor.phone) {
     setCreateError('Telefon alanı boş bırakılamaz');
     setWarning(true)
      return;
  }

  if (!newDoctor.mail || !validateEmail(newDoctor.mail)) {
     setCreateError('Mail alanı boş bırakılamaz! / Mail adresinizi formata uygun yazınız.');
     setWarning(true)
      return;
  }
  createDoctor(newDoctor).then(() => {
      setReload(true);
      setNewDoctor(
          {
            name: "",
            mail: "",
            address: "",
            city:"",
            phone:""
          }
      );
      setCreateError(null);
  })
  .catch((error) => {
    setCreateError('Bir hata oluştu. Lütfen tekrar deneyin.'); // Genel bir hata mesajı
  });
}

//UPDATE

const handleUpdateBtn = (doc) => {
  setUpdateDoctor(doc)
}

const handleUpdateChange = (event) => {
setUpdateDoctor(
  {
    ...updateDoctor,
    [event.target.name]: event.target.value

  }
)
}

const handleUpdate = () => {

 
  if (!updateDoctor.name) {
      setUpdateError('Doktor ismi boş bırakılamaz!');
      setWarning(true)
        return;
    }

    if (!updateDoctor.phone) {
      setUpdateError('Telefon alanı boş bırakılamaz');
      setWarning(true)
      return;
    }

    if (!updateDoctor.mail || !validateEmail(updateDoctor.mail)) {
      setUpdateError('Mail alanı boş bırakılamaz! / Mail adresinizi formata uygun yazınız.');
      setWarning(true)
        return;
    }
  
updateDoctors(updateDoctor).then(() => {
    setReload(true);
    setIsUpdate(true);
    setUpdateDoctor(
      {
        name: "",
        mail: "",
        address: "",
        city:"",
        phone:""
      }
    )
  })
  .catch((error) => {
    if (error.response && error.response.status === 409) {
        setUpdateError('Aynı mail veya telefon numarasına sahip başka bir doktor kayıtlı!');
        setWarning(true)
      } else {
        setUpdateError('Bir hata oluştu. Lütfen tekrar deneyin.');
        setWarning(true)
    }
  }); 
}

// rows dizisini oluştur
const rows = doctors.map((doctor) => createData(doctor.id, doctor.name, doctor.mail, doctor.address, doctor.city, doctor.phone));

// createData fonksiyonunu tanımla
function createData(id, name, mail, address, city, phone) {
  return { id, name, mail, address, city, phone };
}
  return (
    <>
    
    <div className="doctor-page">
    <h1>DOKTOR YÖNETİMİ</h1> 
        <h2>Doktor Listesi</h2>
        <div className="error-message">  
          {readError && <ErrorModal error={readError} />}
        </div>

      <div className="table-container" > 
        
        <TableContainer component={Paper}sx={{ maxHeight: 400, overflow: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table"></Table>
          <Table>
            <TableHead className='doctor-table-head'>
              <TableRow>
             
                <TableCell>Doktor Adı</TableCell>
                <TableCell>Doktor Mail</TableCell>
                <TableCell>Doktor Adres</TableCell>
                <TableCell>Doktor Yaşadığı Şehir</TableCell>
                <TableCell>Doktor Telefon</TableCell>
                <TableCell>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className='doctor-table-body'>
              {rows.map((row) => (
                <TableRow key={row.id}>
                 
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.mail}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell>
                    <DeleteIcon onClick={() => handleDelete(row.id)} />
                    <UpdateIcon onClick={() => handleUpdateBtn(row)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="error-message">
          {deleteError && <ErrorModal error={DeleteError} />}
        </div>
      </div>  

      <h2><span>Doktor Ekle</span> </h2>
      <div className="doctor-create">
          
            <input type="Text"
              placeholder='Doktor Adı'
              name='name'
              value={newDoctor.name}
              onChange={handleNewDoctor}
            />

            <input type="email"
              placeholder='Doktor Email'
              name='mail'
              value={newDoctor.mail}
              onChange={handleNewDoctor}
            />

            <input type="text"
              placeholder='Doktor Adres'
              name='address'
              value={newDoctor.address}
              onChange={handleNewDoctor}
            />

            <input type="text"
              placeholder='Doktor Yaşadığı Şehir'
              name='city'
              value={newDoctor.city}
              onChange={handleNewDoctor}
            />

            <input type="tel"
              placeholder='Doktor Telefon'
              name='phone'
              value={newDoctor.phone}
              onChange={handleNewDoctor}
            />

            <button onClick={handleCreate}>Kaydet</button>
            
      </div>
      <div className="error-message">
        {createError && <ErrorModal error={createError} />}
      </div>
      <h2><span>Doktor Bilgilerini Güncelle</span></h2>
      <div className="doctor-update">
            
            <input type="text"
                placeholder='Doktor Adı'
                name='name'
                value={updateDoctor.name}
                onChange={handleUpdateChange}
              />

              <input type="email"
                placeholder='Doktor Email'
                name='mail'
                value={updateDoctor.mail}
                onChange={handleUpdateChange}
              />

              <input type="text"
                placeholder='Doktor Adres'
                name='address'
                value={updateDoctor.address}
                onChange={handleUpdateChange}
              />

              <input type="text"
                placeholder='Doktor Yaşadığı Şehir'
                name='city'
                value={updateDoctor.city}
                onChange={handleUpdateChange}
              />

              <input type="tel"
                placeholder='Doktor Telefon'
                name='phone'
                value={updateDoctor.phone}
                onChange={handleUpdateChange}
              />

              <button onClick={handleUpdate}>Güncelle</button>
              
      </div>
      <div className="error-message">
        {updateError && <ErrorModal error={updateError} />}
      </div>
    </div>
    <AvailableDate  isUpdate={isUpdate} setIsUpdate={setIsUpdate}/>

    </>
  )
}

export default Doctor
