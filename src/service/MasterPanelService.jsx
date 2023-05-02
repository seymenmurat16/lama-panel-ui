import axios from "axios";
import { getSession } from "../libs/cognito";

const BASE_URL = "http://localhost:8080/v1";


class MasterPanelService {


  getTransactions = async () => {
    try {
      const session = await getSession();
      const response = await axios.get(BASE_URL + '/transactions', {
        headers: {
          'Authorization': `Bearer ${session.accessToken.jwtToken}`
        }
      });
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  takeTransaction = async (id, request) => {
    try {
      const session = await getSession();
      const response = await axios.put(BASE_URL + '/transactions/taken/' + id, request, {
        headers: {
          'Authorization': `Bearer ${session.accessToken.jwtToken}`
        }
      });
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  doneTransaction = async (id, request) => {
    try {
      const session = await getSession();
      const response = await axios.put(BASE_URL + '/transactions/done/' + id, request, {
        headers: {
          'Authorization': `Bearer ${session.accessToken.jwtToken}`
        }
      });
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  }


  rejectTransaction = async (id, request) => {
    try {
      const session = await getSession();
      const response = await axios.put(BASE_URL + '/transactions/reject/' + id, request, {
        headers: {
          'Authorization': `Bearer ${session.accessToken.jwtToken}`
        }
      });
      console.log(response.data);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new MasterPanelService();