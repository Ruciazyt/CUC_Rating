import { getRequest, postRequest, deleteRequest } from "@/utils/request";

export function getAllDepts() {
  return getRequest("/depts");
}

export function addDept(params) {
  return postRequest("/depts", params);
}

export function deleteDept(params) {
  return deleteRequest("/depts", params);
}
