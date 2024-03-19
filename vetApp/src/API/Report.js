import axios from 'axios';


//CREATE
export const createReport  = async (report) => {
    const { data } = await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "/v1/report", report);
    return data;

}


//READ
export const getReport = async () => {
    const { data } = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/v1/report")
    return data;
}

//FILTER

export const getReportsByAnimalId = async (animalId) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/report/animal?animalId=${animalId}`)
    return data;
}

//UPDATE
export const updateReports= async (report) => {

    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/report/${report.id}`, report)
    return data;

}

//DELETE
export const deleteReport = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/report/${id}`)
    return data;
}