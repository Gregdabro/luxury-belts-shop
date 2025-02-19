class UserDto {
    constructor(user) {
      this.id = user._id;
      this.email = user.email;
      this.role = user.role;
    }
  }
  
  export default UserDto;
  