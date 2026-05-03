export function Validate(param) {
    if(param === null || param === undefined) return false;
    if(typeof param !== "string") return false;
    if (param.trim().length === 0) return false;
    return true;
}

export function ValidateArray(param) {
    if (!param || !Array.isArray(param)) return false;
    return true;
}

export function ValidateNumber(param) {
    if (param === null || param === undefined) return false;

    const num = Number(param);

    if(Number.isNaN(num)) return false;
    if (!Number.isInteger(num) || num <= 0) return false;
    
    return true
}

export function ValidatePassword(password) {
    if (!Validate(password)) return false;
    if (password.length < 8) return false;
    return true;
}

export function Error(res, message) {
    return res.status(400).json({error: message});
}

export function Unauthorized(res) {
    return res.status(401).json({error: "Invalid credentials"});
}

export function NotFound(res, message) {
    return res.status(404).json({error: message});
}

export function dbError(res, err) {
    console.error(err);
    return res.status(500).json({error: "Database error"});
}

export function Success(res, message) {
    return res.status(200).json({message: message});
}

export function ReturnData(res, data) {
    return res.status(200).json({data: data});
}

export function Created(res, message) {
    return res.status(201).json({message: message});
}

export function NoContent(res) {
    return res.status(204).send();
}