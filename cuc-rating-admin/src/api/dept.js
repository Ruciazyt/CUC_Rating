import {
  getRequest,
  postRequest,
  deleteRequest,
  postBodyRequest,
} from "@/utils/request";

export function getAllDepts() {
  return getRequest("/depts");
}

export function updateAllDepts(condition) {
  return postBodyRequest("/depts", condition);
}

export function deleteDept(params) {
  return deleteRequest("/depts", params);
}

export function getDeptMembers(params) {
  return getRequest("/members", params);
}

export function setDeptMembers(dept, peoples) {
  return postBodyRequest("/members?dept=" + dept, peoples);
}
