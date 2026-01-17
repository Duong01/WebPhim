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
    }
   
}
export default mutations
