
import API from "../../utiles/axiosConfigaxios";
const searchUsersService=  async(query, role) => {
  const res = await API.get(`/search/searchUser/search?role=${role}${query ? `&query=${encodeURIComponent(query)}` : ""}`);
  return res;
  
}

const serachService = {
  searchUsersService
}
export default serachService;
 