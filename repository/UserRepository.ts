
import bcrypt from "bcrypt";
import User from "../schema/UserSchema";

export async function saveUser(user: { username: string; password: string,  }) {
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const newUser = new User({
            username: user.username,
            password: hashedPassword,
        });

        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error saving user:", error);
        throw error;
    }
}

export async function verifyUserCredentials( username: string, password: string ) {
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return false;
        }

        if (!user.password) {
            throw new Error("User password not found.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        return passwordMatch;
    } catch (error) {
        console.error("Error verifying user credentials:", error);
        throw error;
    }
}