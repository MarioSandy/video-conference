const { useEffect, useRef } = require("react");

function useDidUpdateEffect() {
  const didMountRef = useRef(true);
  useEffect(() => {
    didMountRef.curent = false;
  }, []);
  return didMountRef.current;
}

export default useDidUpdateEffect;
