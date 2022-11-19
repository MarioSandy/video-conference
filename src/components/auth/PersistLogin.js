import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import useDidUpdateEffect from "../../hooks/useDidUpdateEffect";
import { SyncLoader } from "react-spinners";

const PersistLogin = () => {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();
  const isMount = useDidUpdateEffect();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMount && setLoading(false);
      }
    };
    !auth?.access_token ? verifyRefreshToken() : setLoading(false);
  }, []);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : loading ? (
        <div className="flex h-screen justify-center items-center">
          <SyncLoader color="gray" />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
