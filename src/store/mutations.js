const mutations =
{
    setEmpInfor(state, NewEmpInfor) {
        state.empInfor = NewEmpInfor
    } ,
    LOGOUT(state) {
        state.empInfor = null;
        localStorage.removeItem("empInfor");
    }
   
}
export default mutations
