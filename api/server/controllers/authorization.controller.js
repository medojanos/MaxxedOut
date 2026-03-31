import {ReturnData, NoContent} from "../config/utility.js";

export const authU = (req, res) => {
    ReturnData(res, {userId: req.user});
};

export const authA = (req, res) => {
    NoContent(res);
};