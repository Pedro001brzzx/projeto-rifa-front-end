/**
 * Campaign Service
 * Handles API calls for campaign CRUD operations
 */

import type { Campaign } from '../models/types';
import { getAuthHeaders } from './authService';

// TODO: Configure this with your actual API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get all campaigns
 */
export const getCampaigns = async (): Promise<Campaign[]> => {
    try {
        const response = await fetch(`${API_URL}/campaigns`);

        if (!response.ok) {
            throw new Error('Failed to fetch campaigns');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
};

/**
 * Get campaign by ID
 */
export const getCampaignById = async (id: number): Promise<Campaign> => {
    try {
        const response = await fetch(`${API_URL}/campaigns/${id}`);

        if (!response.ok) {
            throw new Error('Failed to fetch campaign');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching campaign:', error);
        throw error;
    }
};

/**
 * Create a new campaign (admin only)
 */
export const createCampaign = async (campaignData: Omit<Campaign, 'id'>): Promise<Campaign> => {
    try {
        const response = await fetch(`${API_URL}/campaigns`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(campaignData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create campaign');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating campaign:', error);
        throw error;
    }
};

/**
 * Update an existing campaign (admin only)
 */
export const updateCampaign = async (id: number, campaignData: Partial<Campaign>): Promise<Campaign> => {
    try {
        const response = await fetch(`${API_URL}/campaigns/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(campaignData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update campaign');
        }

        return await response.json();
    } catch (error) {
        console.error('Error updating campaign:', error);
        throw error;
    }
};

/**
 * Delete a campaign (admin only)
 */
export const deleteCampaign = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/campaigns/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete campaign');
        }
    } catch (error) {
        console.error('Error deleting campaign:', error);
        throw error;
    }
};

/**
 * Upload campaign image
 */
export const uploadImage = async (file: File): Promise<string> => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const authHeaders = getAuthHeaders();
        const response = await fetch(`${API_URL}/campaigns/upload`, {
            method: 'POST',
            headers: {
                ...authHeaders,
                // Remove Content-Type to let browser set it with boundary for FormData
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.imageUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
