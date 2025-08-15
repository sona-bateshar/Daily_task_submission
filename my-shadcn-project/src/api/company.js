import API from './AxiosInstance';
import {getUserDetails} from './auth';



export const CompanyProfilelist = () =>
  API.get('/api/company/company-profile');

export const Companylist = () => 
  API.get('/api/company/company');

export const getBranchList = () => 
  API.get('/api/company/branch');

export const postBranch = (formdata) => 
  API.post('/api/company/branch/', formdata)

export const patchBranch = (id, formData) => 
  API.patch(`/api/company/branch/${id}/`, formData);


export const getBranch = ( id) => 
  API.get(`/api/company/branch/${id}/`)
  

export const Departmentlist = () => 
  API.get('/api/company/role');

export const Rolelist = () => 
  API.get('/api/company/department');

export const UserDetails = () =>
  API.get('/api/accounts/user');

export async function getCompanyProfileDetails (id) {
    if (!id) {
        try {
            const user_details = await getUserDetails();

            console.log("User details fetched successfully:", user_details.data);

            document.getElementById('username').textContent = user_details.data.username;

        } catch (error) {
            // If the promise is rejected (e.g., API returns an error)
            // this catch block will handle it
            console.error("Failed to fetch user details:", error);
        }

        console.error("ID is required to fetch company profile details.");
        return Promise.reject(new Error("ID is required."));
    }
    
    return API.get(`/api/company/company-profile/${id}/`);
};

export const CompanyDetails = (id = none) => 
  API.get('/api/company/company', { id });

export const BranchDetails = (id = none) => 
  API.get('/api/company/branch', { id });

export const DepartmentDetails = (id = none) => 
  API.get('/api/company/department', { id });

export const RoleDetails = (id = none) => 
  API.get('/api/company/role', { id });