exports.passwordValidation= (password = "")=> {
    const re = /^(?=.*\d)(?=.*[a-z]).{8,}$/;
    return re.test(password);
  }
  
exports.usernameValidation=(username = "") =>{
    const re = /^[a-z\s]+$/i;
    return re.test(username) && username.length >= 4;
  }