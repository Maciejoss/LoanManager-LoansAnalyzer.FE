import {JobDetails} from "./jobDetails";
import {GovernmentDocument} from "./governmentDocument";

export class UserInfo {
  constructor(public ub: string, //unique userID
              public Email: string|null,
              public Name: string|null,
              public SurName: string|null,
              public BirthDate: string|null,
              public JobDetails: JobDetails,
              public GovernmentDocument: GovernmentDocument){
  }
}
