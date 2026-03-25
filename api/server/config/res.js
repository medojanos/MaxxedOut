export function Validate(param) {
    if (!param || param.trim().length === 0) return false;
    return true;
}

export function ValidateNumber(param) {
    if (!Validate(param)) return false;
    if (!Number.isInteger(Number(param)) || Number(param) <= 0) return false;
    return true
}

export function ValidatePassword(password) {
    if (!ValidateNumber(password)) return false;
    if (password < 8) return false;
    return true;
}

export function Error(res, message) {
    return res.status(400).json({success: false, message: message});
}

export function dbError(res) {
    return res.status(500).json({success: false, message: "Database error"});
}

export function Unauthorized(res) {
    return res.status(401).json({success: false, message: "Invalid credentials"});
}

export function Success(res, message) {
    return res.json(200).json({success: true, message: message});
}

export function ReturnData(res, data, message) {
    return res.json(200).json({success: true, data: data});
}