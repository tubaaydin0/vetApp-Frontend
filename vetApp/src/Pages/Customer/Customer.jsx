import React, { useEffect, useState } from 'react'
import './Customer.css'
import { getCustomer,getCustomerNameFilter,createCustomer, updateCustomers
, deleteCustomer} from '../../API/Customer'
import DeleteIcon from '@mui/icons-material/Delete'; // material icon ekleme
import UpdateIcon from '@mui/icons-material/Update';
import ErrorModal from '../ErrorModal/ErrorModal';

import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Paper from '@mui/material/Paper';

function Customer() {
  const [customers, setCustomers]=useState([]);
  const [reload, setReload]=useState(true);
  const [filterText, setFilterText] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    mail: "",
    address: "",
    city:"",
    phone:""

})
const [updateCustomer, setUpdateCustomer] = useState({
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
    getCustomer().then((data)=>{
      setCustomers(data);
      //console.log(data)
    })
    .catch((error) => {
      setReadError("Müşteri verileri alınamadı. Lütfen daha sonra tekrar deneyiniz.")
      setWarning(true)
    });
    
    setReload(false);
  }, [reload]);

//FILTER
useEffect(() => {
  getCustomerNameFilter(filterText).then((data) => {
    setCustomers(data);
  });
}, [filteredCustomers]);

const handleFilter = () => {
  getCustomerNameFilter(filterText).then((data) => {
    setFilteredCustomers(data);
  });
};

const handleResetFilter = () => {
  setFilterText('');
  setFilteredCustomers([]);
};



