const mutations =
{
    setEmpInfor(state, NewEmpInfor) {
        state.empInfor = NewEmpInfor
    } ,
    LOGOUT(state) {
        state.empInfor = null;
        localStorage.removeItem("empInfor");
        localStorage.removeItem("token")
    },
    imageThumbnail(state,newimage){
        state.image = newimage
    },
    UPDATE_ACTIVE_TIME(state) {
        state.lastActive = Date.now()
      }
   
}
export default mutations
