export default function state() {
    return {
      empInfor: {
        ID: "",
        FirstName: "",
        LastName: "",
        BirthDay: "",
        EmpName:"",
        Email: "",
        Password: "",
        Phone: "",
        TimeLogin: "",
        Avatar: ""
        
      },
      curi18n: {
        curElLang: "", // current Lang i18n for Element plus
        curLang: "", //current lang i18n for system
      },
      isLoading: false,  // show loading icon full screen when call api
      installPrompt: null,  // PWA install prompt
      isIOS: false,  // iOS device
      isAndroid: false,  // Android device
      canInstall: false,  // Can install app
      curri18n: null,//  current $t for i18n
      image: "",
      Avatar: "",
      lastActive: Date.now()
      
  
    }
  }