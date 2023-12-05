export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Map: { input: any; output: any; }
  Time: { input: any; output: any; }
};

/** Marketplace Query */
export type AirQuery = {
  __typename?: 'AirQuery';
  /** Time when the query got created */
  createdAt: Maybe<Scalars['Time']['output']>;
  /** Username details who created the query */
  createdBy: SecureUser;
  /** Query ID from which this query is forked from */
  forkedFrom: Maybe<Scalars['String']['output']>;
  /** ID of the query */
  id: Maybe<Scalars['ID']['output']>;
  /** Number of times user downloaded the results of this query */
  noOfDownloads: Maybe<Scalars['Int']['output']>;
  /** Number of forks from this query */
  noOfForks: Maybe<Scalars['Int']['output']>;
  /** Number of times user ran this query */
  noOfRuns: Maybe<Scalars['Int']['output']>;
  /** Published query data */
  publishedQuery: Maybe<PublishedAirQueryData>;
  /** Saved query data */
  savedQuery: Maybe<SavedAirQueryData>;
  /** Time when the query got updated */
  updatedAt: Maybe<Scalars['Time']['output']>;
  /** User details who updated the query */
  updatedBy: SecureUser;
};

export type AirQueryInput = {
  description: InputMaybe<Scalars['String']['input']>;
  id: InputMaybe<Scalars['ID']['input']>;
  inputVars: InputMaybe<Scalars['String']['input']>;
  query: InputMaybe<Scalars['String']['input']>;
  tags: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title: InputMaybe<Scalars['String']['input']>;
};

export enum Blockchain {
  Ethereum = 'ethereum',
  Gnosis = 'gnosis',
  Polygon = 'polygon'
}

export type CheckWalletEligibilityForFreeCreditsInput = {
  walletAddress: Scalars['String']['input'];
};

export type CheckoutSessionInput = {
  id: Scalars['String']['input'];
};

export enum CheckoutSessionPaymentStatus {
  NoPaymentRequired = 'no_payment_required',
  Paid = 'paid',
  Unpaid = 'unpaid'
}

export type CheckoutSessionResult = {
  __typename?: 'CheckoutSessionResult';
  id: Scalars['String']['output'];
  paymentStatus: CheckoutSessionPaymentStatus;
  status: CheckoutSessionStatus;
};

export enum CheckoutSessionStatus {
  Complete = 'complete',
  Expired = 'expired',
  Open = 'open'
}

export type Credit = {
  __typename?: 'Credit';
  createdAt: Maybe<Scalars['Time']['output']>;
  deletedAt: Maybe<Scalars['Time']['output']>;
  id: Maybe<Scalars['ID']['output']>;
  initialFreeCreditAllocatedTs: Maybe<Scalars['Time']['output']>;
  isPaymentMethodAdded: Maybe<Scalars['Boolean']['output']>;
  keys: Maybe<Array<Maybe<Key>>>;
  subscription: Maybe<LatestSubscription>;
  type: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['Time']['output']>;
  userId: Maybe<Scalars['String']['output']>;
};

export type EnsName = {
  __typename?: 'EnsName';
  isPrimary: Maybe<Scalars['Boolean']['output']>;
  name: Maybe<Scalars['String']['output']>;
};

export type ForkQueryInput = {
  queryId: Scalars['String']['input'];
  queryType: QueryType;
};

export type GenerateQueryTagsInput = {
  inputVars: InputMaybe<Scalars['String']['input']>;
  query: Scalars['String']['input'];
};

export type GenerateUrlInput = {
  cancelUrl: Scalars['String']['input'];
  successUrl: Scalars['String']['input'];
  urlType: UrlType;
};

export type GetAirQueriesInput = {
  cursor: InputMaybe<Scalars['String']['input']>;
  getFeatured: InputMaybe<Scalars['Boolean']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  me: InputMaybe<Scalars['Boolean']['input']>;
  orderBy: InputMaybe<OrderBy>;
  skip: InputMaybe<Scalars['Int']['input']>;
  tags: InputMaybe<Array<InputMaybe<QueryTagInput>>>;
};

