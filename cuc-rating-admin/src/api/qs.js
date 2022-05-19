import {getRequest,postRequest,fileDownloadRequest} from '@/utils/request'

export function getAllQS() {
  return getRequest('/questionnaires')
}

export function createQS(params) {
  return postRequest('/questionnaires', params)
}

export function getTokens(params) {
  return getRequest('/tokens', params)
}

export function getProgress(params) {
  return getRequest('/progress', params)
}

export function exportDoc(params) {
  return fileDownloadRequest('/documents', params)
}
