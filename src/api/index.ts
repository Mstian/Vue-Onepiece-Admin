import request from "@/request/index.js";

export const getTableList = () => {
    return request.get('http://localhost:3000/wans');
};
export const getItem = (data: any) => {
    return request.get(`http://localhost:3000/wans/${data.id}`);
};
export const deleteItem = (data: any) => {
    return request.delete(`http://localhost:3000/wans/${data.id}`);
};

