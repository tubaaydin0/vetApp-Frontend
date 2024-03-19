import axios from 'axios';


//CREATE
export const createAppointment  = async (appointment) => {
    const { data } = await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "/v1/appointment", appointment);
    return data;

}


//READ
export const getAppointment = async () => {
    const { data } = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/v1/appointment")
    return data;
}

//FILTER
export const getForDateAndDoctor = async (doctorId,startDate,endDate) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/filter/doctor?doctorId=${doctorId}&startDate=${startDate}&endDate=${endDate}`);
    return data;
}
export const getForDateAndAnimal = async (animalId,startDate,endDate) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/filter/animal?animalId=${animalId}&startDate=${startDate}&endDate=${endDate}`);
    return data;
}

//UPDATE
export const updateAppointments = async (appointment) => {

    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/${appointment.id}`, appointment)
    return data;

}

//DELETE
export const deleteAppointment  = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/appointment/${id}`)
    return data;
}