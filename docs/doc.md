# Doc Documentation

## Overview

This module provides decorators for API documentation using [Swagger/OpenAPI][ref-nestjs-swagger]. It creates standardized, consistent API documentation with minimal boilerplate code.

Features:
- Standardized API documentation structure
- Automatic error response documentation
- Built-in pagination support
- File upload/download documentation
- Multiple authentication method support
- Request validation documentation
- Custom language header support

## Related Documents

- [Request Validation][ref-doc-request-validation] - For DTO validation and request documentation
- [Response][ref-doc-response] - For response structure and formatting
- [Authentication][ref-doc-authentication] - For authentication decorator usage
- [Authorization][ref-doc-authorization] - For authorization guard documentation

## Table of Contents

- [Overview](#overview)
- [Related Documents](#related-documents)
- [Core Decorators](#core-decorators)
    - [Doc](#doc)
    - [DocRequest](#docrequest)
    - [DocRequestFile](#docrequestfile)
    - [DocResponse](#docresponse)
    - [DocResponsePaging](#docresponsepaging)
    - [DocResponseFile](#docresponsefile)
    - [DocAuth](#docauth)
    - [DocGuard](#docguard)
- [Advanced Decorators](#advanced-decorators)
    - [DocDefault](#docdefault)
    - [DocOneOf](#doconeof)
    - [DocAnyOf](#docanyof)
    - [DocAllOf](#docallof)
    - [DocErrorGroup](#docerrorgroup)
- [DTO Documentation](#dto-documentation)
    - [ApiProperty](#apiproperty)
    - [Params Constants](#params-constants)
    - [Queries Constants](#queries-constants)
- [Constants](#constants)
- [Usage Examples](#usage-examples)
    - [Complete Admin Endpoint](#complete-admin-endpoint)
    - [Complete Public Endpoint](#complete-public-endpoint)
    - [Paginated List Endpoint](#paginated-list-endpoint)
    - [File Upload Endpoint](#file-upload-endpoint)


## Core Decorators

### Doc

Basic API documentation decorator that sets up common operation metadata.

**Parameters:**

- `options?: IDocOptions`
    - `summary?: string` - Operation summary
    - `operation?: string` - Operation ID
    - `deprecated?: boolean` - Mark as deprecated
    - `description?: string` - Detailed description

**Auto-includes:**

- Custom language header (`x-custom-lang`)
- Internal server error response (500)
- Request timeout response (408)

**Usage:**

```typescript
@Doc({
    summary: 'Get user profile',
    operation: 'getUserProfile',
    description: 'Retrieve authenticated user profile information'
})
@Get('/profile')
async getProfile() {
    // implementation
}
```

### DocRequest

Documents request specifications including body, parameters, and queries.

**Parameters:**

- `options?: IDocRequestOptions`
    - `params?: ApiParamOptions[]` - URL parameters
    - `queries?: ApiQueryOptions[]` - Query parameters
    - `bodyType?: ENUM_DOC_REQUEST_BODY_TYPE` - Request body content type
    - `dto?: ClassConstructor<T>` - Request DTO class

**Body Types:**

```typescript
enum ENUM_DOC_REQUEST_BODY_TYPE {
    JSON = 'json',
    FORM_DATA = 'formData',
    FORM_URLENCODED = 'formUrlencoded',
    TEXT = 'text',
    NONE = 'none',
}
```

**Auto-includes:**

- Content-Type header based on bodyType
- Validation error response (422) when bodyType is specified

**Usage:**

```typescript
@DocRequest({
    params: [
        {
            name: 'id',
            required: true,
            type: 'string'
        }
    ],
    queries: [
        {
            name: 'include',
            required: false,
            type: 'string'
        }
    ],
    bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
    dto: UpdateUserDto
})
@Put('/:id')
async updateUser() {
    // implementation
}
```

### DocRequestFile

Documents file upload endpoints with multipart/form-data.

**Parameters:**

- `options?: IDocRequestFileOptions` - Same as `DocRequest` but excludes `bodyType`

**Auto-includes:**

- Content-Type: multipart/form-data

**Usage:**

```typescript
@DocRequestFile({
    params: [
        {
            name: 'id',
            required: true,
            type: 'string'
        }
    ],
    dto: UserUploadDto
})
@Post('/upload')
async uploadFile() {
    // implementation
}
```

### DocResponse

Documents standard response with message and optional data.

**Parameters:**

- `messagePath: string` - i18n message path
- `options?: IDocResponseOptions<T>`
    - `statusCode?: number` - Custom status code
    - `httpStatus?: HttpStatus` - HTTP status (default: 200)
    - `dto?: ClassConstructor<T>` - Response DTO class

**Auto-includes:**

- Content-Type: application/json
- Standard response schema with message, statusCode, and data

**Usage:**

```typescript
@DocResponse<UserProfileResponseDto>('user.get', {
    dto: UserProfileResponseDto
})
@Get('/:id')
async getUser() {
    // implementation
}

@DocResponse('user.delete', {
    httpStatus: HttpStatus.NO_CONTENT
})
@Delete('/:id')
async deleteUser() {
    // implementation
}
```

### DocResponsePaging

Documents paginated response with automatic pagination parameters.

**Parameters:**

- `messagePath: string` - i18n message path
- `options: IDocResponsePagingOptions<T>`
    - `dto: ClassConstructor<T>` - Response DTO class (required)
    - `statusCode?: number` - Custom status code
    - `httpStatus?: HttpStatus` - HTTP status
    - `availableSearch?: string[]` - Searchable fields
    - `availableOrder?: string[]` - Sortable fields

**Auto-includes:**

- Standard pagination query parameters:
    - `perPage` - Data per page (max: 100)
    - `page` - Page number (max: 20)
- Optional search query when `availableSearch` provided
- Optional ordering queries when `availableOrder` provided:
    - `orderBy` - Field to order by
    - `orderDirection` - ASC or DESC

**Usage:**

```typescript
@DocResponsePaging<UserListResponseDto>('user.list', {
    dto: UserListResponseDto,
    availableSearch: ['name', 'email'],
    availableOrder: ['createdAt', 'name']
})
@Get('/list')
async getUsers() {
    // implementation
}
```

### DocResponseFile

Documents file download/response endpoints.

**Parameters:**

- `options?: IDocResponseFileOptions`
    - `httpStatus?: HttpStatus` - HTTP status (default: 200)
    - `extension?: ENUM_FILE_EXTENSION` - File extension (default: CSV)

**Usage:**

```typescript
@DocResponseFile({
    extension: ENUM_FILE_EXTENSION.XLSX
})
@Get('/export')
async exportData() {
    // implementation
}
```

### DocAuth

Documents authentication requirements and error responses.

**Parameters:**

- `options?: IDocAuthOptions`
    - `jwtAccessToken?: boolean` - Require access token
    - `jwtRefreshToken?: boolean` - Require refresh token
    - `xApiKey?: boolean` - Require API key
    - `google?: boolean` - Require Google OAuth
    - `apple?: boolean` - Require Apple OAuth

**Auto-includes:**

- Bearer auth or security scheme based on options
- Unauthorized error responses (401) for each auth method

**Usage:**

```typescript
@DocAuth({
    jwtAccessToken: true,
    xApiKey: true
})
@Get('/protected')
async protectedRoute() {
    // implementation
}

@DocAuth({
    google: true,
    xApiKey: true
})
@Post('/auth/google')
async googleLogin() {
    // implementation
}
```

### DocGuard

Documents authorization guards and forbidden responses.

**Parameters:**

- `options?: IDocGuardOptions`
    - `role?: boolean` - Role-based guard
    - `policy?: boolean` - Policy-based guard

**Auto-includes:**

- Forbidden error responses (403) based on guard types

**Usage:**

```typescript
@DocGuard({
    role: true,
    policy: true
})
@Post('/admin/users')
async createUser() {
    // implementation
}
```

## Advanced Decorators

### DocDefault

Creates standard response schema with message, statusCode, and optional data.

**Parameters:**

- `options: IDocDefaultOptions<T>`
    - `httpStatus: HttpStatus` - HTTP status (required)
    - `messagePath: string` - i18n message path (required)
    - `statusCode: number` - Custom status code (required)
    - `dto?: ClassConstructor<T>` - Response DTO class

**Usage:**

```typescript
@DocDefault({
    httpStatus: HttpStatus.CREATED,
    messagePath: 'resource.created',
    statusCode: HttpStatus.CREATED,
    dto: CreatedResourceDto
})
@Post('/resource')
async createResource() {
    // implementation
}
```

### DocOneOf

Documents endpoint that returns one of several possible response types.

**Parameters:**