export type GetAirQueriesOutput = {
  __typename?: 'GetAirQueriesOutput';
  pageInfo: Maybe<PageInfo>;
  queries: Maybe<Array<Maybe<AirQuery>>>;
};

export type GetAirQueryInput = {
  id: Scalars['String']['input'];
};

export type Identity = {
  __typename?: 'Identity';
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ImageSizes = {
  __typename?: 'ImageSizes';
  extraSmall: Maybe<Scalars['String']['output']>;
  large: Maybe<Scalars['String']['output']>;
  medium: Maybe<Scalars['String']['output']>;
  original: Maybe<Scalars['String']['output']>;
  small: Maybe<Scalars['String']['output']>;
};

export type Invoice = {
  __typename?: 'Invoice';
  createdAt: Maybe<Scalars['Time']['output']>;
  deletedAt: Maybe<Scalars['Time']['output']>;
  paymentMode: Maybe<Scalars['String']['output']>;
  paymentStatus: Maybe<Scalars['String']['output']>;
  updatedAt: Maybe<Scalars['Time']['output']>;
  userId: Maybe<Scalars['String']['output']>;
};

export type Key = {
  __typename?: 'Key';
  createdAt: Maybe<Scalars['Time']['output']>;
  deletedAt: Maybe<Scalars['Time']['output']>;
  id: Maybe<Scalars['ID']['output']>;
  key: Maybe<Scalars['String']['output']>;
  keyHash: Maybe<Scalars['String']['output']>;
  status: Maybe<KeyStatus>;
  type: Maybe<KeyType>;
  updatedAt: Maybe<Scalars['Time']['output']>;
  usage: Maybe<KeyUsage>;
  userId: Maybe<Scalars['String']['output']>;
};

export enum KeyStatus {
  Active = 'active',
  Inactive = 'inactive'
}

export enum KeyType {
  Dev = 'dev',
  Prod = 'prod'
}

export type KeyUsage = {
  __typename?: 'KeyUsage';
  currentCycleCreditsUsed: Maybe<Scalars['Int']['output']>;
  freeCreditsUsed: Maybe<Scalars['Int']['output']>;
  lastUpdatedAt: Maybe<Scalars['Time']['output']>;
  lifetimeCreditsUsed: Maybe<Scalars['Int']['output']>;
  totalFreeCredits: Maybe<Scalars['Int']['output']>;
};

export type LatestSubscription = {
  __typename?: 'LatestSubscription';
  cancelAtTs: Maybe<Scalars['Time']['output']>;
  collectionMethod: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['Time']['output']>;
  deletedAt: Maybe<Scalars['Time']['output']>;
  endedAtTs: Maybe<Scalars['Time']['output']>;
  id: Scalars['ID']['output'];
  lastBillingTs: Maybe<Scalars['Time']['output']>;
  nextBillingTs: Maybe<Scalars['Time']['output']>;
  startBillingTs: Maybe<Scalars['Time']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Maybe<Scalars['Time']['output']>;
  userId: Scalars['String']['output'];
};

export type LogUserActionInput = {
  metadata: InputMaybe<Scalars['Map']['input']>;
  status: UserActionStatus;
  timestamp: Scalars['Time']['input'];
  userAction: UserAction;
};

export enum MentionType {
  DaoToken = 'DAO_TOKEN',
  NftCollection = 'NFT_COLLECTION',
  Poap = 'POAP',
  Token = 'TOKEN'
}

export type MetabaseUrlInput = {
  apiKeyHash: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type Metadata = {
  __typename?: 'Metadata';
  tokenMints: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Discard the saved query */
  DiscardSavedQuery: Maybe<AirQuery>;
  /** Forks the given query */
  ForkQuery: AirQuery;
  LogUserAction: Maybe<Scalars['Boolean']['output']>;
  Login: Maybe<User>;
  /** Publishes the given query */
  PublishQuery: AirQuery;
  /** Saves the given query */
  SaveQuery: AirQuery;
  SaveUserAppConfig: Maybe<UserAppConfig>;
  UnlinkWallet: Scalars['Boolean']['output'];
  /** Unpublishes the given query */
  UnpublishQuery: AirQuery;
  UpdateUser: Maybe<User>;
};


export type MutationDiscardSavedQueryArgs = {
  queryId: Scalars['String']['input'];
};


export type MutationForkQueryArgs = {
  input: ForkQueryInput;
};


export type MutationLogUserActionArgs = {
  input: InputMaybe<LogUserActionInput>;
};


export type MutationPublishQueryArgs = {
  queryId: Scalars['String']['input'];
};


export type MutationSaveQueryArgs = {
  input: AirQueryInput;
};


export type MutationSaveUserAppConfigArgs = {
  input: UserAppConfigInput;
};


export type MutationUnpublishQueryArgs = {
  queryId: Scalars['String']['input'];
};


export type MutationUpdateUserArgs = {
  input: InputMaybe<UpdateUserInput>;
};

export enum OrderBy {
  Popular = 'POPULAR',
  Recent = 'RECENT',
  Trending = 'TRENDING'
}

export type PageInfo = {
  __typename?: 'PageInfo';
  nextCursor: Maybe<Scalars['String']['output']>;
};

export type PublishedAirQueryData = {
  __typename?: 'PublishedAirQueryData';
  /** Description of the published query */
  description: Maybe<Scalars['String']['output']>;
  /** Input variables to the published query */
  inputVars: Maybe<Scalars['String']['output']>;
  /** Time when the query got published */
  publishedAt: Maybe<Scalars['Time']['output']>;
  /** Published Graphql query */
  query: Maybe<Scalars['String']['output']>;
  /** Tags associated to the published query */
  tags: Maybe<Array<Maybe<QueryTag>>>;
  /** Title of the published query */
  title: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  CheckUserNameIsAvailable: Scalars['Boolean']['output'];
  CheckWalletEligibilityForFreeCredits: Wallet;
  /** Generate Query Tags */
  GenerateQueryTags: Maybe<Array<Maybe<QueryTag>>>;
  GenerateUrl: Url;
  GetCheckoutSessionStatus: CheckoutSessionResult;
  GetENSNames: Maybe<Array<Maybe<EnsName>>>;
  GetMetabaseUrl: Scalars['String']['output'];
  /** Get Predefined Tags based on category */
  GetPredefinedTags: Maybe<Array<QueryTag>>;
  /** Get list of queries */
  GetQueries: Maybe<GetAirQueriesOutput>;
  /** Get an query */
  GetQuery: Maybe<AirQuery>;
  /** Get Query Template */
  GetQueryTemplate: Maybe<QueryTemplate>;
  /** Get Query Templates */
  GetQueryTemplates: Maybe<Array<Maybe<QueryTemplate>>>;
  GetUserAppConfig: Maybe<UserAppConfig>;
  Me: Maybe<User>;
  RecentSearches: Maybe<RecentSearchesResult>;
  SearchAIMentions: Maybe<SearchAiMentionResults>;
};


export type QueryCheckUserNameIsAvailableArgs = {
  input: Scalars['String']['input'];
};


export type QueryCheckWalletEligibilityForFreeCreditsArgs = {
  input: CheckWalletEligibilityForFreeCreditsInput;
};


export type QueryGenerateQueryTagsArgs = {
  input: GenerateQueryTagsInput;
};


export type QueryGenerateUrlArgs = {
  input: GenerateUrlInput;
};


export type QueryGetCheckoutSessionStatusArgs = {
  input: CheckoutSessionInput;
};


export type QueryGetEnsNamesArgs = {
  input: Scalars['String']['input'];
};


export type QueryGetMetabaseUrlArgs = {
  input: MetabaseUrlInput;
};


export type QueryGetPredefinedTagsArgs = {
  category: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetQueriesArgs = {
  input: GetAirQueriesInput;
};


export type QueryGetQueryArgs = {
  input: GetAirQueryInput;
};


export type QueryGetQueryTemplateArgs = {
  templateID: Scalars['String']['input'];
};


export type QueryRecentSearchesArgs = {
  input: RecentSearchesInput;
};


export type QuerySearchAiMentionsArgs = {
  input: SearchAiMentionsInput;
};

export type QueryTag = {
  __typename?: 'QueryTag';
  category: Maybe<Scalars['String']['output']>;
  isPredefined: Maybe<Scalars['Boolean']['output']>;
  label: Maybe<Scalars['String']['output']>;
  thumbnail: Maybe<Scalars['String']['output']>;
};

export type QueryTagInput = {
  category: InputMaybe<Scalars['String']['input']>;
  isPredefined: Scalars['Boolean']['input'];
  label: Scalars['String']['input'];
};

export type QueryTemplate = {
  __typename?: 'QueryTemplate';
  id: Maybe<Scalars['String']['output']>;
  inputVars: Maybe<Scalars['String']['output']>;
  label: Maybe<Scalars['String']['output']>;
  query: Maybe<Scalars['String']['output']>;
  thumbnail: Maybe<Scalars['String']['output']>;
};

export enum QueryType {
  Published = 'PUBLISHED',
  Saved = 'SAVED'
}

export type RecentSearchesInput = {
  userId: InputMaybe<Scalars['String']['input']>;
};

export type RecentSearchesResult = {
  __typename?: 'RecentSearchesResult';
  question: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  userId: Maybe<Scalars['String']['output']>;
};

export type SavedAirQueryData = {
  __typename?: 'SavedAirQueryData';
  description: Maybe<Scalars['String']['output']>;
  inputVars: Maybe<Scalars['String']['output']>;
  query: Maybe<Scalars['String']['output']>;
  savedAt: Maybe<Scalars['Time']['output']>;
  tags: Maybe<Array<Maybe<QueryTag>>>;
  title: Maybe<Scalars['String']['output']>;
};

export type SearchAiMentionResult = {
  __typename?: 'SearchAIMentionResult';
  address: Maybe<Scalars['String']['output']>;
  blockchain: Maybe<Blockchain>;
  eventId: Maybe<Scalars['String']['output']>;
  image: Maybe<ImageSizes>;
  metadata: Maybe<Metadata>;
  name: Maybe<Scalars['String']['output']>;
  symbol: Maybe<Scalars['String']['output']>;
  thumbnailURL: Maybe<Scalars['String']['output']>;
  tokenType: Maybe<TokenType>;
  type: Maybe<MentionType>;
};

export type SearchAiMentionResults = {
  __typename?: 'SearchAIMentionResults';
  pageInfo: Maybe<PageInfo>;
  results: Maybe<Array<Maybe<SearchAiMentionResult>>>;
};

export type SearchAiMentionsInput = {
  blockchain: InputMaybe<Blockchain>;
  cursor: InputMaybe<Scalars['String']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  searchTerm: InputMaybe<Scalars['String']['input']>;
  tokenType: InputMaybe<TokenType>;
};

export type SecureUser = {
  __typename?: 'SecureUser';
  id: Maybe<Scalars['String']['output']>;
  isVerified: Maybe<Scalars['Boolean']['output']>;
  userName: Maybe<Scalars['String']['output']>;
};

export enum TokenType {
  Erc20 = 'ERC20',
  Erc721 = 'ERC721',
  Erc1155 = 'ERC1155',
  Poap = 'POAP'
}

export type UpdateUserInput = {
  communicationEmail: InputMaybe<Scalars['String']['input']>;
  projectName: InputMaybe<Scalars['String']['input']>;
  telegramHandle: InputMaybe<Scalars['String']['input']>;
  userName: InputMaybe<Scalars['String']['input']>;
  walletAddress: InputMaybe<Scalars['String']['input']>;
};

export type Url = {
  __typename?: 'Url';
  id: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export enum UrlType {
  CancelSubscription = 'cancel_subscription',
  ManageSubscription = 'manage_subscription',
  Subscription = 'subscription',
  UpdatePaymentMethod = 'update_payment_method'
}

export type User = {
  __typename?: 'User';
  communicationEmail: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Time']['output'];
  createdBy: Scalars['String']['output'];
  credits: Maybe<Array<Maybe<Credit>>>;
  deletedAt: Maybe<Scalars['Time']['output']>;
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  invoices: Maybe<Array<Maybe<Invoice>>>;
  isOnboarded: Scalars['Boolean']['output'];
  isProfileCompleted: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  name: Maybe<Scalars['String']['output']>;
  privyId: Scalars['String']['output'];
  projectName: Maybe<Scalars['String']['output']>;
  telegramHandle: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Time']['output'];
  updatedBy: Scalars['String']['output'];
  userName: Maybe<Scalars['String']['output']>;
  walletAddress: Maybe<Scalars['String']['output']>;
};

export enum UserAction {
  DownloadQueryResult = 'DOWNLOAD_QUERY_RESULT',
  GenerateQueryAi = 'GENERATE_QUERY_AI',
  Help = 'HELP',
  RunQuery = 'RUN_QUERY'
}

export type UserActionLog = {
  __typename?: 'UserActionLog';
  createdAt: Maybe<Scalars['Time']['output']>;
  metadata: Maybe<Scalars['Map']['output']>;
  status: Maybe<Scalars['String']['output']>;
  timestamp: Maybe<Scalars['Time']['output']>;
  userAction: Maybe<Scalars['String']['output']>;
  userID: Maybe<Scalars['String']['output']>;
};

export enum UserActionStatus {
  Failed = 'FAILED',
  Success = 'SUCCESS'
}

export type UserAppConfig = {
  __typename?: 'UserAppConfig';
  aiQueryExecuted: Maybe<Scalars['Boolean']['output']>;
  freeCreditsModalShown: Maybe<Scalars['Boolean']['output']>;
  highlightAIComponent: Maybe<Scalars['Boolean']['output']>;
};

export type UserAppConfigInput = {
  aiQueryExecuted: InputMaybe<Scalars['Boolean']['input']>;
  freeCreditsModalShown: InputMaybe<Scalars['Boolean']['input']>;
  highlightAIComponent: InputMaybe<Scalars['Boolean']['input']>;
};

export type Wallet = {
  __typename?: 'Wallet';
  identities: Maybe<Array<Identity>>;
  isEligible: Maybe<Scalars['Boolean']['output']>;
  userId: Maybe<Scalars['String']['output']>;
  walletAddress: Maybe<Scalars['String']['output']>;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', Me: { __typename?: 'User', id: string, email: string | null, name: string | null, userName: string | null, isVerified: boolean, projectName: string | null, walletAddress: string | null, telegramHandle: string | null, communicationEmail: string | null, isProfileCompleted: boolean, credits: Array<{ __typename?: 'Credit', id: string | null, type: string | null, createdAt: any | null, updatedAt: any | null, isPaymentMethodAdded: boolean | null, initialFreeCreditAllocatedTs: any | null, subscription: { __typename?: 'LatestSubscription', id: string, status: string, updatedAt: any | null, endedAtTs: any | null, createdAt: any | null, cancelAtTs: any | null, lastBillingTs: any | null, nextBillingTs: any | null, startBillingTs: any | null, collectionMethod: string | null } | null, keys: Array<{ __typename?: 'Key', id: string | null, key: string | null, type: KeyType | null, status: KeyStatus | null, keyHash: string | null, createdAt: any | null, updatedAt: any | null, usage: { __typename?: 'KeyUsage', lastUpdatedAt: any | null, freeCreditsUsed: number | null, totalFreeCredits: number | null, lifetimeCreditsUsed: number | null, currentCycleCreditsUsed: number | null } | null } | null> | null } | null> | null } | null };
