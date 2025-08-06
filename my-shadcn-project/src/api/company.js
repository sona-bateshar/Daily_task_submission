import API from './AxiosInstance';

export const CompanyProfilelist = () =>
  API.get('/api/company/company-profile');

export const Companylist = () => 
  API.get('/api/company/company');

export const Branchlist = () => 
  API.get('/api/company/branch');

export const Departmentlist = () => 
  API.get('/api/company/role');

export const Rolelist = () => 
  API.get('/api/company/department');

export const UserDetails = () =>
  API.get('/api/accounts/user');

export const CompanyProfileDetails = (id = none) => 
  API.get('/api/company/company-profile', { id });

export const CompanyDetails = (id = none) => 
  API.get('/api/company/company', { id });

export const BranchDetails = (id = none) => 
  API.get('/api/company/branch', { id });

export const DepartmentDetails = (id = none) => 
  API.get('/api/company/department', { id });

export const RoleDetails = (id = none) => 
  API.get('/api/company/role', { id });