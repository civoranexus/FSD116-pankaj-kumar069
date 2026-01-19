import API from "./api";

const getSeeds = async () => {
  const response = await API.get("/inventory");
  return response.data;
};

const getSeedDetails = async (id) => {
  const response = await API.get(`/inventory/${id}`);
  return response.data;
};

export { getSeeds, getSeedDetails };
