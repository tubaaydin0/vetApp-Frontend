import axios from 'axios';


//CREATE
export const createAnimal  = async (animal) => {
    const { data } = await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "/v1/animal", animal);
    return data;

}


//READ
export const getAnimal = async () => {
    const { data } = await axios.get(
        import.meta.env.VITE_APP_BASE_URL + "/v1/animal")
    return data;
}

//FILTER
export const getAnimalNameFilter = async (name) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/animal?name=${name}`)
    return data;
}

export const getAnimalCustomerNameFilter = async (name) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/animal/customer?name=${name}`)
    return data;
}

//UPDATE
export const updateAnimals = async (animal) => {

    const { data } = await axios.put(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/animal/${animal.id}`, animal)
    return data;

}

//DELETE
export const deleteAnimal  = async (id) => {
    const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_BASE_URL}/v1/animal/${id}`)
    return data;
}