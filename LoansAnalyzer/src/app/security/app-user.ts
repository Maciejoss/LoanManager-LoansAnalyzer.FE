import {UserBase} from "../shared/security/user-base";

export class AppUser extends UserBase{
  name: string = '';
  email: string = '';
}
