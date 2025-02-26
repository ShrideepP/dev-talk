/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as MainLayoutImport } from './routes/_main-layout'
import { Route as MainLayoutIndexImport } from './routes/_main-layout/index'
import { Route as MainLayoutCreatePostImport } from './routes/_main-layout/create-post'
import { Route as authAuthLayoutImport } from './routes/(auth)/_auth-layout'
import { Route as authAuthLayoutVerifyEmailImport } from './routes/(auth)/_auth-layout/verify-email'
import { Route as authAuthLayoutResetPasswordImport } from './routes/(auth)/_auth-layout/reset-password'
import { Route as authAuthLayoutRegisterImport } from './routes/(auth)/_auth-layout/register'
import { Route as authAuthLayoutLoginImport } from './routes/(auth)/_auth-layout/login'
import { Route as authAuthLayoutForgotPasswordImport } from './routes/(auth)/_auth-layout/forgot-password'

// Create Virtual Routes

const authImport = createFileRoute('/(auth)')()

// Create/Update Routes

const authRoute = authImport.update({
  id: '/(auth)',
  getParentRoute: () => rootRoute,
} as any)

const MainLayoutRoute = MainLayoutImport.update({
  id: '/_main-layout',
  getParentRoute: () => rootRoute,
} as any)

const MainLayoutIndexRoute = MainLayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => MainLayoutRoute,
} as any)

const MainLayoutCreatePostRoute = MainLayoutCreatePostImport.update({
  id: '/create-post',
  path: '/create-post',
  getParentRoute: () => MainLayoutRoute,
} as any)

const authAuthLayoutRoute = authAuthLayoutImport.update({
  id: '/_auth-layout',
  getParentRoute: () => authRoute,
} as any)

const authAuthLayoutVerifyEmailRoute = authAuthLayoutVerifyEmailImport.update({
  id: '/verify-email',
  path: '/verify-email',
  getParentRoute: () => authAuthLayoutRoute,
} as any)

const authAuthLayoutResetPasswordRoute =
  authAuthLayoutResetPasswordImport.update({
    id: '/reset-password',
    path: '/reset-password',
    getParentRoute: () => authAuthLayoutRoute,
  } as any)

const authAuthLayoutRegisterRoute = authAuthLayoutRegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => authAuthLayoutRoute,
} as any)

const authAuthLayoutLoginRoute = authAuthLayoutLoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => authAuthLayoutRoute,
} as any)

const authAuthLayoutForgotPasswordRoute =
  authAuthLayoutForgotPasswordImport.update({
    id: '/forgot-password',
    path: '/forgot-password',
    getParentRoute: () => authAuthLayoutRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_main-layout': {
      id: '/_main-layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof MainLayoutImport
      parentRoute: typeof rootRoute
    }
    '/(auth)': {
      id: '/(auth)'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authImport
      parentRoute: typeof rootRoute
    }
    '/(auth)/_auth-layout': {
      id: '/(auth)/_auth-layout'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof authAuthLayoutImport
      parentRoute: typeof authRoute
    }
    '/_main-layout/create-post': {
      id: '/_main-layout/create-post'
      path: '/create-post'
      fullPath: '/create-post'
      preLoaderRoute: typeof MainLayoutCreatePostImport
      parentRoute: typeof MainLayoutImport
    }
    '/_main-layout/': {
      id: '/_main-layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof MainLayoutIndexImport
      parentRoute: typeof MainLayoutImport
    }
    '/(auth)/_auth-layout/forgot-password': {
      id: '/(auth)/_auth-layout/forgot-password'
      path: '/forgot-password'
      fullPath: '/forgot-password'
      preLoaderRoute: typeof authAuthLayoutForgotPasswordImport
      parentRoute: typeof authAuthLayoutImport
    }
    '/(auth)/_auth-layout/login': {
      id: '/(auth)/_auth-layout/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof authAuthLayoutLoginImport
      parentRoute: typeof authAuthLayoutImport
    }
    '/(auth)/_auth-layout/register': {
      id: '/(auth)/_auth-layout/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof authAuthLayoutRegisterImport
      parentRoute: typeof authAuthLayoutImport
    }
    '/(auth)/_auth-layout/reset-password': {
      id: '/(auth)/_auth-layout/reset-password'
      path: '/reset-password'
      fullPath: '/reset-password'
      preLoaderRoute: typeof authAuthLayoutResetPasswordImport
      parentRoute: typeof authAuthLayoutImport
    }
    '/(auth)/_auth-layout/verify-email': {
      id: '/(auth)/_auth-layout/verify-email'
      path: '/verify-email'
      fullPath: '/verify-email'
      preLoaderRoute: typeof authAuthLayoutVerifyEmailImport
      parentRoute: typeof authAuthLayoutImport
    }
  }
}

