import axios from 'axios';


//CREATE
export const createDoctor = async (doctor) => {
    const { data } = await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "/v1/doctor", doctor);
    return data;

}


//READ
export const getDoctor = async () => {
    const { data } = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/v1/doctor")
    return data;
}

//FILTER


//UPDATE
export const updateDoctors = async (doctor) => {

    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/doctor/${doctor.id}`, doctor)
    return data;

}

//DELETE
export const deleteDoctor = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/doctor/${id}`)
    return data;
}