import axios from "axios";

export const httpRequest = axios.create({
  baseURL: "http://PSL-H8QN863:5000",
});


export const ImageConfig = {
    default: '../assets/file-blank-solid-240.png',
    pdf: '../assets/file-pdf-solid-240.png',
    png: '../assets/file-pdf-solid-240.png',
    css: '../assets/file-pdf-solid-240.png'
}

export const getStatus = (input) => {
  const result = new Map();
  const regex = /(\d+): (.+?)(?=\d+: |\z)/g;
  let match;

  while ((match = regex.exec(input)) !== null) {
      if (match.index === regex.lastIndex) {
          regex.lastIndex++;
      }
      result.set(parseInt(match[1]), match[2]);
  }
  const res = []
  result.forEach((value, key) => {
      res.push(`${key}: ${value}`)
  });
  return res;
}

export const splitter = (input) => input.split(/\d+\./).filter(sentence => sentence.trim() !== '');
