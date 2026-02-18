export type {
  EventDTO,
  DocumentationApiDocumentationPagesLinkPostRequest,
  GetServiceSpecificationPost200Response,
  HttpContentBody,
  HttpContentTypeItem,
  GenerateJsonSchemaPostRequest,
  DocumentationPageInfo,
  DocumentationTreeLevel,
  DocumentationTreeResponse,
  GenerateJsonExamplePostRequest,
  Broker,
  CreateDocumentPageRequest,
  DeleteDocumentPageRequest,
  DocumentationTreeByPathPostRequest,
  DocumentationApiDocumentationPagesFileDeleteRequest,
  DocumentationApiDocumentationPagesFilePostRequest,
  DocumentationTreeLevelPostRequest,
  MoveDocumentPageRequest,
  RenameDocumentPageRequest,
  CalculateAllPathsPostRequest,
  EventGraphApiAddServiceToGraphPostRequest,
  EventGraphApiSaveEventGraphRequest,
  EventGraphApiSaveEventGraphToRepositoryPostRequest,
  SaveMarkdownPostRequest,
  GitApiGitIdPutRequest,
  CalculateAllPathsPost200Response,
  GeneratePdfPost200Response,
  GenerateDocxPost200Response,
  DocumentationPageByUuidResponse,
  GitLabApiGetRepositoryTreeRequest,
  GitLabApiGetFileContentRequest,
  GitLabApiGetFileContentRawRequest,
  TrackerSettingsDto,
  TrackerTypeInfo,
  ImportEventGraphFromRepoPostRequest,
} from '../../openapi';
export {
  GitRepoDtoAuthTypeEnum,
  Configuration,
  JSONApiFactory,
  HttpApiFactory,
  HealthApiFactory,
  GitApiFactory,
  EventGraphApiFactory,
  DownloadApiFactory,
  DocumentationApiFactory,
  BrokersApiFactory,
  HttpStatusCodeEnum,
  HttpParameterTypeEnum,
  NodeDTOTypeEnum,
  GitRepoDtoTypeEnum,
  NodeDTOBrokerTypeEnum,
  HttpContentBodyDefaultFormatEnum,
  HttpContentTypeEnum,
  BranchInfoRemoteStatusEnum,
  BranchInfoBaseStatusEnum,
  NodeDTOMethodTypeEnum,
  DocumentationReadOnlyApiFactory,
  GitLabApiFactory,
  RepositoryTrackerApiFactory,
  TrackerType,
} from '../../openapi';

import {
  AddFileDocumentPageResponse as AddFileDocumentPageResponseApi,
  AddPageLinkRequest as AddPageLinkRequestApi,
  BaseResponse as BaseResponseApi,
  BranchInfo as BranchInfoApi,
  BranchInfoBaseStatusEnum,
  BranchInfoRemoteStatusEnum,
  DocumentationPageUuid404Response as DocumentationPageUuid404ResponseApi,
  EventDTO,
  EventGraphDTO as EventGraphDTOApi,
  GenerateCodeRequest as GenerateCodeRequestApi,
  GenerateSpecPost200Response as GenerateSpecPost200ResponseApi,
  GetServiceSpecificationPostRequest as GetServiceSpecificationPostRequestApi,
  GitRepoDto as GitRepoDtoApi,
  GitRepositoryInfo as GitRepositoryInfoApi,
  HttpContentBody,
  HttpContentDTO as HttpContentDTOApi,
  HttpExampleDTO as HttpExampleDTOApi,
  HttpParameterDTO as HttpParameterDTOApi,
  HttpParametersDTO as HttpParametersDTOApi,
  HttpRequestBodyDTO as HttpRequestBodyDTOApi,
  HttpResponseDTO as HttpResponseDTOApi,
  LinkDTO as LinkDTOApi,
  MDResponse as MDResponseApi,
  NodeDTO as NodeDTOApi,
  SaveEventGraphToRepoResponse as SaveEventGraphToRepoResponseApi,
  ServiceInfo as ServiceInfoApi,
  UpdateServiceSpecificationPostRequest as UpdateServiceSpecificationPostRequestApi,
  ValidateLinksResponse as ValidateLinksResponseApi,
  ValidateLinksResponseIssuesInner as ValidateLinksResponseIssuesInnerApi,
} from '../../openapi';

