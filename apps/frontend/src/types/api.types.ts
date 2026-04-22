export interface ApiResponse<T>{
    success: boolean,
    data: T
}

export interface PaginatedResponse<T> extends ApiResponse<T[]>{
    meta: {
        total: number,
        page: number,
        limit: number
    }
}

export interface ApiError{
    success: false,
    message: string,
    errors?: FieldError[]
}

export interface FieldError{
    field: string,
    message: string
}