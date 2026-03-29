import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string;
    imagePublicId: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductsResponse {
    success: boolean;
    count: number;
    data: Product[];
}

export interface ProductResponse {
    success: boolean;
    data: Product;
}

export interface UploadResponse {
    success: boolean;
    data: {
        url: string;
        publicId: string;
    };
}

export interface Slide {
    _id: string;
    title: string;
    subtitle: string;
    badge: string;
    imageUrl: string;
    imagePublicId: string;
    bgGradient: string;
    order: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Products
    getProducts(params?: {
        search?: string;
        category?: string;
        sort?: string;
    }): Observable<ProductsResponse> {
        let httpParams = new HttpParams();
        if (params?.search) httpParams = httpParams.set('search', params.search);
        if (params?.category) httpParams = httpParams.set('category', params.category);
        if (params?.sort) httpParams = httpParams.set('sort', params.sort);

        return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, {
            params: httpParams,
        });
    }

    getProduct(id: string): Observable<ProductResponse> {
        return this.http.get<ProductResponse>(`${this.apiUrl}/products/${id}`);
    }

    createProduct(product: Partial<Product>): Observable<ProductResponse> {
        return this.http.post<ProductResponse>(`${this.apiUrl}/products`, product);
    }

    updateProduct(id: string, product: Partial<Product>): Observable<ProductResponse> {
        return this.http.put<ProductResponse>(`${this.apiUrl}/products/${id}`, product);
    }

    deleteProduct(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/products/${id}`);
    }

    getCategories(): Observable<{ success: boolean; data: string[] }> {
        return this.http.get<{ success: boolean; data: string[] }>(
            `${this.apiUrl}/products/categories`
        );
    }

    // Bulk stock update
    bulkUpdateStock(updates: { id: string; stock: number }[]): Observable<any> {
        return this.http.patch(`${this.apiUrl}/products/bulk-stock`, { updates });
    }

    // Slides
    getSlides(): Observable<{ success: boolean; data: Slide[] }> {
        return this.http.get<{ success: boolean; data: Slide[] }>(`${this.apiUrl}/slides`);
    }

    getAllSlides(): Observable<{ success: boolean; data: Slide[] }> {
        return this.http.get<{ success: boolean; data: Slide[] }>(`${this.apiUrl}/slides/all`);
    }

    createSlide(slide: Partial<Slide>): Observable<{ success: boolean; data: Slide }> {
        return this.http.post<{ success: boolean; data: Slide }>(`${this.apiUrl}/slides`, slide);
    }

    updateSlide(id: string, slide: Partial<Slide>): Observable<{ success: boolean; data: Slide }> {
        return this.http.put<{ success: boolean; data: Slide }>(`${this.apiUrl}/slides/${id}`, slide);
    }

    deleteSlide(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/slides/${id}`);
    }

    // Upload
    uploadImage(file: File): Observable<UploadResponse> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
    }
}

