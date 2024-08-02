import axios from 'axios';

const BASE_URL = 'https://www.toori.top/wp-json/wp/v2';

export const getPosts = async (page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/posts?_embed`, {
      params: {
        page,
        per_page: perPage,
        //_fields: 'id,title,author,date,_embedded',
      },
    });
    return {
      data: response.data,
      total: parseInt(response.headers['x-wp-total']),
      totalPages: parseInt(response.headers['x-wp-totalpages']),
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};


export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`, {
      params: {
        _fields: 'id,name',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};