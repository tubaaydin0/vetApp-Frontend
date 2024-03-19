import React, { useEffect, useState } from 'react';
import './Appointment.css';
import { getAppointment, createAppointment, updateAppointments, deleteAppointment, getForDateAndDoctor, getForDateAndAnimal } from '../../API/Appointment';
import { getDoctor } from '../../API/Doctor';
import { getAnimal } from '../../API/Animal';
import { getAvailableDate } from '../../API/AvailableDate';

import DeleteIcon from '@mui/icons-material/Delete'; 
import UpdateIcon from '@mui/icons-material/Update';
import ErrorModal from '../ErrorModal/ErrorModal';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Paper from '@mui/material/Paper';

function Appointment() {

  const [animals, setAnimals] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reload, setReload] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);

 

  const [newAppointment, setNewAppointment] = useState({
    appointmentDate: ''
  });
  const [updateAppointment, setUpdateAppointment] = useState({
    appointmentDate: ''
  });


 
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [filterStartDate,setFilterStartDate]=useState('');
  const [filterEndDate,setFilterEndDate]=useState('');
  const [animalId,setAnimalId]=useState('');
  const [doctorId,setDoctorId]=useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');


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
   
  // READ
  useEffect(() => {
   getAppointment().then((data) => {
      setAppointments(data);
    })
    .catch((error) => {
      setReadError("Randevu için veriler alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });

    getAvailableDate().then((data)=>{
      setAvailableDates(data);

    })
    .catch((error) => {
      setReadError("Müsait gün için veriler alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });

   

    getDoctor().then((data) => {
      setDoctors(data);
    })
    .catch((error) => {
      setReadError("Doktor için veriler alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });


    getAnimal().then((data) => {
      setAnimals(data);
    })
    .catch((error) => {
      setReadError("Hayvan için veriler alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });

    setReload(false);
  }, [reload]);



  // CREATE
 
  const handleCreate = () => { 
   //console.log(newAppointment)
   const today = new Date();
   const selectedDate = new Date(newAppointment.appointmentDate);

   // Zaman bileşenlerini (saat, dakika, saniye) 00:00:00 olarak ayarla
   today.setHours(0, 0, 0, 0);

   if (selectedDate <= today) {
      setCreateError('Randevu tarihi, bugünden geri bir tarih olamaz!');
      setWarning(true)
     return;
   }

   if (!newAppointment.appointmentDate) {
    setCreateError('Tarih alanı boş bırakılamaz!');
    setWarning(true);
    return;
}

 if (!newAppointment?.doctor?.id) {
    setCreateError('Doktor ismi boş bırakılamaz!');
    setWarning(true);
    return;
}

if (!newAppointment?.animal?.id) {
    setCreateError('Hayvan ismi boş bırakılamaz!');
    setWarning(true);
    return;
}
    createAppointment(newAppointment).then(() => {
        setReload(true);
        setNewAppointment(
        {
            appointmentDate: "",   
     
        }
    )
    document.getElementById("selectCreateAnimal").selectedIndex = 0;
    document.getElementById("selectCreateDoctor").selectedIndex = 0;


  })
  .catch((error) => {
    if (error.response && error.response.data && error.response.data.message) {
        setCreateError(error.response.data.message);
        setWarning(true);
    }
    else {
        setCreateError('Bir hata oluştu. Lütfen tekrar deneyin.');
        setWarning(true);
    }
});
};

const handleNewAppointment = (e) => {
  if (e.target.name === "doctor") {
        return setNewAppointment({
            ...newAppointment,
            doctor: {
                id: e.target.value

            }
        })
    } else if (e.target.name==="animal") {
      return setNewAppointment({
        ...newAppointment,
        animal: {
            id: e.target.value 
        }
        
    })
    }
    
    else{
      const formattedDateTime = e.target.value.toString().slice(0, 16).replace('T', ' ');
     // console.log(formattedDateTime)
     

        setNewAppointment({
            ...newAppointment,
            [e.target.name]: formattedDateTime,
        })
    }
    
};


//FILTER

useEffect(() => {
  setDoctorId(selectedDoctor);
}, [selectedDoctor]);

useEffect(() => {
  setAnimalId(selectedAnimal);
}, [selectedAnimal]);



useEffect(() => {
  if (selectedOption === "animal") {
    if (!selectedAnimal || !filterStartDate || !filterEndDate) {
      //uyarı verilebilir
      return;
    }
    getForDateAndAnimal(animalId, filterStartDate, filterEndDate).then((data) => {
      setAppointments(data);
   
    });
  }

  if (selectedOption === "doctor") {
    if (!selectedDoctor || !filterStartDate || !filterEndDate) {
      // uyarı
      return;
    }

 
    getForDateAndDoctor(doctorId, filterStartDate, filterEndDate).then((data) => {
      setAppointments(data);
     
    });
  }
}, [filteredAppointments]);

const handleFilter = () => {
  if(selectedOption==="doctor"){
    if (!selectedDoctor || !filterStartDate || !filterEndDate) {
      //uyarı
      return;
    }
  
    setDoctorId(selectedDoctor);
    try {
      getForDateAndDoctor(doctorId, filterStartDate, filterEndDate).then((data)=>{
        setFilteredAppointments(data)
  
      });
    } catch (error) {
      //console.error("Doktor filtreleme hatası:", error);
    }
  }

if (selectedOption === 'animal') {
    if (!selectedAnimal || !filterStartDate || !filterEndDate) {
      // Uygun bir uyarı ver
      return;
    }

    setAnimalId(selectedAnimal)
    try {
      getForDateAndAnimal(animalId, filterStartDate, filterEndDate).then((data) => {
        setFilteredAppointments(data);
      });
    } catch (error) {
      //console.error("Hayvan filtreleme hatası:", error);
    }
  }
};


const handleResetFilter = () => {
  setFilteredAppointments([]);
  setSelectedAnimal('')
  setSelectedDoctor('')
  setFilterStartDate('');
  setFilterEndDate('');
  setReload(true)
  
};


//UPDATE

const handleUpdateBtn = (available) => {
 // console.log("available",available)
  const formattedDateTime = available.appointmentDate.slice(0, 16).replace('T', ' ');
 // console.log("format", formattedDateTime);

  setUpdateAppointment({
    ...available,
    appointmentDate: formattedDateTime,
    doctor:{
        id:available?.doctor?.id,
    }, 
    animal:{
      id:available?.animal?.id,
    } 
  });
   
   // console.log("available son hali",updateAppointment)
}
  


const handleUpdateChange = (event) => {
  if (event.target.name === "doctor") {
      return setUpdateAppointment({
          ...updateAppointment,
          doctor: {
              id: event.target.value

          }
      });
  } else  if (event.target.name === "animal") {
    return setUpdateAppointment({
        ...updateAppointment,
        animal: {
            id: event.target.value

        }
    });
} else  {
 
  const formattedDateTime = event.target.value.slice(0, 16).replace('T', ' ');
 // console.log("format", formattedDateTime);

  setUpdateAppointment({
      ...updateAppointment,
      [event.target.name]:formattedDateTime,
  });
   
  //  console.log("son hali",updateAppointment)
  }
}

const handleUpdate = () => {
 
//console.log("son hali",updateAppointment)

const today = new Date();
const selectedDate = new Date(updateAppointment.appointmentDate);

// Zaman bileşenlerini (saat, dakika, saniye) 00:00:00 olarak ayarla
today.setHours(0, 0, 0, 0);

if (selectedDate <= today) {
   setUpdateError('Randevu tarihi, bugünden geri bir tarih olamaz!');
   setWarning(true)
    return;
}

if (!updateAppointment.appointmentDate) {
 setUpdateError('Tarih alanı boş bırakılamaz!');
 setWarning(true);
 return;
}

if (!updateAppointment?.doctor?.id) {
 setUpdateError('Doktor ismi boş bırakılamaz!');
 setWarning(true);
 return;
}

if (!updateAppointment?.animal?.id) {
 setUpdateError('Hayvan ismi boş bırakılamaz!');
 setWarning(true);
 return;
}
updateAppointments(updateAppointment).then(() => {
    setReload(true);
    setUpdateAppointment({
      appointmentDate: ''
  });
  document.getElementById("selectUpdateDoctor").selectedIndex = 0;
  document.getElementById("selectUpdateAnimal").selectedIndex = 0;
  })
  .catch((error) => {
    if (error.response && error.response.data && error.response.data.message) {
      setUpdateError(error.response.data.message);
      setWarning(true);
  }
  else {
      setUpdateError('Bir hata oluştu. Lütfen tekrar deneyin.');
      setWarning(true);
  }
  });
}

//DELETE
const handleDelete = (id) => {
  deleteAppointment(id).then(() => {
      setReload(true);
  })

}



  return (
    <div className='appointment-page'>

      <h1>RANDEVU YÖNETİMİ</h1>
      <h2>Randevu Listesi</h2>
      <div className="error-message">  
        {readError && <ErrorModal error={readError} />}
      </div>
      <div className="appointment-filters">
        <h4>→ Filtreleme İşlemleri</h4>
        <div className="doctorAndDate-filter">
          <label>
            <input
              type="radio"
              value="doctor"
              checked={selectedOption === 'doctor'}
              onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>Doktor Adı ve Tarih Aralığı</span>
            </label>
            {selectedOption === 'doctor' && (
              <>
                <select name="doctor" value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                  <option value="" disabled selected>Doktor Seçiniz</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                  </option>
                  ))}
                </select>

                <label>
                  Randevu Başlangıç Tarihi 
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                  />
                </label>
                <label>
                  Randevu Bitiş Tarihi
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                  />
                </label>

              </>
            )}
          </div>

          <div className="animalAndDate-filter">
            <label>   
              <input
                type="radio"
                value="animal"
                checked={selectedOption === 'animal'}
                onChange={(e) => setSelectedOption(e.target.value)}
              />
              <span>Hayvan Adı ve Tarih Aralığı</span>
            </label>

            {selectedOption === 'animal' && (     
              <>
                <select name="animal" value={selectedAnimal} onChange={(e) => setSelectedAnimal(e.target.value)}>
                    <option value="" disabled selected>Hayvan Seçiniz</option>
                      {animals.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                        {animal.name}
                    </option>
                  ))}
                </select>
                <label>
                    Randevu Başlangıç Tarihi
                    <input
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                </label>
                <label>
                  Randevu Bitiş Tarihi
                    <input
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                </label>
              </>
            )}
            </div>
       
       
            <div className="filter-buttons">
              <button onClick={handleFilter}>Filtrele</button>
              <button onClick={handleResetFilter}>Filtreyi Sıfırla</button>
            </div>
      </div> 

      <TableContainer component={Paper}>
      
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          
          <TableHead className='appointment-table-head'>
            <TableRow>
              <TableCell>Randevu Tarihi</TableCell>
              <TableCell>Doktor Adı</TableCell>
              <TableCell>Hayvan Adı</TableCell>
              <TableCell>İşlemler</TableCell> 
            </TableRow>
          </TableHead>
          
          <TableBody className='appointment-table-body '>
          {(filteredAppointments.length > 0 ? filteredAppointments : appointments).map((appointment) => (
              <TableRow key={appointment.id}>
              
                <TableCell>{appointment.appointmentDate}</TableCell>
                <TableCell>{appointment?.doctor?.name}</TableCell>
                <TableCell>{appointment?.animal?.name}</TableCell>

                <TableCell>
                {<DeleteIcon onClick={() => handleDelete(appointment.id)} />}
                {<UpdateIcon onClick={() => {handleUpdateBtn(appointment) }} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="error-message">
        {deleteError && <ErrorModal error={DeleteError} />}
      </div>

      <h2><span>Yeni Randevu  Ekle</span> </h2>
      <div className="appointment-create">

        
          <input type="datetime-local"
            placeholder=''
            name='appointmentDate'
            value={newAppointment.appointmentDate}
            onChange={handleNewAppointment}
          />

                  
          <select id='selectCreateDoctor' name='doctor'
            value={newAppointment?.doctor?.id}
            onChange={handleNewAppointment}>

            <option value="" disabled selected>Doktor Seçiniz</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
          </select>

          <select id='selectCreateAnimal' name='animal'
            value={newAppointment?.animal?.id}
            onChange={handleNewAppointment}>

            <option value="" disabled selected>Hayvan Seçiniz</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name}
                </option>
              ))}
          </select>

          <button onClick={handleCreate}>Kaydet</button>
          
        </div>
        <div className="error-message">
          {createError && <ErrorModal error={createError} />}
        </div>
      <h2><span>Randevu Bilgilerini Güncelle</span></h2>
      <div className="appointment-update">
        

        <input type="datetime-local"
          placeholder=''
          name='appointmentDate'
          value={updateAppointment.appointmentDate}
          onChange={handleUpdateChange}
        />

                    
        <select id='selectUpdateDoctor' name='doctor'
          value={updateAppointment?.doctor?.id}
          onChange={handleUpdateChange}>

          <option value="" disabled selected>Doktor Seçiniz</option>
            {doctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </select>

        <select id='selectUpdateAnimal' name='animal'
          value={updateAppointment?.animal?.id}
          onChange={handleUpdateChange}>

          <option value="" disabled selected>Hayvan Seçiniz</option>
            {animals.map((animal) => (
              <option key={animal.id} value={animal.id}>
                {animal.name}
              </option>
            ))}
          </select>
          <button onClick={handleUpdate}>Güncelle</button>
          
      </div>
      <div className="error-message">
        {updateError && <ErrorModal error={updateError} />}
      </div> 
        
    </div>
  );
}

export default Appointment;
