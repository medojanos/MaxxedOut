export const authU = (req, res) => {
    res.json({
        success: true,
        userId: req.user
    });
};

export const authA = (req, res) => {
    res.json({
        success: true,
        message: "Admin authorized"
    });
};