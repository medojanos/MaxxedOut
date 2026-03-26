export function Validate(param) {
    if (!param || param.trim().length === 0) return false;
    return true;
}

export function ValidateArray(param) {
    if (!param || param.length === 0) return false;
    return true;
}

export function ValidateNumber(param) {
    if (!Validate(param)) return false;
    if (!Number.isInteger(Number(param)) || Number(param) <= 0) return false;
    return true
}

export function ValidatePassword(password) {
    if (!Validate(password)) return false;
    if (password.lenght < 8) return false;
    return true;
}

export function Error(res, message) {
    return res.status(400).json({success: false, message: message});
}

export function dbError(res) {
    return res.status(500).json({success: false, message: "Database error"});
}

export function NotFound(res, message) {
    return res.status(404).json({success: false, message: message});
}

export function Unauthorized(res) {
    return res.status(401).json({success: false, message: "Invalid credentials"});
}

export function Success(res, message) {
    return res.status(200).json({success: true, message: message});
}

export function ReturnData(res, data) {
    return res.status(200).json({success: true, data: data});
}