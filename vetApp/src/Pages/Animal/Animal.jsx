import React, { useEffect, useState } from 'react'
import './Animal.css'
import { getAnimal,createAnimal,updateAnimals,deleteAnimal,getAnimalNameFilter,getAnimalCustomerNameFilter } from '../../API/Animal';
import {getCustomer } from '../../API/Customer'

import DeleteIcon from '@mui/icons-material/Delete'; 
import UpdateIcon from '@mui/icons-material/Update';

import ErrorModal from '../ErrorModal/ErrorModal';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Paper from '@mui/material/Paper';

//Animal Hataları kontrol et .
function Animal() {
  const [animals, setAnimals]=useState([]);
  const [reload, setReload]=useState(true);
  const [customers, setCustomers]=useState([]);
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    gender:"",
    colour:"",
    dateOfBirth:"",
 
  })
  const [updateAnimal, setUpdateAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    gender:"",
    colour:"",
    dateOfBirth:"",
  })

  const [filterText, setFilterText] = useState('');
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [createError, setCreateError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [readError, setReadError] = useState(null);
  const [warning, setWarning] = useState(false);
  //READ
  useEffect(()=>{
    getAnimal().then((data)=>{
      setAnimals(data);
      //console.log(data)
    })
    .catch((error) => {
      setReadError("Hayvan verileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
     });
    getCustomer().then((data) => {
      setCustomers(data);
      
  })
  .catch((error) => {
    setReadError("Müşteri verileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
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

  const handleNewAnimal = (e) => {

    if (e.target.name === "customer") {
        return setNewAnimal({
            ...newAnimal,
            customer: {
                id: e.target.value

            }
        })
    } else {
        setNewAnimal({
            ...newAnimal,
            [e.target.name]: e.target.value,
        })
    }
    //console.log(newAnimal)
};

  const handleCreate = () => {
    if (!newAnimal.name) {
      setCreateError('Hayvan ismi boş bırakılamaz!');
      setWarning(true)
        return;
    }

    const today = new Date();
    const selectedDate = new Date(newAnimal.dateOfBirth);

    // Zaman bileşenlerini (saat, dakika, saniye) 00:00:00 olarak ayarla
    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
       setCreateError('Doğum tarihi bugünden ileri bir tarih olamaz!');
       setWarning(true)
        return;
    }
    if (!newAnimal?.customer?.id) {
       setCreateError('Müşteri ismi boş bırakılamaz!');
       setWarning(true)
        return;
    }

    createAnimal(newAnimal)
        .then(() => {
            setReload(true);
            setNewAnimal({
                name: "",
                species: "",
                breed: "",
                gender: "",
                colour: "",
                dateOfBirth: ""
            });
           setCreateError(null); // Hata olmadığında error state'ini sıfırla
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            setCreateError('Aynı bilgiler tekrar kaydedilemez!');
            setWarning(true)
          } else {
            setCreateError('Bir hata oluştu. Lütfen tekrar deneyin.');
            setWarning(true)
        }
        });
};




//FILTER

useEffect(() => {
  if (selectedOption === 'animal') {
  getAnimalNameFilter(filterText).then((data) => {
    setAnimals(data);
  });
  }
  if(selectedOption==="customer"){
  getAnimalCustomerNameFilter(filterText).then((data)=>{
    setAnimals(data)
  })
}
}, [filteredAnimals]);

const handleFilter = () => {
  if (selectedOption === 'animal') {
    getAnimalNameFilter(filterText).then((data) => {
      setFilteredAnimals(data);
    });
  }
  if(selectedOption==="customer"){
    getAnimalCustomerNameFilter(filterText).then((data) => {
      setFilteredAnimals(data);
    });
  }
};

const handleResetFilter = () => {
  setFilterText('')
  setFilteredAnimals([]);
};

 //UPDATE
  

const handleUpdateBtn = (an) => {
  
  setUpdateAnimal(an);
  
}

const handleUpdateChange = (event) => {
  if (event.target.name === "customer") {
      return setUpdateAnimal({
          ...updateAnimal,
          customer: {
              id: event.target.value

          }
      });
  } else {
      setUpdateAnimal(
          {
          ...updateAnimal,
          [event.target.name]: event.target.value

          }
      )
  }
}

const handleUpdate = () => {
  if (!updateAnimal.name) {
      setUpdateError('Hayvan ismi boş olamaz!');
      setWarning(true)
      return;
  }
  const today = new Date();
  const selectedDate = new Date(updateAnimal.dateOfBirth);

  today.setHours(0, 0, 0, 0);

  if (selectedDate >= today) {
     setUpdateError('Doğum tarihi bugünden ileri bir tarih olamaz!');
     setWarning(true)
      return;
  }
  if (!updateAnimal?.customer?.id) {
    setUpdateError('Müşteri ismi boş bırakılamaz!');
    setWarning(true)
     return;
 }
  updateAnimals(updateAnimal)
      .then(() => {
          setReload(true);
          setUpdateAnimal({
              name: "",
              species: "",
              breed: "",
              gender: "",
              colour: "",
              dateOfBirth: ""
          });
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          setUpdateError('Aynı bilgiler tekrar kaydedilemez!');
          setWarning(true)
        } else {
          setUpdateError('Bir hata oluştu. Lütfen tekrar deneyin.');
          setWarning(true)
      }
      });
};


//DELETE
const handleDelete = (id) => {
  deleteAnimal(id).then(() => {
      setReload(true);
  })
  .catch((error) => {
    setDeleteError("Bir hata oluştu, tekrar deneyiniz!")
    setWarning(true)
  });

}

  return (
    <>
  <div className="animal-page">
    <h1>HAYVAN YÖNETİMİ</h1>
    <h2>Hayvan Listesi</h2>
    <div className="error-message">  
      {readError && <ErrorModal error={readError} />}
    </div>

    <div className="animal-filters">
      <h4>→ Filtreleme İşlemleri</h4>
      <div className="filter-input">
      <input
            type="text"
            placeholder="Filtreleme"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
      </div>
      <div className="all-filters">
        <div className="animalName-filter">
          <label>
            <input
              type="radio"
              value="animal"
              checked={selectedOption === 'animal'}
              onChange={(e) => setSelectedOption('animal')}
            />
            Hayvan Adı
          </label>
        </div>

        <div className="customerName-filter"><label>
            <input
              type="radio"
              value="customer"
              checked={selectedOption === 'customer'}
              onChange={() => setSelectedOption('customer')}
            />
              Müşteri Adı
            </label>
            
        </div>
      </div>  
        <div className="filter-buttons">
          <button onClick={handleFilter}>Filtrele</button>
          <button onClick={handleResetFilter}>Filtreyi Sıfırla</button>
        </div>
    </div>

    <TableContainer component={Paper}>
 
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className='animal-table-head'>
          <TableRow>
            
            <TableCell>Hayvan Adı</TableCell>
            <TableCell>Hayvan Tür</TableCell>
            <TableCell>Hayvan Cins</TableCell>
            <TableCell>Hayvan Cinsiyet</TableCell>
            <TableCell>Hayvan Renk</TableCell>
            <TableCell>Hayvan Doğum Tarih</TableCell>
            <TableCell>Müşteri Adı</TableCell>
            <TableCell>Müşteri Mail</TableCell>
            <TableCell>Müşteri Adres</TableCell>
            <TableCell>Müşteri Telefon</TableCell>
            <TableCell>İşlemler</TableCell>
          </TableRow>
        </TableHead>

        <TableBody className='animal-table-body'>
          {animals.map((animal) => (
            <TableRow key={animal.id}>
            
              <TableCell>{animal.name}</TableCell>
              <TableCell>{animal.species}</TableCell>
              <TableCell>{animal.breed}</TableCell>
              <TableCell>{animal.gender}</TableCell>
              <TableCell>{animal.colour}</TableCell>
              <TableCell>{animal.dateOfBirth}</TableCell>
              <TableCell>{animal?.customer?.name}</TableCell>
              <TableCell>{animal?.customer?.mail}</TableCell>
              <TableCell>{animal?.customer?.address}</TableCell>
              <TableCell>{animal?.customer?.phone}</TableCell>
              <TableCell>
                <DeleteIcon onClick={() => handleDelete(animal.id)} />
                <UpdateIcon onClick={() => handleUpdateBtn(animal)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    
    </TableContainer>
    <div className="error-message">
      {deleteError && <ErrorModal error={DeleteError} />}
    </div>



    <h2><span>Yeni Hayvan Ekle</span> </h2>
    <div className="animal-create">
        
        <input type="text"
          placeholder='İsim'
          name='name'
          value={newAnimal.name}
          onChange={handleNewAnimal}
        />

        <input type="text"
          placeholder='Tür'
          name='species'
          value={newAnimal.species}
          onChange={handleNewAnimal}
        />

        <input type="text"
          placeholder='Cins'
          name='breed'
          value={newAnimal.breed}
          onChange={handleNewAnimal}
        />

        <input type="text"
          placeholder='Cinsiyet'
          name='gender'
          value={newAnimal.gender}
          onChange={handleNewAnimal}
        />

        <input type="text"
          placeholder='Renk'
          name='colour'
          value={newAnimal.colour}
          onChange={handleNewAnimal}
        />

        <input type="date"
          placeholder='Doğum Tarihi'
          name='dateOfBirth'
          value={newAnimal.dateOfBirth}
          onChange={handleNewAnimal}
        />


              
        <select name='customer'
          value={newAnimal?.customer?.id}
          onChange={handleNewAnimal}>

          <option value="" disabled selected>Müşteri Seçiniz</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>

        <button onClick={handleCreate}>create</button>
       
    </div>
    <div className="error-message">
      {createError && <ErrorModal error={createError} />}
    </div>

    <h2><span>Hayvan Bilgilerini Güncelle</span></h2>
    <div className="animal-update">
        
          <input type="text"
            placeholder='İsim'
            name='name'
            value={updateAnimal.name}
            onChange={handleUpdateChange}
          />

          <input type="text"
            placeholder='Tür'
            name='species'
            value={updateAnimal.species}
            onChange={handleUpdateChange}
          />

          <input type="text"
            placeholder='Cins'
            name='breed'
            value={updateAnimal.breed}
            onChange={handleUpdateChange}
          />

          <input type="text"
            placeholder='Cinsiyet'
            name='gender'
            value={updateAnimal.gender}
            onChange={handleUpdateChange}
          />

          <input type="text"
            placeholder='Renk'
            name='colour'
            value={updateAnimal.colour}
            onChange={handleUpdateChange}
          />

          <input type="date"
            placeholder='Doğum Tarihi'
            name='dateOfBirth'
            value={updateAnimal.dateOfBirth}
            onChange={handleUpdateChange}
          />
              
          <select name='customer'
            value={updateAnimal?.customer?.id}
            onChange={handleUpdateChange}>

            <option value="" disabled selected>Doktor Adı</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
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

export default Animal
