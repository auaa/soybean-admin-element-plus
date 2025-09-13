import { request } from '../request';

/** get role list */
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  return request<Api.SystemManage.RoleList>({
    url: '/systemManage/getRoleList',
    method: 'get',
    params
  });
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
export function fetchGetAllRoles() {
  return request<Api.SystemManage.AllRole[]>({
    url: '/systemManage/getAllRoles',
    method: 'get'
  });
}

/** get user list */
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  return request<Api.SystemManage.UserList>({
    url: '/systemManage/getUserList',
    method: 'get',
    params
  });
}

/** get menu list */
export function fetchGetMenuList() {
  return request<Api.SystemManage.MenuList>({
    url: '/systemManage/getMenuList/v2',
    method: 'get'
  });
}

/** get all pages */
export function fetchGetAllPages() {
  return request<string[]>({
    url: '/systemManage/getAllPages',
    method: 'get'
  });
}

/** get menu tree */
export function fetchGetMenuTree() {
  return request<Api.SystemManage.MenuTree[]>({
    url: '/systemManage/getMenuTree',
    method: 'get'
  });
}

/** get error code list */
export function fetchGetErrorCodeList(params?: Api.SystemManage.ErrorCodeSearchParams) {
  return request<Api.SystemManage.ErrorCodeList>({
    url: '/systemManage/getErrorCodeList',
    method: 'get',
    params
  });
}

export type ErrorCodeModel = Pick<
  Api.SystemManage.ErrorCode,
  'errorCode' | 'errorContent' | 'language' | 'errorType' | 'solution' | 'status'
>;

/** add error code */
export function addErrorCode(data: ErrorCodeModel) {
  return request<null>({
    url: '/systemManage/addErrorCode',
    method: 'post',
    data
  });
}

/** update error code */
export function updateErrorCode(data: ErrorCodeModel & { id: number }) {
  return request<null>({
    url: '/systemManage/updateErrorCode',
    method: 'post',
    data
  });
}

/** delete error code */
export function deleteErrorCode(id: number) {
  return request<null>({
    url: '/systemManage/deleteErrorCode',
    method: 'delete',
    data: { id }
  });
}

/** batch delete error code */
export function batchDeleteErrorCode(ids: number[]) {
  return request<null>({
    url: '/systemManage/batchDeleteErrorCode',
    method: 'delete',
    data: { ids }
  });
}
