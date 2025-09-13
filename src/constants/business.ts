import { transformRecordToOption } from '@/utils/common';

export const enableStatusRecord: Record<Api.Common.ActiveStatus, App.I18n.I18nKey> = {
  enable: 'page.manage.common.status.enable',
  disable: 'page.manage.common.status.disable'
};

export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  '1': 'page.manage.user.gender.male',
  '2': 'page.manage.user.gender.female'
};

export const userGenderOptions = transformRecordToOption(userGenderRecord);

export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.type.directory',
  '2': 'page.manage.menu.type.menu'
};

export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  '1': 'page.manage.menu.iconType.iconify',
  '2': 'page.manage.menu.iconType.local'
};

export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);

export const errorCodeLanguageRecord: Record<Api.SystemManage.ErrorCodeLanguage, App.I18n.I18nKey> = {
  'zh-CN': 'page.manage.errorCode.languages.zhCN',
  'en-US': 'page.manage.errorCode.languages.enUS'
};

export const errorCodeLanguageOptions = transformRecordToOption(errorCodeLanguageRecord);

export const errorTypeRecord: Record<Api.SystemManage.ErrorType, App.I18n.I18nKey> = {
  '1': 'page.manage.errorCode.errorTypes.system',
  '2': 'page.manage.errorCode.errorTypes.business',
  '3': 'page.manage.errorCode.errorTypes.validation',
  '4': 'page.manage.errorCode.errorTypes.network'
};

export const errorTypeOptions = transformRecordToOption(errorTypeRecord);
