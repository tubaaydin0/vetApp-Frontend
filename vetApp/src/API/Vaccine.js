import axios from 'axios';


//CREATE
export const createVaccine  = async (vaccine) => {
    const { data } = await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "/v1/vaccine", vaccine);
    return data;

}


//READ
export const getVaccine = async () => {
    const { data } = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/v1/vaccine")
    return data;
}

//FILTER
export const getAnimalNameFilter = async (name) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/animal?name=${name}`)
    return data;
}

export const getAnimalByWillExpire = async (protectionStartDate, protectionEndDate) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/animal/vaccinesWillExpire?protectionStartDate=${protectionStartDate}&protectionEndDate=${protectionEndDate}`);
    return data;
}


//UPDATE
export const updateVaccines = async (vaccine) => {

    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/${vaccine.id}`, vaccine)
    return data;

}

//DELETE
export const deleteVaccine  = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/vaccine/${id}`)
    return data;
}