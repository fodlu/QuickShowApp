/* import { createContext, useContext, useEffect, useState } from "react";

import axios from 'axios'
import { useAuth, useUser } from "@clerk/react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [isAdmin, setIsAdmin] = useState(false)
    const [shows, setShows] = useState([])
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const navigate = useNavigate()

    const {user} = useUser();
    const {getToken} = useAuth()
    const location = useLocation()

    const fetchIsAdmin = async () => {
        try {
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
                navigate('/')
                toast.error('You are not authorized to access the admin dashboard')
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchShows = async () =>{
        try {
            const {data} = await axios.get('/api/show/all');

            if(data.success) {
                setShows(data.shows)
            }
        } catch(error) {
            toast.error(error.message)
        }
    }

    const fetchFavoriteMovies = async () => {
        try {
            const {data} = await axios.get('/api/user/favorites', {headers: {Authorization: `Bearer ${await getToken()}`}})
            if(data.success) {
                setFavoriteMovies(data.movies)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=> {
        fetchShows()
    }, [])

    useEffect(()=> {
        if(user) {
            fetchIsAdmin()
            fetchFavoriteMovies()
        }
    }, [user])

    const coded = "hello"


    const value = {
        axios, coded,
        fetchFavoriteMovies,
        fetchIsAdmin,
        fetchShows,
        user, getToken, navigate, isAdmin, shows, favoriteMovies,
    }


    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    useContext(AppContext)
} */

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser, useAuth } from '@clerk/react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const navigate = useNavigate();

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_BASE_URL

    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();

    const fetchIsAdmin = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/admin/is-admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsAdmin(data.isAdmin);

            if (!data.isAdmin && location.pathname.startsWith('/admin')) {
                navigate('/');
                toast.error('You are not authorized to access the admin dashboard');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all');

            if (data.success) {
                setShows(data.shows);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchFavoriteMovies = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setFavoriteMovies(data.movies);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchShows();
    }, []);

    useEffect(() => {
        if (user) {
            fetchIsAdmin();
            fetchFavoriteMovies();
        }
    }, [user]);

    const coded = "hello";

    const value = {
        axios, coded,
        fetchFavoriteMovies,
        fetchIsAdmin,
        fetchShows, image_base_url,
        user, getToken, navigate, isAdmin, shows, favoriteMovies,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// 1. Actionable: Create a Custom Hook to simplify consuming the context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
