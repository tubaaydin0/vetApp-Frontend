import React, { useEffect, useState } from 'react';
import './Vaccine.css';
import {getVaccine, createVaccine, updateVaccines,deleteVaccine, getAnimalNameFilter,getAnimalByWillExpire} from '../../API/Vaccine';
import {getAnimal} from '../../API/Animal'
import {getReport, getReportsByAnimalId} from '../../API/Report'
import {getAppointment} from '../../API/Appointment'
import DeleteIcon from '@mui/icons-material/Delete'; 
import UpdateIcon from '@mui/icons-material/Update';

import ErrorModal from '../ErrorModal/ErrorModal';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Paper from '@mui/material/Paper';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';




function Vaccine() {

  const [vaccines, setVaccines]=useState([]);
  const [reload, setReload] = useState(true);
  const [animals, setAnimals]=useState([]);
  const [reports, setReports]=useState([]);
  const [newVaccine, setNewVaccine]= useState({
    name:"",
    code:"",
    protectionStartDate:"",
    protectionFinishDate:"",
  })
  const [selectedCreateAnimalId, setSelectedCreateAnimalId] = useState('');
  const [selectedUpdateAnimalId, setSelectedUpdateAnimalId] = useState('');

  const [updateVaccine, setUpdateVaccine]= useState({
    name:"",
    code:"",
    protectionStartDate:"",
    protectionFinishDate:"",
  })

  const [filterText, setFilterText] = useState('');
  const [filteredVaccines, setFilteredVaccines] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [filterStartDate,setFilterStartDate]=useState('');
  const [filterEndDate,setFilterEndDate]=useState('');
  
  const [createError, setCreateError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [readError, setReadError] = useState(null);
  const [warning, setWarning] = useState(false);
  
 
  //READ
  useEffect(()=>{
    getVaccine().then((data)=>{
      setVaccines(data);
    })
    .catch((error) => {
      setReadError("Aşı verileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });

    getAnimal().then((data)=>{
      setAnimals(data);
    })
    .catch((error) => {
      setReadError("Hayvan verileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });

    getReport().then((data)=>{
      setReports(data);
    })
    .catch((error) => {
      setReadError("Rapor verileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });
  
    setReload(false);
  },[reload])

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
  useEffect(() => {
    if (selectedCreateAnimalId) {
      getReportsByAnimalId(selectedCreateAnimalId)
        .then(data => {
          setReports(data);
        })
        .catch(error => console.error('Raporlar alınamadı:', error));
    

    getAppointment()
    .then(data => {
      setAppointments(data);
    })
    .catch(error => console.error('Rapordaki randevular alınamadı:', error));
}
  }, [selectedCreateAnimalId]);

  useEffect(() => {
    if (selectedCreateAnimalId) {
        const animalReports = reports.filter(report => report?.appointment?.animal?.id === parseInt(selectedCreateAnimalId));
        setReports(animalReports);
    }
}, [selectedCreateAnimalId]);


  const handleAnimalCreateChange = (e) => {
    const animalId = parseInt(e.target.value);
    setSelectedCreateAnimalId(animalId);
    setNewVaccine({
      ...newVaccine,
      animal: {
        id: animalId
      }
    });
  };
  const handleCreate = () => { 

  
    const selectedReport = reports.find(report => report.id === newVaccine?.report?.id);
    //console.log(selectedReport)
    //console.log(selectedReport?.appointment?.animal?.id)
    //console.log(newVaccine?.report?.id)
    if (!newVaccine.name) {
        setCreateError('Aşı ismi boş bırakılamaz!');
        setWarning(true);
        return;
    }

    else if (!newVaccine.code) {
        setCreateError('Aşı kodu boş bırakılamaz!');
        setWarning(true);
        return;
    }

    else if (!newVaccine.protectionStartDate) {
        setCreateError('Aşı başlangıç tarihi boş bırakılamaz!');
        setWarning(true);
        return;
    }

    else if (!newVaccine.protectionFinishDate) {
        setCreateError('Aşı bitiş tarihi boş bırakılamaz!');
        setWarning(true);
        return;
    }

    else if(!newVaccine?.animal?.id){
      setCreateError('Hayvan ismi boş bırakılamaz!');
      setWarning(true);
      return;
    }
   
    /*else if (selectedReport?.appointment?.animalId !== newVaccine?.animalId) {
      setCreateError('Aşı için seçilen hayvan raporda bulunan hayvan ile aynı değil!');
      setWarning(true);
      return;
    }*/

    else {
        createVaccine(newVaccine)
            .then(() => {
                setReload(true);
                setNewVaccine({
                    name:"",
                    code:"",
                    protectionStartDate:"",
                    protectionFinishDate:"",
                });
                document.getElementById("selectCreateAnimal").selectedIndex = 0;
                 document.getElementById("selectCreateReport").selectedIndex = 0;
                setCreateError(null); // Başarılı olunduğunda hatayı temizle
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
    }
};


const handleNewVaccine = (e) => {

    if (e.target.name === "animal") {
        return setNewVaccine({
            ...newVaccine,
            animal: {
                id: e.target.value

            }
        })
    } else if (e.target.name === "report") {
      return setNewVaccine({
          ...newVaccine,
          report: {
              id: e.target.value

          }
      })
  } 
    
    else {
        setNewVaccine({
            ...newVaccine,
            [e.target.name]: e.target.value,
        })
    }
    
};


//FİLTER
useEffect(() => {
  const fetchData = async () => {
    try {
      if (selectedOption === 'animal') {
        const data = await getAnimalNameFilter(filterText);
        setVaccines(data);
      }
      if(selectedOption === 'willExpiredVaccine') {
        const data = await getAnimalByWillExpire(filterStartDate, filterEndDate);
        setVaccines(data);
      }
    } catch (error) {
     
    }
  };

  fetchData();
}, [filteredVaccines]);

const handleFilter = () => {
  if (selectedOption === 'animal') {
    getAnimalNameFilter(filterText).then((data) => {
      setFilteredVaccines(data);
    });
  }
  if(selectedOption==="willExpiredVaccine"){
    getAnimalByWillExpire(filterStartDate, filterEndDate).then((data)=>{
      setFilteredVaccines(data);
    })
  }
};

const handleResetFilter = () => {
  setFilterText('');
  setFilterStartDate('');
  setFilterEndDate('');
  setFilteredVaccines([]);
  setReload(true)
};


//UPDATE
useEffect(() => {
  if (selectedUpdateAnimalId) {
    getReportsByAnimalId(selectedUpdateAnimalId)
      .then(data => {
        setReports(data);
      })
      .catch(error => console.error('Raporlar alınamadı:', error));
  

  getAppointment()
  .then(data => {
    setAppointments(data);
  })
  .catch(error => console.error('Rapordaki randevular alınamadı:', error));
}
}, [selectedUpdateAnimalId]);

useEffect(() => {
  if (selectedUpdateAnimalId) {
      const animalReports = reports.filter(report => report?.appointment?.animal?.id === parseInt(selectedUpdateAnimalId));
      setReports(animalReports);
  }
}, [selectedUpdateAnimalId]);


const handleAnimalUpdateChange = (e) => {
  const animalId = parseInt(e.target.value);
  setSelectedUpdateAnimalId(animalId);
  setNewVaccine({
    ...newVaccine,
    animal: {
      id: animalId
    }
  });
};
  
const handleUpdateBtn = (vac) => {
  
  setUpdateVaccine(vac);
  
}

const handleUpdateChange = (event) => {
  if (event.target.name === "animal") {
      return setUpdateVaccine({
          ...updateVaccine,
          animal: {
              id: event.target.value

          }
      });
  }else if (event.target.name === "report") {
    return setUpdateVaccine({
        ...updateVaccine,
        report: {
            id: parseInt(event.target.value)
        }
    });
  } 
  else if(!updateVaccine?.animal?.id){
    setUpdateError('Hayvan ismi boş bırakılamaz!');
    setWarning(true);
  }
  
  else {
      setUpdateVaccine(
          {
          ...updateVaccine,
          [event.target.name]: event.target.value

          }
      )
  }
}

const handleUpdate = () => {
  try {
    if (!updateVaccine.name) {
      setUpdateError('Aşı ismi boş bırakılamaz!');
      setWarning(true)
      return;
    }
    if (!updateVaccine.code) {
      setUpdateError('Aşı kodu boş bırakılamaz!');
      setWarning(true)
      return;
    }
    if (!updateVaccine.protectionStartDate) {
      setUpdateError('Aşı başlangıç tarihi boş bırakılamaz!');
      setWarning(true)
      return;
    }
    if (!updateVaccine.protectionFinishDate) {
      setUpdateError('Aşı bitiş tarihi boş bırakılamaz!');
      setWarning(true)
      return;
    }
    
    updateVaccines(updateVaccine).then(() => {
      setReload(true);
      setUpdateVaccine({
        name:"",
        code:"",
        protectionStartDate:"",
        protectionFinishDate:"",
      });
      document.getElementById("selectUpdateAnimal").selectedIndex = 0;
      document.getElementById("selectUpdateReport").selectedIndex = 0;
    }).catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
        setUpdateError(error.response.data.message);
        setWarning(true)
      } else {
        setUpdateError('Bir hata oluştu. Lütfen tekrar deneyin.');
        setWarning(true)
      }
    });
  } catch (error) {
    //console.error('Hata oluştu:', error);
    setUpdateError('Bir hata oluştu. Lütfen tekrar deneyin.');
    setWarning(true);
  }
}

//DELETE
const handleDelete = (id) => {
  deleteVaccine(id).then(() => {
      setReload(true);
  })
  .catch((error) => {
    setDeleteError("Bir hata oluştu, tekrar deneyiniz!")
    setWarning(true)
  });

}

  return (
    <>
 
    <div className="vaccine-page">
      <h1>AŞI YÖNETİMİ</h1>
      <h2>Aşı Listesi</h2>
      <div className="error-message">  
        {readError && <ErrorModal error={readError} />}
      </div>      
    <div className="vaccine-filters">
    <h4>→ Filtreleme İşlemleri</h4>
      <div className="animalName-filter">
        <label>
          <input
          type="radio"
          value="animal"
          checked={selectedOption === 'animal'}
          onChange={(e) => setSelectedOption(e.target.value)}
          />
          Hayvan Adı
        </label>
        {selectedOption === 'animal' && (
          <>
            <input
              type="text"
              placeholder="Filtreleme"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />

          </>
        )}
      </div>
      <div className="vaccineDate-filter">
        <label>   
        <input
          type="radio"
          value="willExpiredVaccine"
          checked={selectedOption === 'willExpiredVaccine'}
          onChange={(e) => setSelectedOption(e.target.value)}
        />
        Aşı Tarihi
        </label>
          {selectedOption === 'willExpiredVaccine' && (
            <>
              <label>
                Aşı Başlangıç Tarihi
                <input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                />
              </label>
              <label>
                Aşı Bitiş Tarihi
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
          <TableHead className='vaccine-table-head'>
            <TableRow>
          
              <TableCell>Aşı Adı</TableCell>
              <TableCell>Aşı Kodu</TableCell>
              <TableCell>Aşı Başlangıç Tarihi</TableCell>
              <TableCell>Aşı Bitiş Tarihi</TableCell>
              <TableCell>Hayvan Adı</TableCell>
              <TableCell>Müşteri Adı</TableCell>
              <TableCell>Rapor No</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className='vaccine-table-body'>
            {(filteredVaccines.length > 0 ? filteredVaccines : vaccines).map((vaccine) => (
              <TableRow key={vaccine.id}>
           
                <TableCell>{vaccine.name}</TableCell>
                <TableCell>{vaccine.code}</TableCell>
                <TableCell>{vaccine.protectionStartDate}</TableCell>
                <TableCell>{vaccine.protectionFinishDate}</TableCell>
                <TableCell>{vaccine?.animal?.name}</TableCell>
                <TableCell>{vaccine?.animal?.customer?.name}</TableCell>
                <TableCell>{vaccine?.report?.id}</TableCell>
            
                <TableCell>
                  {<DeleteIcon onClick={() => handleDelete(vaccine.id)} />}
                  {<UpdateIcon onClick={() => {handleUpdateBtn(vaccine) }} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>
      <div className="error-message">
        {deleteError && <ErrorModal error={DeleteError} />}
      </div>
      <h2><span>Yeni Aşı Ekle</span> </h2>
      <div className="vaccine-create">
                
                <input type="text"
                    placeholder='Aşı Adı'
                    name='name'
                    value={newVaccine.name}
                    onChange={handleNewVaccine}
                />
                <input type="text"
                    placeholder='Aşı Kodu'
                    name='code'
                    value={newVaccine.code}
                    onChange={handleNewVaccine}
                />

                <input type="date"
                    placeholder='Aşı Başlangıç Tarihi'
                    name='protectionStartDate'
                    value={newVaccine.protectionStartDate}
                    onChange={handleNewVaccine}
                />

                <input type="date"
                    placeholder='Aşı Bitiş Tarihi'
                    name='protectionFinishDate'
                    value={newVaccine.protectionFinishDate}
                    onChange={handleNewVaccine}
                />
              
                <select id='selectCreateAnimal' name='animal'
                    value={newVaccine?.animal?.id}
                    onChange={handleAnimalCreateChange}>

                    <option value="" disabled selected>Hayvan Seçiniz</option>
                    {animals.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                            {animal.name}
                        </option>
                    ))}
                </select>

                <select id='selectCreateReport' name='report'
                    value={newVaccine?.report?.id}
                    onChange={handleNewVaccine}>

                    <option value=""  selected>Rapor No</option>
                    {reports.map((report) => (
                        <option key={report.id} value={report.id}>
                            {report.id}
                        </option>
                    ))}
                </select>

                <button onClick={handleCreate}>Kaydet</button>
            </div>
            <div className="error-message">
              {createError && <ErrorModal error={createError} />}
            </div>

            <h2><span>Aşı Bilgilerini Güncelle</span></h2>
            <div className="vaccine-update">
            

            <input type="text"
                    placeholder='Aşı Adı'
                    name='name'
                    value={updateVaccine.name}
                    onChange={handleUpdateChange}
                />
                <input type="text"
                    placeholder='Aşı Kodu'
                    name='code'
                    value={updateVaccine.code}
                    onChange={handleUpdateChange}
                />

                <input type="date"
                    placeholder='Aşı Başlangıç Tarihi'
                    name='protectionStartDate'
                    value={updateVaccine.protectionStartDate}
                    onChange={handleUpdateChange}
                />

                <input type="date"
                    placeholder='Aşı Bitiş Tarihi'
                    name='protectionFinishDate'
                    value={updateVaccine.protectionFinishDate}
                    onChange={handleUpdateChange}
                />
              
                <select id='selectUpdateAnimal' name='animal'
                    value={updateVaccine?.animal?.id}
                    onChange={handleAnimalUpdateChange}>

                    <option value="" disabled selected>Hayvan Seçiniz</option>
                    {animals.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                            {animal.name}
                        </option>
                    ))}
                </select>

                <select id='selectUpdateReport' name='report'
                    value={updateVaccine?.report?.id}
                    onChange={handleUpdateChange}>

                    <option value=""  selected>Rapor No</option>
                    {reports.map((report) => (
                        <option key={report.id} value={report.id}>
                            {report.id}
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


export default Vaccine
