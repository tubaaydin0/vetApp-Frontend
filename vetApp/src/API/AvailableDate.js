import axios from 'axios';


//CREATE
export const createAvailableDate  = async (availableDate) => {
    const { data } = await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "/v1/availableDate", availableDate);
    return data;

}


//READ
export const getAvailableDate = async () => {
    const { data } = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/v1/availableDate")
    return data;
}

//FILTER
export const getAvailableDateByDoctorId = async (doctorId) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/availableDate/doctor/${doctorId}`)
    return data;
}

//UPDATE
export const updateAvailableDates = async (availableDate) => {

    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/availableDate/${availableDate.id}`, availableDate)
    return data;

}

//DELETE
export const deleteAvailableDate  = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/availableDate/${id}`)
    return data;
}