/**
 * Строгая версия HttpParameterDTO для фронтенда.
 */
export type HttpParameterDTO = Omit<HttpParameterDTOApi, 'required' | 'description' | 'schema' | 'example'> & {
  key: string;
  required: boolean;
  description: string;
  schema: string;
};

/**
 * Строгая версия HttpParametersDTO для фронтенда, где все параметры-массивы обязательны.
 */
export type HttpParametersDTO = Omit<
  HttpParametersDTOApi,
  'pathParameters' | 'queryParameters' | 'headerParameters'
> & {
  pathParameters: HttpParameterDTO[];
  queryParameters: HttpParameterDTO[];
  headerParameters: HttpParameterDTO[];
};

/**
 * Строгая версия HttpContentDTO для фронтенда.
 */
export type HttpContentDTO = Omit<HttpContentDTOApi, 'body'> & {
  body: HttpContentBody;
};

/**
 * Строгая версия HttpRequestBodyDTO для фронтенда.
 */
export type HttpRequestBodyDTO = Omit<HttpRequestBodyDTOApi, 'content' | 'required' | 'description'> & {
  content: HttpContentDTO[];
  required: boolean;
  description: string;
};

/**
 * Строгая версия HttpResponseDTO для фронтенда.
 */
export type HttpResponseDTO = Omit<HttpResponseDTOApi, 'description' | 'headers' | 'content'> & {
  description: string;
  headers: HttpParameterDTO[];
  content: HttpContentDTO[];
};

/**
 * Строгая версия NodeDTO для фронтенда, где `id` является обязательным полем
 * и используются строгие типы для вложенных структур.
 */
export type NodeDTO = Omit<NodeDTOApi, 'id' | 'httpParameters' | 'httpRequestBody' | 'httpResponses'> & {
  id: string;
  httpParameters?: HttpParametersDTO;
  httpRequestBody?: HttpRequestBodyDTO;
  httpResponses?: HttpResponseDTO[];
};

/**
 * Строгая версия LinkDTO для фронтенда, где `id` является обязательным полем.
 */
export type LinkDTO = Omit<LinkDTOApi, 'id'> & {
  id: string;
};
/**
 * Строгий тип для графа, используемый на фронтенде.
 * Гарантирует наличие ключевых массивов и `id` у их элементов.
 */
export type EventGraphDTO = Omit<EventGraphDTOApi, 'nodes' | 'links' | 'events' | 'tags'> & {
  nodes: NodeDTO[];
  links: LinkDTO[];
  events: EventDTO[];
  tags: string[];
};

/**
 * Строгая версия ServiceInfo для фронтенда, где `name` является обязательным.
 */
export type ServiceInfo = Omit<ServiceInfoApi, 'name'> & {
  name: string;
};

/**
 * Строгая версия MDResponse для фронтенда, где `mdString` является обязательным.
 */
export type MDResponse = Omit<MDResponseApi, 'mdString'> & {
  mdString: string;
};

/**
 * Строгая версия BaseResponse для фронтенда, где `status` и `message` обязательны.
 */
export type BaseResponse = Omit<BaseResponseApi, 'status' | 'message'> & {
  status: string;
  message: string;
};

/**
 * Строгая версия HttpExampleDTO для фронтенда.
 */
export type HttpExampleDTO = Omit<HttpExampleDTOApi, 'name' | 'value' | 'summary' | 'description'> & {
  name: string;
  value: string;
  summary: string | null;
  description: string;
};

