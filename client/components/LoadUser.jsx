import { useEffect } from "react";
import API from "../src/utiles/axiosConfigaxios";
import { resetLogin, setUser } from "../src/features/auth/authslice";
import { useDispatch } from "react-redux";

const LoadUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await API.get("/auth/getuser");
        dispatch(setUser(res.data.user));
      } catch (error) {
        dispatch(resetLogin());
      }
    };

    loadUser();
  }, [dispatch]);

  return null;
};

export default LoadUser;
