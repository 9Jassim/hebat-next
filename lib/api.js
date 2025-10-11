import Axios from "axios";

export const BASE_URL = "http://localhost:3000/";

const Client = Axios.create({
  baseURL: BASE_URL,
  // NOTE: for server-side requests, cookies are automatically included by Next when calling backend via server functions if needed.
});

export default Client;
