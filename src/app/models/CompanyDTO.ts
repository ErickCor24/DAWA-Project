import { Company } from "./company";
import { UserCompany } from "./UserCompany";

export interface CompanyDTO {
  isSucces: boolean,
  result: Company | Company [] | UserCompany | String
}