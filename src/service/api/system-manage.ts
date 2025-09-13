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
export function fetchGetErrorCodeList(data?: Api.SystemManage.ErrorCodeSearchParams) {
  return request<Api.SystemManage.ErrorCodeList>({
    url: `/api/error/code/search/${data?.size}/${data?.current}`,
    method: 'post',
    data
  });
}

export type ErrorCodeModel = Pick<
  Api.SystemManage.ErrorCode,
  'errorCode' | 'errorMessage' | 'lang' | 'errorType' | 'errorCause' | 'status'
>;

/** add error code */
export function addErrorCode(data: ErrorCodeModel) {
  return request<null>({
    url: '/api/error/code/create',
    method: 'post',
    data
  });
}

/** batch delete error code */
export function deleteErrorCode(idList: number[]) {
  return request<null>({
    url: '/api/error/code/delete',
    method: 'post',
    data: { idList }
  });
}

/** enable error code */
export function enableErrorCode(id: number) {
  return request<null>({
    url: `/api/error/code/enable/${id}`,
    method: 'post'
  });
}

/** disable error code */
export function disableErrorCode(id: number) {
  return request<null>({
    url: `/api/error/code/disable/${id}`,
    method: 'post'
  });
}
