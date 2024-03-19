import axios from 'axios';


//CREATE
export const createCustomer = async (customer) => {
    const { data } = await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "/v1/customer", customer);
    return data;

}


//READ
export const getCustomer = async () => {
    const { data } = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/v1/customer")
    return data;
}

//FILTER

export const getCustomerNameFilter = async (name) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/customer?name=${name}`)
    return data;
}

//UPDATE
export const updateCustomers = async (customer) => {

    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/customer/${customer.id}`, customer)
    return data;

}

//DELETE
export const deleteCustomer = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/customer/${id}`)
    return data;
}