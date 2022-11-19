const JoinMeetingAlert = forwardRef(({}, ref) => {
  const alertRef = useRef();

  useImperativeHandle(ref, () => ({
    showAlert() {
      alertRef.current.showAlert();
    },
  }));

  return <Alert ref={alertRef}></Alert>;
});

export default JoinMeetingAlert;
