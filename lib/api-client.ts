import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

export type ApiResponseBackend<T> = {
  success: boolean
  data?: T
  message: string
}

export type ApiResponseHandler<T> = {
  data?: T
  error?: string
  status: number
}

export type PushTokenRequest = {
  token: string
  deviceId?: string
  platform: 'ios' | 'android'
}

const BACKEND_URI = Constants.expoConfig?.extra?.backendUri ?? ''

const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('authToken')
  } catch {
    return null
  }
}

const buildOptions = async (method: string, body?: any, authenticated: boolean = true): Promise<RequestInit> => {
  const headers: HeadersInit = {}
  if (method !== 'GET' && method !== 'DELETE') {
    headers['Content-Type'] = 'application/json'
  }
  if (authenticated) {
    const token = (await getAuthToken())?.trim()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }
  return {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined
  }
}

const handleResponse = async <T>(response: Response): Promise<ApiResponseHandler<T>> => {
  let raw: unknown
  try {
    raw = await response.json()
  } catch {
    return {
      status: response.status,
      error: 'Error al parsear JSON'
    }
  }
  const parsed = raw as ApiResponseBackend<T>
  if (response.ok && parsed.success) {
    console.info(parsed.message)
    return {
      status: response.status,
      data: parsed.data!
    }
  }
  return {
    status: response.status,
    error: parsed.message || 'Error desconocido'
  }
}

export const apiClient = {
  async get<T>(endpoint: string, authenticated: boolean = true): Promise<ApiResponseHandler<T>> {
    try {
      const options = await buildOptions('GET', undefined, authenticated)
      const response = await fetch(`${BACKEND_URI}${endpoint}`, options)
      return handleResponse<T>(response)
    } catch {
      return { status: 500, error: 'Network error' }
    }
  },

  async post<T>(endpoint: string, body: any, authenticated: boolean = true): Promise<ApiResponseHandler<T>> {
    try {
      const options = await buildOptions('POST', body, authenticated)
      const response = await fetch(`${BACKEND_URI}${endpoint}`, options)
      return handleResponse<T>(response)
    } catch {
      return { status: 500, error: 'Network error' }
    }
  },

  async put<T>(endpoint: string, body: any, authenticated: boolean = true): Promise<ApiResponseHandler<T>> {
    try {
      const options = await buildOptions('PUT', body, authenticated)
      const response = await fetch(`${BACKEND_URI}${endpoint}`, options)
      return handleResponse<T>(response)
    } catch {
      return { status: 500, error: 'Network error' }
    }
  },

  async delete<T>(endpoint: string, authenticated: boolean = true): Promise<ApiResponseHandler<T>> {
    try {
      const options = await buildOptions('DELETE', undefined, authenticated)
      const response = await fetch(`${BACKEND_URI}${endpoint}`, options)
      return handleResponse<T>(response)
    } catch {
      return { status: 500, error: 'Network error' }
    }
  }
}