//DELETE
  const handleDelete = (id) => {
    deleteCustomer(id).then(() => {
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
const handleNewCustomer = (event) => {
  setNewCustomer({
      ...newCustomer,
      [event.target.name]: event.target.value
  })

}

const handleCreate = () => {
  if (customers.some(customer => customer.mail ===newCustomer.mail || customer.phone===newCustomer.phone)) {
    setCreateError('Sistemde aynı mail ve telefona sahip doktor kayıtlıdır!');
    setWarning(true)
    return;
  }

  if (!newCustomer.name) {
    setCreateError('Müşteri ismi boş bırakılamaz!');
    setWarning(true)
      return;
  }
  if (!newCustomer.mail || !validateEmail(newCustomer.mail)) {
    setCreateError('Mail alanı boş bırakılamaz! / Mail adresinizi formata uygun yazınız.');
    setWarning(true)
     return;
 }
  if (!newCustomer.phone) {
     setCreateError('Telefon alanı boş bırakılamaz');
     setWarning(true)
      return;
  }

  createCustomer(newCustomer).then(() => {
    setReload(true);
    setNewCustomer(
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
   
    setCreateError('Bir hata oluştu. Lütfen tekrar deneyin.');
    setWarning(true)
  
  });
}


//UPDATE

const handleUpdateBtn = (cus) => {
    setUpdateCustomer(cus)
}

const handleUpdateChange = (event) => {
  setUpdateCustomer(
    {
      ...updateCustomer,
      [event.target.name]: event.target.value

    }
  )
}

const handleUpdate = () => {

  if (!updateCustomer.name) {
    setUpdateError('Müşteri ismi boş bırakılamaz!');
    setWarning(true)
      return;
  }

  if (!updateCustomer.phone) {
    setUpdateError('Telefon alanı boş bırakılamaz');
    setWarning(true)
    return;
  }

  if (!updateCustomer.mail || !validateEmail(updateCustomer.mail)) {
    setUpdateError('Mail alanı boş bırakılamaz! / Mail adresinizi formata uygun yazınız.');
    setWarning(true)
      return;
  }

  updateCustomers(updateCustomer).then(() => {
    setReload(true);
    setUpdateCustomer(
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
        setUpdateError('Aynı mail veya telefon numarasına sahip başka bir müşteri kayıtlı!');
        setWarning(true)
      } else {
        setUpdateError('Bir hata oluştu. Lütfen tekrar deneyin.');
        setWarning(true)
    }
  }); 
}


  
  return (
    <>
    <div className="customer-page">
      <h1>MÜŞTERİ YÖNETİMİ</h1>
      <h2>Müşteri Listesi</h2>
      <div className="error-message">  
        {readError && <ErrorModal error={readError} />}
      </div>      
      <div className="customer-filters">
      <h4>→ Filtreleme İşlemleri</h4>
        <div className="customerName-filter">
          <input
            type="text"
            placeholder="Müşteri Adıyla Filtrele"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button onClick={handleFilter}>Filtrele</button>
          <button onClick={handleResetFilter}>Filtreyi Sıfırla</button>
        </div>
    
      </div>

     <TableContainer component={Paper}>
  
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className='customer-table-head'>
          <TableRow>
            <TableCell>Müşteri Adı</TableCell>
            <TableCell>Müşteri Mail</TableCell>
            <TableCell>Müşteri Adres</TableCell>
            <TableCell>Müşteri Yaşadığı Şehir</TableCell>
            <TableCell>Müşteri Telefon</TableCell>
            <TableCell>İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody className='customer-table-body'>
          {(filteredCustomers.length > 0 ? filteredCustomers : customers).map((customer) => (
            <TableRow key={customer.id}>
           
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.mail}</TableCell>
              <TableCell>{customer.address}</TableCell>
              <TableCell>{customer.city}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>
                {<DeleteIcon onClick={() => handleDelete(customer.id)} />}
                {<UpdateIcon onClick={() => {handleUpdateBtn(customer) }} />}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
     </Table>
  
    </TableContainer>
    <div className="error-message">
      {deleteError && <ErrorModal error={DeleteError} />}
    </div>

      <h2><span>Müşteri Ekle</span> </h2>
      <div className="customer-create">
       
          <input type="text"
            placeholder='Müşteri Adı'
            name='name'
            value={newCustomer.name}
            onChange={handleNewCustomer}
          />

          <input type="email"
            placeholder='Müşteri Email'
            name='mail'
            value={newCustomer.mail}
            onChange={handleNewCustomer}
          />

          <input type="text"
            placeholder='Müşteri Adres'
            name='address'
            value={newCustomer.address}
            onChange={handleNewCustomer}
          />

          <input type="text"
            placeholder='Müşteri Yaşadığı Şehir'
            name='city'
            value={newCustomer.city}
            onChange={handleNewCustomer}
          />

          <input type="tel"
            placeholder='Müşteri Telefon'
            name='phone'
            value={newCustomer.phone}
            onChange={handleNewCustomer}
          />

          <button onClick={handleCreate}>Kaydet</button>
        </div>
        <div className="error-message">
          {createError && <ErrorModal error={createError} />}
        </div>
        <h2><span>Müşteri Bilgilerini Güncelle</span></h2>
        <div className="customer-update">
         
          <input type="text"
              placeholder='Müşteri Adı'
              name='name'
              value={updateCustomer.name}
              onChange={handleUpdateChange}
            />

            <input type="email"
              placeholder='Müşteri Email'
              name='mail'
              value={updateCustomer.mail}
              onChange={handleUpdateChange}
            />

            <input type="text"
              placeholder='Müşteri Adres'
              name='address'
              value={updateCustomer.address}
              onChange={handleUpdateChange}
            />

            <input type="text"
              placeholder='Müşteri Yaşadığı Şehir'
              name='city'
              value={updateCustomer.city}
              onChange={handleUpdateChange}
            />

            <input type="tel"
              placeholder='Müşteri Telefon'
              name='phone'
              value={updateCustomer.phone}
              onChange={handleUpdateChange}
            />

            <button onClick={handleUpdate}>Güncelle</button>
            
        </div>
        <div className="error-message">
          {updateError && <ErrorModal error={updateError} />}
        </div>
    </div>
    </>
  )
}

export default Customer
