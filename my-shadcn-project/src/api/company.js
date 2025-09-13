import API from "./AxiosInstance";
import { getUserDetails } from "./auth";

export const getCompanyProfileDetails = () =>
  API.get("/api/company/companyprofile");

export const CompanyProfilelist = () => API.get("/api/company/company-profile");

export const Companylist = () => API.get("/api/company/company");

export const getBranchList = () => API.get("/api/company/branch");

export const postBranch = (formdata) =>
  API.post("/api/company/branch/", formdata);

export const patchBranch = (id, formData) =>
  API.patch(`/api/company/branch/${id}/`, formData);

export const getBranch = (id) => API.get(`/api/company/branch/${id}/`);

export const Departmentlist = () => API.get("/api/company/role");

export const Rolelist = () => API.get("/api/company/department");

export const UserDetails = () => API.get("/api/accounts/user");

export const CompanyDetails = (id = none) =>
  API.get("/api/company/company", { id });

export const BranchDetails = (id = none) =>
  API.get("/api/company/branch", { id });

export const DepartmentDetails = (id = none) =>
  API.get("/api/company/department", { id });

export const RoleDetails = (id = none) => API.get("/api/company/role", { id });
