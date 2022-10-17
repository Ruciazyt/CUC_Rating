import { getRequest, postRequest, deleteRequest, postBodyRequest } from "@/utils/request";

export function getAllDepts() {
  return getRequest("/depts");
}

export function updateAllDepts(condition){
  return postBodyRequest("/depts",condition)
}

export function addDept(params) {
  return postRequest("/depts", params);
}

export function deleteDept(params) {
  return deleteRequest("/depts", params);
}