/**
 * Строгая версия BranchInfo для фронтенда.
 */
export type BranchInfo = Omit<BranchInfoApi, 'name' | 'current' | 'remoteStatus' | 'baseStatus' | 'lastCommit'> & {
  name: string;
  current: boolean;
  remoteStatus: BranchInfoRemoteStatusEnum;
  baseStatus: BranchInfoBaseStatusEnum;
  lastCommit: string | null;
};

/**
 * Строгая версия GenerateCodeRequest для фронтенда.
 */
export type GenerateCodeRequest = Omit<GenerateCodeRequestApi, 'eventGraph'> & {
  eventGraph: EventGraphDTO;
};

/**
 * Строгая версия AddPageLinkRequest для фронтенда.
 */
export type AddPageLinkRequest = Omit<AddPageLinkRequestApi, 'eventGraph'> & {
  eventGraph: EventGraphDTO;
};

/**
 * Строгая версия для элемента ошибки в ValidateLinksResponse.
 */
export type ValidateLinksResponseIssuesInner = Omit<
  ValidateLinksResponseIssuesInnerApi,
  'pageId' | 'objectId' | 'type'
> & {
  pageId: string | null;
  objectId: string | null;
  type: string;
};

/**
 * Строгая версия ValidateLinksResponse для фронтенда.
 */
export type ValidateLinksResponse = Omit<ValidateLinksResponseApi, 'totalLinks' | 'brokenLinks' | 'issues'> & {
  totalLinks: number;
  brokenLinks: number;
  issues: ValidateLinksResponseIssuesInner[];
};

/**
 * Строгая версия AddFileDocumentPageResponse для фронтенда.
 */
export type AddFileDocumentPageResponse = Omit<AddFileDocumentPageResponseApi, 'relativeFilePath'> & {
  relativeFilePath: string;
};

/**
 * Строгая версия SaveEventGraphToRepoResponse для фронтенда.
 */
export type SaveEventGraphToRepoResponse = Omit<SaveEventGraphToRepoResponseApi, 'relativeFilePath'> & {
  relativeFilePath: string;
};

/**
 * Временная версия GitRepoDto для фронтенда.
 */
export type GitRepoDto = GitRepoDtoApi & {
  trackerUrl: string;
  trackerToken: string;
};

/**
 * Строгая версия GitRepositoryInfo для фронтенда.
 */
export type GitRepositoryInfo = Omit<
  GitRepositoryInfoApi,
  | 'repositoryName'
  | 'repositoryId'
  | 'hasLocalRepository'
  | 'hasUncommittedChanges'
  | 'hasUnsavedFileChanges'
  | 'unsavedFiles'
  | 'branches'
  | 'localRepositoryPath'
> & {
  repositoryName: string;
  repositoryId: string;
  hasLocalRepository: boolean;
  hasUncommittedChanges: boolean;
  hasUnsavedFileChanges: boolean;
  unsavedFiles: string[];
  branches: BranchInfo[];
  localRepositoryPath: string | null;
};

/**
 * Строгая версия DocumentationPageUuid404Response для фронтенда.
 */
export type DocumentationPageUuid404Response = Omit<DocumentationPageUuid404ResponseApi, 'status' | 'message'> & {
  status: string;
  message: string;
};

/**
 * Строгая версия GenerateSpecPost200Response для фронтенда.
 */
export type GenerateSpecPost200Response = Omit<GenerateSpecPost200ResponseApi, 'status' | 'message'> & {
  status: string;
  message: string;
};

export type GetServiceSpecificationPostRequest = Omit<GetServiceSpecificationPostRequestApi, 'eventGraph'> & {
  eventGraph: EventGraphDTO;
};

export type UpdateServiceSpecificationPostRequest = Omit<UpdateServiceSpecificationPostRequestApi, 'eventGraph'> & {
  eventGraph: EventGraphDTO;
};
