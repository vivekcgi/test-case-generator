import axios from "axios";

export const httpRequest = axios.create({
  baseURL: "http://localhost:5000",
});


export const ImageConfig = {
    default: '../assets/file-blank-solid-240.png',
    pdf: '../assets/file-pdf-solid-240.png',
    png: '../assets/file-pdf-solid-240.png',
    css: '../assets/file-pdf-solid-240.png'
}

