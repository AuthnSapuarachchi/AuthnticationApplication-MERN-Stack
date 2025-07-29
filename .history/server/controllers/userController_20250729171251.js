import userModel from "../model/usermodel.js";


export const getUserData = async (req, res) => {
    try {
        const {userId} = req.body;
        console.log('Fetching user data for userId:', userId);

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(userId).select('-password -__v');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, 
            userData: {
                name: user.name,
                is
            } 
    });

    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}