// Create and export the route tree

interface MainLayoutRouteChildren {
  MainLayoutCreatePostRoute: typeof MainLayoutCreatePostRoute
  MainLayoutIndexRoute: typeof MainLayoutIndexRoute
}

const MainLayoutRouteChildren: MainLayoutRouteChildren = {
  MainLayoutCreatePostRoute: MainLayoutCreatePostRoute,
  MainLayoutIndexRoute: MainLayoutIndexRoute,
}

const MainLayoutRouteWithChildren = MainLayoutRoute._addFileChildren(
  MainLayoutRouteChildren,
)

interface authAuthLayoutRouteChildren {
  authAuthLayoutForgotPasswordRoute: typeof authAuthLayoutForgotPasswordRoute
  authAuthLayoutLoginRoute: typeof authAuthLayoutLoginRoute
  authAuthLayoutRegisterRoute: typeof authAuthLayoutRegisterRoute
  authAuthLayoutResetPasswordRoute: typeof authAuthLayoutResetPasswordRoute
  authAuthLayoutVerifyEmailRoute: typeof authAuthLayoutVerifyEmailRoute
}

const authAuthLayoutRouteChildren: authAuthLayoutRouteChildren = {
  authAuthLayoutForgotPasswordRoute: authAuthLayoutForgotPasswordRoute,
  authAuthLayoutLoginRoute: authAuthLayoutLoginRoute,
  authAuthLayoutRegisterRoute: authAuthLayoutRegisterRoute,
  authAuthLayoutResetPasswordRoute: authAuthLayoutResetPasswordRoute,
  authAuthLayoutVerifyEmailRoute: authAuthLayoutVerifyEmailRoute,
}

const authAuthLayoutRouteWithChildren = authAuthLayoutRoute._addFileChildren(
  authAuthLayoutRouteChildren,
)

interface authRouteChildren {
  authAuthLayoutRoute: typeof authAuthLayoutRouteWithChildren
}

const authRouteChildren: authRouteChildren = {
  authAuthLayoutRoute: authAuthLayoutRouteWithChildren,
}

const authRouteWithChildren = authRoute._addFileChildren(authRouteChildren)

export interface FileRoutesByFullPath {
  '': typeof MainLayoutRouteWithChildren
  '/': typeof MainLayoutIndexRoute
  '/create-post': typeof MainLayoutCreatePostRoute
  '/forgot-password': typeof authAuthLayoutForgotPasswordRoute
  '/login': typeof authAuthLayoutLoginRoute
  '/register': typeof authAuthLayoutRegisterRoute
  '/reset-password': typeof authAuthLayoutResetPasswordRoute
  '/verify-email': typeof authAuthLayoutVerifyEmailRoute
}

