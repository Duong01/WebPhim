const mutations =
{
    setEmpInfor(state, NewEmpInfor) {
        state.empInfor = NewEmpInfor
    } ,
    LOGOUT(state) {
        state.empInfor = null;
        localStorage.removeItem("empInfor");
        localStorage.removeItem("token")
        localStorage.removeItem("favoriteMovies");
        localStorage.removeItem("user");
        localStorage.removeItem("name");
        localStorage.removeItem("nameShow");
    },
    setAvatar(state, avar){
        state.Avatar = avar
    },
    imageThumbnail(state,newimage){
        state.image = newimage
    },
    UPDATE_ACTIVE_TIME(state) {
        state.lastActive = Date.now()
      },
    setInstallPrompt(state, prompt) {
        state.installPrompt = prompt
    },
    setIOS(state, value) {
        state.isIOS = value
    },
    setAndroid(state, value) {
        state.isAndroid = value
    },
    setCanInstall(state, value) {
        state.canInstall = value
    }
   
}
export default mutations
