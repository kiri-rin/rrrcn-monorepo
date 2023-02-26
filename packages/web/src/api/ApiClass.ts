import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Types from "./types/types";
export class Api {
  axiosInstance: AxiosInstance;
  contentManager = {
    getContentManagerContentTypes: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerContentTypes"]["output"]
        >
      >(`/content-manager/content-types`, options),

    getContentManagerContentTypesSettings: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerContentTypesSettings"]["output"]
        >
      >(`/content-manager/content-types-settings`, options),

    getContentManagerContentTypesUidConfiguration: (
      uid: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerContentTypesUidConfiguration"]["output"]
        >
      >(`/content-manager/content-types/${uid}/configuration`, options),

    putContentManagerContentTypesUidConfiguration: (
      uid: string,
      data: Types["contentManager"]["putContentManagerContentTypesUidConfiguration"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["contentManager"]["putContentManagerContentTypesUidConfiguration"]["output"]
        >
      >(`/content-manager/content-types/${uid}/configuration`, data, options),

    getContentManagerComponents: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerComponents"]["output"]
        >
      >(`/content-manager/components`, options),

    getContentManagerComponentsUidConfiguration: (
      uid: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerComponentsUidConfiguration"]["output"]
        >
      >(`/content-manager/components/${uid}/configuration`, options),

    putContentManagerComponentsUidConfiguration: (
      uid: string,
      data: Types["contentManager"]["putContentManagerComponentsUidConfiguration"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["contentManager"]["putContentManagerComponentsUidConfiguration"]["output"]
        >
      >(`/content-manager/components/${uid}/configuration`, data, options),

    postContentManagerUidGenerate: (
      data: Types["contentManager"]["postContentManagerUidGenerate"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentManager"]["postContentManagerUidGenerate"]["output"]
        >
      >(`/content-manager/uid/generate`, data, options),

    postContentManagerUidCheckAvailability: (
      data: Types["contentManager"]["postContentManagerUidCheckAvailability"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentManager"]["postContentManagerUidCheckAvailability"]["output"]
        >
      >(`/content-manager/uid/check-availability`, data, options),

    getContentManagerRelationsModelTargetField: (
      model: string,
      targetField: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerRelationsModelTargetField"]["output"]
        >
      >(`/content-manager/relations/${model}/${targetField}`, options),

    getContentManagerRelationsModelIdTargetField: (
      model: string,
      id: string,
      targetField: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerRelationsModelIdTargetField"]["output"]
        >
      >(`/content-manager/relations/${model}/${id}/${targetField}`, options),

    getContentManagerSingleTypesModel: (
      model: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerSingleTypesModel"]["output"]
        >
      >(`/content-manager/single-types/${model}`, options),

    putContentManagerSingleTypesModel: (
      model: string,
      data: Types["contentManager"]["putContentManagerSingleTypesModel"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["contentManager"]["putContentManagerSingleTypesModel"]["output"]
        >
      >(`/content-manager/single-types/${model}`, data, options),

    deleteContentManagerSingleTypesModel: (
      model: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<
          Types["contentManager"]["deleteContentManagerSingleTypesModel"]["output"]
        >
      >(`/content-manager/single-types/${model}`, options),

    postContentManagerSingleTypesModelActionsPublish: (
      model: string,
      data: Types["contentManager"]["postContentManagerSingleTypesModelActionsPublish"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentManager"]["postContentManagerSingleTypesModelActionsPublish"]["output"]
        >
      >(
        `/content-manager/single-types/${model}/actions/publish`,
        data,
        options
      ),

    postContentManagerSingleTypesModelActionsUnpublish: (
      model: string,
      data: Types["contentManager"]["postContentManagerSingleTypesModelActionsUnpublish"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentManager"]["postContentManagerSingleTypesModelActionsUnpublish"]["output"]
        >
      >(
        `/content-manager/single-types/${model}/actions/unpublish`,
        data,
        options
      ),

    getContentManagerSingleTypesModelActionsNumberOfDraftRelations: (
      model: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerSingleTypesModelActionsNumberOfDraftRelations"]["output"]
        >
      >(
        `/content-manager/single-types/${model}/actions/numberOfDraftRelations`,
        options
      ),

    getContentManagerCollectionTypesModel: (
      model: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerCollectionTypesModel"]["output"]
        >
      >(`/content-manager/collection-types/${model}`, options),

    postContentManagerCollectionTypesModel: (
      model: string,
      data: Types["contentManager"]["postContentManagerCollectionTypesModel"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentManager"]["postContentManagerCollectionTypesModel"]["output"]
        >
      >(`/content-manager/collection-types/${model}`, data, options),

    getContentManagerCollectionTypesModelId: (
      model: string,
      id: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerCollectionTypesModelId"]["output"]
        >
      >(`/content-manager/collection-types/${model}/${id}`, options),

    putContentManagerCollectionTypesModelId: (
      model: string,
      id: string,
      data: Types["contentManager"]["putContentManagerCollectionTypesModelId"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["contentManager"]["putContentManagerCollectionTypesModelId"]["output"]
        >
      >(`/content-manager/collection-types/${model}/${id}`, data, options),

    deleteContentManagerCollectionTypesModelId: (
      model: string,
      id: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<
          Types["contentManager"]["deleteContentManagerCollectionTypesModelId"]["output"]
        >
      >(`/content-manager/collection-types/${model}/${id}`, options),

    postContentManagerCollectionTypesModelIdActionsPublish: (
      model: string,
      id: string,
      data: Types["contentManager"]["postContentManagerCollectionTypesModelIdActionsPublish"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentManager"]["postContentManagerCollectionTypesModelIdActionsPublish"]["output"]
        >
      >(
        `/content-manager/collection-types/${model}/${id}/actions/publish`,
        data,
        options
      ),

    postContentManagerCollectionTypesModelIdActionsUnpublish: (
      model: string,
      id: string,
      data: Types["contentManager"]["postContentManagerCollectionTypesModelIdActionsUnpublish"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentManager"]["postContentManagerCollectionTypesModelIdActionsUnpublish"]["output"]
        >
      >(
        `/content-manager/collection-types/${model}/${id}/actions/unpublish`,
        data,
        options
      ),

    postContentManagerCollectionTypesModelActionsBulkDelete: (
      model: string,
      data: Types["contentManager"]["postContentManagerCollectionTypesModelActionsBulkDelete"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentManager"]["postContentManagerCollectionTypesModelActionsBulkDelete"]["output"]
        >
      >(
        `/content-manager/collection-types/${model}/actions/bulkDelete`,
        data,
        options
      ),

    getContentManagerCollectionTypesModelIdActionsNumberOfDraftRelations: (
      model: string,
      id: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentManager"]["getContentManagerCollectionTypesModelIdActionsNumberOfDraftRelations"]["output"]
        >
      >(
        `/content-manager/collection-types/${model}/${id}/actions/numberOfDraftRelations`,
        options
      ),
  };

  contentTypeBuilder = {
    getContentTypeBuilderReservedNames: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getContentTypeBuilderReservedNames"]["output"]
        >
      >(`/content-type-builder/reserved-names`, options),

    getContentTypeBuilderContentTypes: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getContentTypeBuilderContentTypes"]["output"]
        >
      >(`/content-type-builder/content-types`, options),

    getContentTypeBuilderContentTypesUid: (
      uid: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getContentTypeBuilderContentTypesUid"]["output"]
        >
      >(`/content-type-builder/content-types/${uid}`, options),

    postContentTypeBuilderContentTypes: (
      data: Types["contentTypeBuilder"]["postContentTypeBuilderContentTypes"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["postContentTypeBuilderContentTypes"]["output"]
        >
      >(`/content-type-builder/content-types`, data, options),

    putContentTypeBuilderContentTypesUid: (
      uid: string,
      data: Types["contentTypeBuilder"]["putContentTypeBuilderContentTypesUid"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["putContentTypeBuilderContentTypesUid"]["output"]
        >
      >(`/content-type-builder/content-types/${uid}`, data, options),

    deleteContentTypeBuilderContentTypesUid: (
      uid: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["deleteContentTypeBuilderContentTypesUid"]["output"]
        >
      >(`/content-type-builder/content-types/${uid}`, options),

    getContentTypeBuilderComponents: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getContentTypeBuilderComponents"]["output"]
        >
      >(`/content-type-builder/components`, options),

    getContentTypeBuilderComponentsUid: (
      uid: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getContentTypeBuilderComponentsUid"]["output"]
        >
      >(`/content-type-builder/components/${uid}`, options),

    postContentTypeBuilderComponents: (
      data: Types["contentTypeBuilder"]["postContentTypeBuilderComponents"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["postContentTypeBuilderComponents"]["output"]
        >
      >(`/content-type-builder/components`, data, options),

    putContentTypeBuilderComponentsUid: (
      uid: string,
      data: Types["contentTypeBuilder"]["putContentTypeBuilderComponentsUid"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["putContentTypeBuilderComponentsUid"]["output"]
        >
      >(`/content-type-builder/components/${uid}`, data, options),

    deleteContentTypeBuilderComponentsUid: (
      uid: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["deleteContentTypeBuilderComponentsUid"]["output"]
        >
      >(`/content-type-builder/components/${uid}`, options),

    putContentTypeBuilderComponentCategoriesName: (
      name: string,
      data: Types["contentTypeBuilder"]["putContentTypeBuilderComponentCategoriesName"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["putContentTypeBuilderComponentCategoriesName"]["output"]
        >
      >(`/content-type-builder/component-categories/${name}`, data, options),

    deleteContentTypeBuilderComponentCategoriesName: (
      name: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["deleteContentTypeBuilderComponentCategoriesName"]["output"]
        >
      >(`/content-type-builder/component-categories/${name}`, options),

    getApiContentTypeBuilderContentTypes: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getApiContentTypeBuilderContentTypes"]["output"]
        >
      >(`/api/content-type-builder/content-types`, options),

    getApiContentTypeBuilderContentTypesUid: (
      uid: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getApiContentTypeBuilderContentTypesUid"]["output"]
        >
      >(`/api/content-type-builder/content-types/${uid}`, options),

    getApiContentTypeBuilderComponents: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getApiContentTypeBuilderComponents"]["output"]
        >
      >(`/api/content-type-builder/components`, options),

    getApiContentTypeBuilderComponentsUid: (
      uid: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["contentTypeBuilder"]["getApiContentTypeBuilderComponentsUid"]["output"]
        >
      >(`/api/content-type-builder/components/${uid}`, options),
  };

  email = {
    postEmail: (
      data: Types["email"]["postEmail"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["email"]["postEmail"]["output"]>
      >(`/email/`, data, options),

    postEmailTest: (
      data: Types["email"]["postEmailTest"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["email"]["postEmailTest"]["output"]>
      >(`/email/test`, data, options),

    getEmailSettings: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["email"]["getEmailSettings"]["output"]>
      >(`/email/settings`, options),

    postApiEmail: (
      data: Types["email"]["postApiEmail"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["email"]["postApiEmail"]["output"]>
      >(`/api/email/`, data, options),
  };

  i18N = {
    getI18NIsoLocales: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["i18N"]["getI18NIsoLocales"]["output"]>
      >(`/i18n/iso-locales`, options),

    getI18NLocales: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["i18N"]["getI18NLocales"]["output"]>
      >(`/i18n/locales`, options),

    postI18NLocales: (
      data: Types["i18N"]["postI18NLocales"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["i18N"]["postI18NLocales"]["output"]>
      >(`/i18n/locales`, data, options),

    putI18NLocalesId: (
      id: string,
      data: Types["i18N"]["putI18NLocalesId"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<Types["i18N"]["putI18NLocalesId"]["output"]>
      >(`/i18n/locales/${id}`, data, options),

    deleteI18NLocalesId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<Types["i18N"]["deleteI18NLocalesId"]["output"]>
      >(`/i18n/locales/${id}`, options),

    postI18NContentManagerActionsGetNonLocalizedFields: (
      data: Types["i18N"]["postI18NContentManagerActionsGetNonLocalizedFields"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["i18N"]["postI18NContentManagerActionsGetNonLocalizedFields"]["output"]
        >
      >(
        `/i18n/content-manager/actions/get-non-localized-fields`,
        data,
        options
      ),

    getApiI18NLocales: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["i18N"]["getApiI18NLocales"]["output"]>
      >(`/api/i18n/locales`, options),
  };

  upload = {
    getUploadSettings: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getUploadSettings"]["output"]>
      >(`/upload/settings`, options),

    putUploadSettings: (
      data: Types["upload"]["putUploadSettings"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<Types["upload"]["putUploadSettings"]["output"]>
      >(`/upload/settings`, data, options),

    postUpload: (
      data: Types["upload"]["postUpload"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["upload"]["postUpload"]["output"]>
      >(`/upload/`, data, options),

    getUploadFiles: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getUploadFiles"]["output"]>
      >(`/upload/files`, options),

    getUploadFilesId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getUploadFilesId"]["output"]>
      >(`/upload/files/${id}`, options),

    deleteUploadFilesId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<Types["upload"]["deleteUploadFilesId"]["output"]>
      >(`/upload/files/${id}`, options),

    getUploadFoldersId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getUploadFoldersId"]["output"]>
      >(`/upload/folders/${id}`, options),

    getUploadFolders: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getUploadFolders"]["output"]>
      >(`/upload/folders`, options),

    postUploadFolders: (
      data: Types["upload"]["postUploadFolders"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["upload"]["postUploadFolders"]["output"]>
      >(`/upload/folders`, data, options),

    putUploadFoldersId: (
      id: string,
      data: Types["upload"]["putUploadFoldersId"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<Types["upload"]["putUploadFoldersId"]["output"]>
      >(`/upload/folders/${id}`, data, options),

    getUploadFolderStructure: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getUploadFolderStructure"]["output"]>
      >(`/upload/folder-structure`, options),

    postUploadActionsBulkDelete: (
      data: Types["upload"]["postUploadActionsBulkDelete"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["upload"]["postUploadActionsBulkDelete"]["output"]>
      >(`/upload/actions/bulk-delete`, data, options),

    postUploadActionsBulkMove: (
      data: Types["upload"]["postUploadActionsBulkMove"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["upload"]["postUploadActionsBulkMove"]["output"]>
      >(`/upload/actions/bulk-move`, data, options),

    getUploadConfiguration: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getUploadConfiguration"]["output"]>
      >(`/upload/configuration`, options),

    putUploadConfiguration: (
      data: Types["upload"]["putUploadConfiguration"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<Types["upload"]["putUploadConfiguration"]["output"]>
      >(`/upload/configuration`, data, options),

    postApiUpload: (
      data: Types["upload"]["postApiUpload"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["upload"]["postApiUpload"]["output"]>
      >(`/api/upload/`, data, options),

    getApiUploadFiles: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getApiUploadFiles"]["output"]>
      >(`/api/upload/files`, options),

    getApiUploadFilesId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["upload"]["getApiUploadFilesId"]["output"]>
      >(`/api/upload/files/${id}`, options),

    deleteApiUploadFilesId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<Types["upload"]["deleteApiUploadFilesId"]["output"]>
      >(`/api/upload/files/${id}`, options),
  };

  usersPermissions = {
    getUsersPermissionsRolesId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getUsersPermissionsRolesId"]["output"]
        >
      >(`/users-permissions/roles/${id}`, options),

    getUsersPermissionsRoles: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getUsersPermissionsRoles"]["output"]
        >
      >(`/users-permissions/roles`, options),

    postUsersPermissionsRoles: (
      data: Types["usersPermissions"]["postUsersPermissionsRoles"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["usersPermissions"]["postUsersPermissionsRoles"]["output"]
        >
      >(`/users-permissions/roles`, data, options),

    putUsersPermissionsRolesRole: (
      role: string,
      data: Types["usersPermissions"]["putUsersPermissionsRolesRole"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["usersPermissions"]["putUsersPermissionsRolesRole"]["output"]
        >
      >(`/users-permissions/roles/${role}`, data, options),

    deleteUsersPermissionsRolesRole: (
      role: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<
          Types["usersPermissions"]["deleteUsersPermissionsRolesRole"]["output"]
        >
      >(`/users-permissions/roles/${role}`, options),

    getUsersPermissionsEmailTemplates: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getUsersPermissionsEmailTemplates"]["output"]
        >
      >(`/users-permissions/email-templates`, options),

    putUsersPermissionsEmailTemplates: (
      data: Types["usersPermissions"]["putUsersPermissionsEmailTemplates"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["usersPermissions"]["putUsersPermissionsEmailTemplates"]["output"]
        >
      >(`/users-permissions/email-templates`, data, options),

    getUsersPermissionsAdvanced: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getUsersPermissionsAdvanced"]["output"]
        >
      >(`/users-permissions/advanced`, options),

    putUsersPermissionsAdvanced: (
      data: Types["usersPermissions"]["putUsersPermissionsAdvanced"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["usersPermissions"]["putUsersPermissionsAdvanced"]["output"]
        >
      >(`/users-permissions/advanced`, data, options),

    getUsersPermissionsProviders: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getUsersPermissionsProviders"]["output"]
        >
      >(`/users-permissions/providers`, options),

    putUsersPermissionsProviders: (
      data: Types["usersPermissions"]["putUsersPermissionsProviders"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["usersPermissions"]["putUsersPermissionsProviders"]["output"]
        >
      >(`/users-permissions/providers`, data, options),

    getUsersPermissionsPermissions: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getUsersPermissionsPermissions"]["output"]
        >
      >(`/users-permissions/permissions`, options),

    getUsersPermissionsPolicies: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getUsersPermissionsPolicies"]["output"]
        >
      >(`/users-permissions/policies`, options),

    getUsersPermissionsRoutes: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getUsersPermissionsRoutes"]["output"]
        >
      >(`/users-permissions/routes`, options),

    getApiConnect: (arg0: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["usersPermissions"]["getApiConnect"]["output"]>
      >(`/api/connect/${arg0}`, options),

    postApiAuthLocal: (
      data: Types["usersPermissions"]["postApiAuthLocal"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["usersPermissions"]["postApiAuthLocal"]["output"]>
      >(`/api/auth/local`, data, options),

    postApiAuthLocalRegister: (
      data: Types["usersPermissions"]["postApiAuthLocalRegister"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["usersPermissions"]["postApiAuthLocalRegister"]["output"]
        >
      >(`/api/auth/local/register`, data, options),

    getApiAuthProviderCallback: (
      provider: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getApiAuthProviderCallback"]["output"]
        >
      >(`/api/auth/${provider}/callback`, options),

    postApiAuthForgotPassword: (
      data: Types["usersPermissions"]["postApiAuthForgotPassword"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["usersPermissions"]["postApiAuthForgotPassword"]["output"]
        >
      >(`/api/auth/forgot-password`, data, options),

    postApiAuthResetPassword: (
      data: Types["usersPermissions"]["postApiAuthResetPassword"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["usersPermissions"]["postApiAuthResetPassword"]["output"]
        >
      >(`/api/auth/reset-password`, data, options),

    getApiAuthEmailConfirmation: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getApiAuthEmailConfirmation"]["output"]
        >
      >(`/api/auth/email-confirmation`, options),

    postApiAuthSendEmailConfirmation: (
      data: Types["usersPermissions"]["postApiAuthSendEmailConfirmation"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["usersPermissions"]["postApiAuthSendEmailConfirmation"]["output"]
        >
      >(`/api/auth/send-email-confirmation`, data, options),

    postApiAuthChangePassword: (
      data: Types["usersPermissions"]["postApiAuthChangePassword"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["usersPermissions"]["postApiAuthChangePassword"]["output"]
        >
      >(`/api/auth/change-password`, data, options),

    getApiUsersCount: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["usersPermissions"]["getApiUsersCount"]["output"]>
      >(`/api/users/count`, options),

    getApiUsers: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["usersPermissions"]["getApiUsers"]["output"]>
      >(`/api/users`, options),

    getApiUsersMe: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["usersPermissions"]["getApiUsersMe"]["output"]>
      >(`/api/users/me`, options),

    getApiUsersId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<Types["usersPermissions"]["getApiUsersId"]["output"]>
      >(`/api/users/${id}`, options),

    postApiUsers: (
      data: Types["usersPermissions"]["postApiUsers"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["usersPermissions"]["postApiUsers"]["output"]>
      >(`/api/users`, data, options),

    putApiUsersId: (
      id: string,
      data: Types["usersPermissions"]["putApiUsersId"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<Types["usersPermissions"]["putApiUsersId"]["output"]>
      >(`/api/users/${id}`, data, options),

    deleteApiUsersId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<Types["usersPermissions"]["deleteApiUsersId"]["output"]>
      >(`/api/users/${id}`, options),

    getApiUsersPermissionsRolesId: (id: string, options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getApiUsersPermissionsRolesId"]["output"]
        >
      >(`/api/users-permissions/roles/${id}`, options),

    getApiUsersPermissionsRoles: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getApiUsersPermissionsRoles"]["output"]
        >
      >(`/api/users-permissions/roles`, options),

    postApiUsersPermissionsRoles: (
      data: Types["usersPermissions"]["postApiUsersPermissionsRoles"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<
          Types["usersPermissions"]["postApiUsersPermissionsRoles"]["output"]
        >
      >(`/api/users-permissions/roles`, data, options),

    putApiUsersPermissionsRolesRole: (
      role: string,
      data: Types["usersPermissions"]["putApiUsersPermissionsRolesRole"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.put<
        any,
        AxiosResponse<
          Types["usersPermissions"]["putApiUsersPermissionsRolesRole"]["output"]
        >
      >(`/api/users-permissions/roles/${role}`, data, options),

    deleteApiUsersPermissionsRolesRole: (
      role: string,
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.delete<
        any,
        AxiosResponse<
          Types["usersPermissions"]["deleteApiUsersPermissionsRolesRole"]["output"]
        >
      >(`/api/users-permissions/roles/${role}`, options),

    getApiUsersPermissionsPermissions: (options?: AxiosRequestConfig) =>
      this.axiosInstance.get<
        any,
        AxiosResponse<
          Types["usersPermissions"]["getApiUsersPermissionsPermissions"]["output"]
        >
      >(`/api/users-permissions/permissions`, options),
  };

  eeData = {
    postApiEeDataExtract: (
      data: Types["eeData"]["postApiEeDataExtract"]["input"],
      options?: AxiosRequestConfig
    ) =>
      this.axiosInstance.post<
        any,
        AxiosResponse<Types["eeData"]["postApiEeDataExtract"]["output"]>
      >(`/api/ee-data/extract`, data, options),
  };

  constructor(instance: AxiosInstance = axios.create()) {
    this.axiosInstance = instance;
  }
}
const api = new Api();
export default api;