export interface FileRoutesByTo {
  '/': typeof MainLayoutIndexRoute
  '/create-post': typeof MainLayoutCreatePostRoute
  '/forgot-password': typeof authAuthLayoutForgotPasswordRoute
  '/login': typeof authAuthLayoutLoginRoute
  '/register': typeof authAuthLayoutRegisterRoute
  '/reset-password': typeof authAuthLayoutResetPasswordRoute
  '/verify-email': typeof authAuthLayoutVerifyEmailRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_main-layout': typeof MainLayoutRouteWithChildren
  '/(auth)': typeof authRouteWithChildren
  '/(auth)/_auth-layout': typeof authAuthLayoutRouteWithChildren
  '/_main-layout/create-post': typeof MainLayoutCreatePostRoute
  '/_main-layout/': typeof MainLayoutIndexRoute
  '/(auth)/_auth-layout/forgot-password': typeof authAuthLayoutForgotPasswordRoute
  '/(auth)/_auth-layout/login': typeof authAuthLayoutLoginRoute
  '/(auth)/_auth-layout/register': typeof authAuthLayoutRegisterRoute
  '/(auth)/_auth-layout/reset-password': typeof authAuthLayoutResetPasswordRoute
  '/(auth)/_auth-layout/verify-email': typeof authAuthLayoutVerifyEmailRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/'
    | '/create-post'
    | '/forgot-password'
    | '/login'
    | '/register'
    | '/reset-password'
    | '/verify-email'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/create-post'
    | '/forgot-password'
    | '/login'
    | '/register'
    | '/reset-password'
    | '/verify-email'
  id:
    | '__root__'
    | '/_main-layout'
    | '/(auth)'
    | '/(auth)/_auth-layout'
    | '/_main-layout/create-post'
    | '/_main-layout/'
    | '/(auth)/_auth-layout/forgot-password'
    | '/(auth)/_auth-layout/login'
    | '/(auth)/_auth-layout/register'
    | '/(auth)/_auth-layout/reset-password'
    | '/(auth)/_auth-layout/verify-email'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  MainLayoutRoute: typeof MainLayoutRouteWithChildren
  authRoute: typeof authRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  MainLayoutRoute: MainLayoutRouteWithChildren,
  authRoute: authRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_main-layout",
        "/(auth)"
      ]
    },
    "/_main-layout": {
      "filePath": "_main-layout.tsx",
      "children": [
        "/_main-layout/create-post",
        "/_main-layout/"
      ]
    },
    "/(auth)": {
      "filePath": "(auth)",
      "children": [
        "/(auth)/_auth-layout"
      ]
    },
    "/(auth)/_auth-layout": {
      "filePath": "(auth)/_auth-layout.tsx",
      "parent": "/(auth)",
      "children": [
        "/(auth)/_auth-layout/forgot-password",
        "/(auth)/_auth-layout/login",
        "/(auth)/_auth-layout/register",
        "/(auth)/_auth-layout/reset-password",
        "/(auth)/_auth-layout/verify-email"
      ]
    },
    "/_main-layout/create-post": {
      "filePath": "_main-layout/create-post.tsx",
      "parent": "/_main-layout"
    },
    "/_main-layout/": {
      "filePath": "_main-layout/index.tsx",
      "parent": "/_main-layout"
    },
    "/(auth)/_auth-layout/forgot-password": {
      "filePath": "(auth)/_auth-layout/forgot-password.tsx",
      "parent": "/(auth)/_auth-layout"
    },
    "/(auth)/_auth-layout/login": {
      "filePath": "(auth)/_auth-layout/login.tsx",
      "parent": "/(auth)/_auth-layout"
    },
    "/(auth)/_auth-layout/register": {
      "filePath": "(auth)/_auth-layout/register.tsx",
      "parent": "/(auth)/_auth-layout"
    },
    "/(auth)/_auth-layout/reset-password": {
      "filePath": "(auth)/_auth-layout/reset-password.tsx",
      "parent": "/(auth)/_auth-layout"
    },
    "/(auth)/_auth-layout/verify-email": {
      "filePath": "(auth)/_auth-layout/verify-email.tsx",
      "parent": "/(auth)/_auth-layout"
    }
  }
}
ROUTE_MANIFEST_END */
