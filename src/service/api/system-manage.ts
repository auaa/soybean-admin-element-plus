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

/** get value set children by parent id */
export function fetchGetValueSetTree(parentId: number) {
  return request<Api.SystemManage.ValueSetTree[]>({
    url: '/api/vs/list',
    method: 'post',
    data: {
      keywords: '',
      parentVsId: parentId
    }
  });
}

/** get value set by id */
export function fetchGetValueSetById(id: number) {
  return request<Api.SystemManage.ValueSet>({
    url: `/api/vs/${id}`,
    method: 'get'
  });
}

export type ValueSetModel = Pick<
  Api.SystemManage.ValueSet,
  'vsCode' | 'vsName' | 'vsValue' | 'sort' | 'parentPath' | 'status' | 'description'
>;

/** add new value set */
export function addValueSet(data: ValueSetModel & { parentValueSet?: { id: number } }) {
  return request<null>({
    url: '/api/vs/create',
    method: 'post',
    data
  });
}

/** update value set */
export function updateValueSet(data: ValueSetModel & { id: number; parentValueSet?: { id: number } }) {
  return request<null>({
    url: '/api/vs/update',
    method: 'post',
    data
  });
}

/** delete single value set */
export function deleteSingleValueSet(id: number) {
  return request<null>({
    url: `/api/vs/delete`,
    method: 'post',
    params: { id }
  });
}

/** get i18n list */
export function fetchGetI18nList(data?: Api.SystemManage.I18nSearchParams) {
  return request<Api.SystemManage.I18nList>({
    url: `/api/i18n/search/${data?.size}/${data?.current}`,
    method: 'post',
    data
  });
}

export type I18nModel = Pick<Api.SystemManage.I18n, 'i18nCode' | 'lang' | 'i18nContent' | 'status' | 'description'>;

/** add or update i18n - unified API */
export function saveI18n(data: I18nModel & { id?: number }) {
  return request<null>({
    url: '/api/i18n/create',
    method: 'post',
    data
  });
}

/** delete i18n */
export function deleteI18n(idList: number[]) {
  return request<null>({
    url: `/api/i18n/delete`,
    method: 'post',
    data: { idList }
  });
}

/** enable i18n */
export function enableI18n(id: number) {
  return request<null>({
    url: `/api/i18n/enable/${id}`,
    method: 'post'
  });
}

/** disable i18n */
export function disableI18n(id: number) {
  return request<null>({
    url: `/api/i18n/disable/${id}`,
    method: 'post'
  });
}
